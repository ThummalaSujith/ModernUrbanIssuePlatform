import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async (event) => {
  // 1. Parse input
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: getCorsHeaders(),
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  // 2. Validate required fields
  const { postId, text, author } = body;
  const parentId = body.parentId || null; // Make parentId optional
  
  if (!postId || !text || !author) {
    return {
      statusCode: 400,
      headers: getCorsHeaders(),
      body: JSON.stringify({ 
        error: "Missing required fields",
        required: ["postId", "text", "author"]
      })
    };
  }

  // 3. Prepare comment item
  const comment = {
    postId,
    commentId: body.commentId || generateId(), // Use provided ID or generate
    parentId,
    text,
    createdAt: body.createdAt || new Date().toISOString(),
    author,
    // Additional fields you might want:
    updatedAt: new Date().toISOString(),
    likes: 0
  };

  // 4. Save to DynamoDB
  try {
    await ddb.send(
      new PutCommand({
        TableName: "CommentTable",
        Item: comment,
        // Optional: Prevent overwrites
        ConditionExpression: "attribute_not_exists(commentId)"
      })
    );

    return {
      statusCode: 201,
      headers: getCorsHeaders(),
      body: JSON.stringify({ 
        success: true,
        comment 
      })
    };
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return {
      statusCode: error.name === "ConditionalCheckFailedException" ? 409 : 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ 
        error: error.name === "ConditionalCheckFailedException" 
          ? "Comment already exists" 
          : "Internal server error"
      })
    };
  }
};

// Helper functions
function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
    "Content-Type": "application/json"
  };
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}