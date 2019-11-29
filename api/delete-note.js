const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });

const { getResponseHeaders, getUserId } = require("./util");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async event => {
  try {
    let timestamp = parseInt(event.pathParameters.timestamp);
    let params = {
      TableName: tableName,
      Key: {
        user_id: getUserId(event.headers),
        timestamp: timestamp
      }
    };

    await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      headers: getResponseHeaders()
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error"
      })
    };
  }
};
