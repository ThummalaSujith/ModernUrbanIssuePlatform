import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const { postId, commentId, text } = body;

  if (!postId || !commentId || !text) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" })
    };
  }

  try {
   const result= await ddb.send(new UpdateCommand({
      TableName: "CommentTable",
      Key: {commentId },
      UpdateExpression: "set #text = :text",
      ExpressionAttributeNames: { "#text": "text" },
      ExpressionAttributeValues: { ":text": text },
      ReturnValues: "ALL_NEW"
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ 
      message: "Comment updated" ,
      updatedComment: result.Attributes
    })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};