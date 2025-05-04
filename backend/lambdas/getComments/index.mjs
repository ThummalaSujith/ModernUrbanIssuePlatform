import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        // Get postId from query parameters
        const postId = event.queryStringParameters?.postId;
        
        if (!postId) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*", // For CORS support
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: "postId is required" })
            };
        }
        
        // Query the GSI to get all comments for this post
        const params = {
            TableName: 'CommentTable',
            IndexName: 'PostIdCreatedAtIndex',
            KeyConditionExpression: 'postId = :pid AND #createdAt >= :date',
            ExpressionAttributeNames: {
                '#createdAt': 'createdAt' // ⬅️ to avoid reserved word issues
              },
              ExpressionAttributeValues: {
                ':pid': postId,
                ':date': '0000-01-01T00:00:00Z' // ⬅️ fetch all comments regardless of date
              },
        };

        console.log('Query params:', params);
        
        const command = new QueryCommand(params);
        const result = await docClient.send(command);
        
        // Convert flat comments list to a nested structure (comments with replies)
        const commentTree = buildCommentTree(result.Items);
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",  
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Content-Type": "application/json"
              
 
            },
            body: JSON.stringify(commentTree)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",  
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: "Error retrieving comments", error: error.message })
        };
    }
};

// Helper function to build a tree of comments from flat list
function buildCommentTree(comments) {
    // Map to store all comments by ID for quick lookup
    const commentMap = {};
    // Array to store top-level comments
    const rootComments = [];
    
    // First pass: Create a map of all comments by ID
    comments.forEach(comment => {
        commentMap[comment.commentId] = {
            ...comment,
            replies: []
        };
    });
    
    // Second pass: Build the tree structure
    comments.forEach(comment => {
        const commentWithReplies = commentMap[comment.commentId];
        
        if (comment.parentId) {
            // This is a reply - add it to its parent's replies
            const parent = commentMap[comment.parentId];
            if (parent) {
                parent.replies.push(commentWithReplies);
            } else {
                // Parent not found, treat as root comment
                rootComments.push(commentWithReplies);
            }
        } else {
            // This is a root comment
            rootComments.push(commentWithReplies);
        }
    });
    
    return rootComments;
}