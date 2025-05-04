import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async (event) => {
const commentId=event.pathParameters?.commentId;

  if (!commentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
      headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      }
    };
  }

  try {
    await ddb.send(new DeleteCommand({
      TableName: "CommentTable",
      Key: {commentId}
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Comment deleted" }),
      headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      }
    };
  }
};
