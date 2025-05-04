import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { RekognitionClient, DetectModerationLabelsCommand, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { ComprehendClient, DetectSentimentCommand } from "@aws-sdk/client-comprehend";
import { v4 as uuidv4 } from "uuid";

// Initialize AWS clients
const s3 = new S3Client({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const rekognition = new RekognitionClient({});
const comprehend = new ComprehendClient({ region: 'us-east-1' }); // Using us-east-1 for full Comprehend support

// Helper function to validate environment variables
const validateEnvironment = () => {
  const requiredEnvVars = ['BUCKET_NAME', 'DYNAMODB_TABLE'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
};

// Helper function to validate location object
const validateLocation = (location) => {
  if (!location || typeof location !== 'object') {
    throw new Error('Location must be an object');
  }
  
  if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    throw new Error('Location must contain numeric lat and lng properties');
  }

  if (Math.abs(location.lat) > 90 || Math.abs(location.lng) > 180) {
    throw new Error('Invalid coordinates: lat must be between -90 and 90, lng between -180 and 180');
  }
};

// Helper function to validate image type
const validateImageType = (imageType) => {
  const validTypes = ['jpg', 'jpeg', 'png', 'gif'];
  if (!validTypes.includes(imageType.toLowerCase())) {
    throw new Error(`Invalid image type. Must be one of: ${validTypes.join(', ')}`);
  }
};

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Content-Type": "application/json",
  };

  try {
    // Validate environment variables first
    validateEnvironment();

    console.log("Incoming event:", JSON.stringify(event, null, 2));

    // 1️⃣ Parse and validate request body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      console.error("JSON parse error:", e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid JSON format" }),
      };
    }

    console.log("Parsed body:", JSON.stringify(body, null, 2));

    const { category, description, location, imageBase64, imageType, submittedBy } = body;

    // 2️⃣ Validate required fields with detailed error messages
    const missingFields = [];
    if (!category) missingFields.push("category");
    if (!description) missingFields.push("description");
    if (!location) missingFields.push("location");
    if (!imageBase64) missingFields.push("imageBase64");
    if (!imageType) missingFields.push("imageType");

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "Missing required fields",
          missingFields 
        }),
      };
    }

    // Validate location structure and image type
    try {
      validateLocation(location);
      validateImageType(imageType);
    } catch (validationError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: validationError.message }),
      };
    }

    // 3️⃣ Validate and convert base64 image
    let buffer;
    try {
      if (!/^[A-Za-z0-9+/=]+$/.test(imageBase64)) {
        throw new Error("Invalid base64 string format");
      }
      console.log("Received imageBase64 (start):", imageBase64 ? imageBase64.substring(0, 50) : 'imageBase64 is missing or empty');
      
      // Check approximate size (6MB max)
      const sizeInBytes = (imageBase64.length * 3) / 4;
      if (sizeInBytes > 6 * 1024 * 1024) {
        throw new Error("Image size exceeds 6MB limit");
      }
      
      buffer = Buffer.from(imageBase64, "base64");
    } catch (imageError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "Invalid image data",
          details: imageError.message 
        }),
      };
    }

    // 4️⃣ Image validation with Rekognition
    let moderationResult, labelsResult;
    let inappropriateContent = false; // Initialize here to make it available in the whole function
    
    try {
      [moderationResult, labelsResult] = await Promise.all([
        rekognition.send(new DetectModerationLabelsCommand({ 
          Image: { Bytes: buffer },
          MinConfidence: 80 // Only consider labels with 80%+ confidence
        })),
        rekognition.send(new DetectLabelsCommand({ 
          Image: { Bytes: buffer },
          MinConfidence: 70 // Only consider labels with 70%+ confidence
        }))
      ]);

      // Check for inappropriate content
      inappropriateContent = moderationResult.ModerationLabels?.some(
        label => ["Explicit Nudity", "Violence", "Suggestive"].includes(label.ParentName)
      );

      if (inappropriateContent) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: "Image contains inappropriate content",
            moderationLabels: moderationResult.ModerationLabels
          }),
        };
      }

      // Check for valid urban issue
      const validLabels = new Set(['Pothole', 'Graffiti', 'Garbage', 'Broken', 'Damage', 'Street', 'Road', 'Construction']);
      const hasValidLabel = labelsResult.Labels?.some(label => 
        validLabels.has(label.Name) && label.Confidence > 70
      );

      if (!hasValidLabel) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: "Image doesn't appear to show a valid urban issue",
            detectedLabels: labelsResult.Labels?.map(l => l.Name)
          }),
        };
      }
    } catch (awsError) {
      console.error("AWS Rekognition error:", awsError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Image validation service unavailable",
          details: awsError.message 
        }),
      };
    }

    // 5️⃣ Text validation with Comprehend (only using supported features)
    let sentimentResult;
    try {
      sentimentResult = await comprehend.send(new DetectSentimentCommand({
        Text: description,
        LanguageCode: 'en'
      }));

      const isNegative = sentimentResult.Sentiment === 'NEGATIVE' &&
        sentimentResult.SentimentScore?.Negative > 0.7;

      if (isNegative) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: "Description contains negative content",
            sentiment: sentimentResult.Sentiment,
            sentimentScores: sentimentResult.SentimentScore
          }),
        };
      }
    } catch (awsError) {
      console.error("AWS Comprehend error:", awsError);
      // Continue processing even if Comprehend fails as it's not critical
      console.warn("Continuing without full text analysis due to Comprehend error");
    }

    // 6️⃣ Upload to S3
    const imageId = uuidv4();
    const imageKey = `uploads/${imageId}.${imageType.toLowerCase()}`;
    let imageUrl;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: imageKey,
          Body: buffer,
          ContentType: `image/${imageType.toLowerCase()}`,
        })
      );
      imageUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Failed to upload image",
          details: s3Error.message 
        }),
      };
    }

    // 7️⃣ Save to DynamoDB
    const timestamp = new Date().toISOString();
    const issueItem = {
      id: imageId,
      category,
      description,
      location,
      imageUrl,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: "OPEN",
      submittedBy: submittedBy || "anonymous",
      validationData: {
        imageLabels: labelsResult.Labels?.map(label => ({
          name: label.Name,
          confidence: label.Confidence
        })),
        sentiment: sentimentResult?.Sentiment,
        sentimentScores: sentimentResult?.SentimentScore,
        moderationCheck: !inappropriateContent, // Now properly referenced
        contentCheck: true
      }
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_TABLE,
          Item: issueItem,
        })
      );
    } catch (dynamoError) {
      console.error("DynamoDB error:", dynamoError);
      
      // Attempt to clean up the S3 object if DynamoDB fails
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: imageKey
        }));
      } catch (cleanupError) {
        console.error("Failed to clean up S3 object:", cleanupError);
      }

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Failed to save issue",
          details: dynamoError.message 
        }),
      };
    }

    // 8️⃣ Success response
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        message: "Issue submitted successfully",
        issueId: imageId,
        imageUrl,
        timestamp 
      }),
    };

  } catch (error) {
    console.error("Unhandled error:", {
      message: error.message,
      stack: error.stack,
      event: event
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};