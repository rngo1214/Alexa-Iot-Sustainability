const Alexa = require('ask-sdk');
var AWS = require("aws-sdk");
var fs = require('fs');
console.log('Loading Function');

AWS.config.update({region: 'REGION'});

console.log('Loading function');

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    event.Records.forEach((record) => {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
    });
    return `Successfully processed ${event.Records.length} records.`;
};