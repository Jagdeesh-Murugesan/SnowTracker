/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const request = require('request');
const config = require('./config');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Snow Tracker Skill.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const TicketSeverityCountIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TicketSeverityCountIntent';
  },
  handle(handlerInput) {
    let speechText = 'TicketSeverityCountIntent';

    request({
      url: "https://dev52396.service-now.com/api/now/table/incident?sysparm_limit=1",
      method: "GET",
      json: true,
      headers: {
        "Authorization": "Basic " + (new Buffer(config.username + ":" + config.password)).toString("base64"),
        "Accept": "application/json"
      }
    }, (error, response, result) => {
      if (error) {
        console.log('Error ' + error);
        speechText = 'Received error response from Jira';
        this.response.speak(speechText);
        this.emit(':responseReady');
      } else {
          try {
            for (let i in result) {
              console.log(result[i].number);
            }
            console.log(JSON.stringify(result));
            console.log('bdy1 ' + result.number);            
          }
          catch (err) {
            console.log(err);
          }
      }
    });

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const TicketPortfolioCountIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TicketPortfolioCountIntent';
  },
  handle(handlerInput) {
    const speechText = 'TicketPortfolioCountIntent';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const TicketVendorCountIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TicketVendorCountIntent';
  },
  handle(handlerInput) {
    const speechText = 'TicketVendorCountIntent';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const TicketAppCountIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TicketAppCountIntent';
  },
  handle(handlerInput) {
    const speechText = 'TicketAppCountIntent';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask summary of ticket counts by Severity or Vendor or Portfolio etc.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
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
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
  LaunchRequestHandler,
  TicketSeverityCountIntentHandler,
  TicketPortfolioCountIntentHandler,
  TicketVendorCountIntentHandler,
  TicketAppCountIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
