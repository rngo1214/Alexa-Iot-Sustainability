//Dependencies
const Alexa = require('ask-sdk');
const promisify = require('es6-promisify');
var AWS = require("aws-sdk");
//Not sure what this is
//var fs = require('fs');

//ID of the alexa skill, to be changed when migrating to actual aws account
const skillId = 'amzn1.ask.skill.614a8c00-fe80-4a0b-a784-62973fa6d8f0'
//Name of the DynamoDB database
const test = 'test';
//Instantiating new DynamoDB DocumentClient
const docClient = new awsSDK.DynamoDB.DocumentClient();

// convert callback style functions to promises
const dbScan = promisify(docClient.scan, docClient);
const dbGet = promisify(docClient.get, docClient);
const dbPut = promisify(docClient.put, docClient);
const dbDelete = promisify(docClient.delete, docClient);

//Testing purposes
console.log('Loading Function');

//Not sure if required or not
AWS.config.update({region: 'REGION'});

//
const dynamoParams = {
    TableName: test
};

//query DynamoDB
dbGet(dynamoParams)
.then(data => {
    console.log('Get item succeeded', data);
})
.catch(err => console.error(err));

// exports.handler = async (event, context) => {
//     //console.log('Received event:', JSON.stringify(event, null, 2));
//     event.Records.forEach((record) => {
//         console.log(record.eventID);
//         console.log(record.eventName);
//         console.log('DynamoDB Record: %j', record.dynamodb);
//     });
//     return `Successfully processed ${event.Records.length} records.`;
// };
