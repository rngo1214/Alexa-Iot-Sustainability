const Alexa = require('ask-sdk');
var AWS = require("aws-sdk");
var fs = require('fs');
console.log('Loading Function');

AWS.config.update({region: 'REGION'});

