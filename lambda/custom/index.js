/* eslint-disable  func-names */
/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');
const snowRestClient = require('./modules/snowHelper');
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
  
  async handle(handlerInput) {
    let speechText = 'TicketSeverityCountIntent';
    let activeCnt = 0;
    let urgencyHiCnt = 0;
    let urgencyMedCnt = 0;
    let urgencyLowCnt = 0;

    await snowRestClient.getTicketCountByUrgency().then(function(response){
        
        activeCnt = response.result.length;
        response.result.forEach(e => {
          if(e.urgency == 1){
            urgencyHiCnt++;
          }
          else if(e.urgency == 2){
            urgencyMedCnt++;
          }
          else{
            urgencyLowCnt++;
          }
        });
        speechText = `There are ${activeCnt} open tickets, out of which ${urgencyHiCnt} are High urgency, 
        ${urgencyMedCnt} are medium urgency and ${urgencyLowCnt} are low urgency`;

    },function(err){
      console.log(" Err occured "+err);
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
  async handle(handlerInput) {
    let portFolioList = [];
    let speechText = 'TicketPortfolioCountIntent';
    let resultCount = 0;
    let portfolioCount=0;
    
    await snowRestClient.getTicketCountByPortfolio().then(function(response){
        
        resultCount = response.result.length;
        response.result.forEach(e => {
          if (e.category != null && e.category !="") {
          portFolioList.push(e.category);
          }
       });
       //speechText = portFolioList.length.toString();
      portfolioCount = portFolioList.length;
      portFolioList.sort();

      let current = null;
      let cnt = 0;
      for (let i = 0; i < portfolioCount; i++) {
          if (portFolioList[i] != current) {
              if (cnt > 0) {
                  //document.write(current + ' comes --> ' + cnt + ' times<br>');
                  speechText = speechText + `The portfolio ${current} has ${cnt} tickets`;
              }
              current = portFolioList[i];
              cnt = 1;
          } else {
              cnt++;
          }
      }
    if (cnt > 0) {
       // document.write(current + ' comes --> ' + cnt + ' times');
        speechText = speechText + `The portfolio ${current} has ${cnt} tickets`;
    }        
       
    },function(err){
      console.log(" Err occured "+err);
    });

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
  async handle(handlerInput) {
    let vendorList = [];
    let speechText = '';
    let resultCount = 0;
    let vendorCount=0;
    let serviceDeskCnt = 0;
    let networkCnt = 0;
    let softwareCnt = 0;
    let databaseCnt = 0;
    
    await snowRestClient.getTicketCountByVendor().then(function(response){
        
        resultCount = response.result.length;
        response.result.forEach(e => {
          if (e.assignment_group.value != null && e.assignment_group.value !="") {
          vendorList.push(e.assignment_group.value);
          }
       });
       //speechText = portFolioList.length.toString();
      vendorCount = vendorList.length;
      vendorList.sort();

      let current = null;
      let cnt = 0;
      for (let i = 0; i < vendorCount; i++) {
        
          if (vendorList[i] == "d625dccec0a8016700a222a0f7900d06") {
            serviceDeskCnt++;
          } else if (vendorList[i] == "287ebd7da9fe198100f92cc8d1d2154e") {
            networkCnt++;
          }else if (vendorList[i] == "287ee6fea9fe198100ada7950d0b1b73") {
            databaseCnt++;
          }else if (vendorList[i] == "8a4dde73c6112278017a6a4baf547aa7") {
            softwareCnt++;
          }
      }
        speechText = `There are ${serviceDeskCnt} tickets in  service desk  ${networkCnt} in network ${databaseCnt} in database ${softwareCnt} in software as part of assignment group`;
      
    },function(err){
      console.log(" Err occured "+err);
    });

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
  async handle(handlerInput) {
    let speechText = 'TicketAppCountIntent';
    let activeCnt = 0;
    let emailCnt = 0;
    let osCnt = 0;
    let otherAppCnt = 0;
    
    await snowRestClient.getTicketCountByApplication().then(function(response){
        
        activeCnt = response.result.length;
        response.result.forEach(e => {
          if(e.subcategory == 'email'){
            emailCnt++;
          }
          else if(e.subcategory == 'os'){
            osCnt++;
          }
          else{
            otherAppCnt++;
          }
        });
        speechText = `There are ${emailCnt} open tickets in Email Application and ${osCnt} open tickets in OS Application,
        under software category.`; 

    },function(err){
      console.log(" Err occured "+err);
    });
    
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
