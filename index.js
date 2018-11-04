/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
var AWS = require('aws-sdk');
var Firebase = require('firebase');

var config = {
    apiKey: "AIzaSyCUwDf5ctiWbyhzeEYQmJPV9zwpFotKeD8",
    authDomain: "raspberrypi-f3a20.firebaseapp.com",
    databaseURL: "https://raspberrypi-f3a20.firebaseio.com",
    storageBucket: "raspberrypi-f3a20.appspot.com",
};
Firebase.initializeApp(config);

var waterUsage = 0.0;
var db = Firebase.database();
//database reader
var ref = db.ref("/test1");
var database = Firebase.database().ref('/test1/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childNodes){
        var whatever = parseFloat(childNodes.val().Flow);
        console.log(whatever);
        waterUsage = waterUsage + whatever;
    });
    //cut the floating point off
    waterUsage = parseInt(waterUsage);
    console.log(waterUsage);    
});    


//arrays
const sustainabilityFacts = [
  'You can be more sustainable by taking shorter showers.',
  'One way to save water is by only running your washer or dishwasher when it is completely full, rather than running a load that is only half-full.',
  'You can conserve water by not washing your clothes until you have worn them more than once.', 
  'You can conserve water by watering your lawn less often.',
];

const SustainabilityHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'SustainabilityIntent');
  },
  handle(handlerInput) {
    const sustainabilityArr = sustainabilityFacts;
    const sustainabilityIndex = Math.floor(Math.random() * sustainabilityArr.length);
    const randomFact = sustainabilityArr[sustainabilityIndex];
    const speechOutput = randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const GetUsageHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'GetUsageIntent';
  },
  handle(handlerInput) {

    const request = handlerInput.requestEnvelope.request;
    var speechOutput = 'big daddy bezos';
    const date = request.intent.slots.date.value;
    if (date !== "?") {
      if (typeof date == 'undefined') {
        speechOutput = 'Today you have used ' + waterUsage + ' gallons of water.';
      } else {
        speechOutput = 'On ' + date + ' you have used ' + waterUsage + ' gallons of water.';
      }
    } else {
      speechOutput = 'I couldn\'t understand date you entered.'; 
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};

const CompareUsageHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'CompareUsageIntent';
  },
  handle(handlerInput) {

    var speechOutput = 'big daddy bezos';
    if (waterUsage > 82) {
      speechOutput = 'you have used ' + waterUsage + ' gallons today, which is ' + (waterUsage-82) + ' more than the national average of 82 gallons per day';
    } else if (waterUsage < 82) {
      speechOutput = 'you have only used ' + waterUsage + ' gallons today, which is ' + (82-waterUsage) + ' fewer than the national average 82 gallons per day';
    } else {
      speechOutput = 'you have used exactly 82 gallons today. which is equal to the national average';
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  },
};


const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'water drop';
const WELCOME_MESSAGE = 'Hi there! I’m Water Drop. You can ask me to track your water usage, compare your water usage, or give sustainibility tips... Ask away!';
const HELP_MESSAGE = 'You can ask me to track your water usage, compare your water usage, or give sustainibility tips... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Remember to stay sustainable! Goodbye.';


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    SustainabilityHandler,
    GetUsageHandler,
    CompareUsageHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
