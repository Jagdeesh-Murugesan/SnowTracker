const req = require('request-promise');
const config = require('../config');

const snowRestClient = {};

snowRestClient.getTicketCountByUrgency = function(){

    return req({
        url: "https://dev52396.service-now.com/api/now/table/incident?sysparm_query=active=true&sysparm_fields=urgency,priority",
        method: "GET",
        json: true,
        headers: {
          "Authorization": "Basic " + (new Buffer(config.username + ":" + config.password)).toString("base64"),
          "Accept": "application/json"
        } 
      });  
    
}

snowRestClient.getTicketCountByPortfolio = function(){

  return req({
      url: "https://dev52396.service-now.com/api/now/table/incident?sysparm_query=active=true&sysparm_fields=number,category",
      method: "GET",
      json: true,
      headers: {
        "Authorization": "Basic " + (new Buffer(config.username + ":" + config.password)).toString("base64"),
        "Accept": "application/json"
      }
    });  
  
}

snowRestClient.getTicketCountByApplication = function(){

  return req({
      url: "https://dev52396.service-now.com/api/now/table/incident?sysparm_query=active=true&category=software&sysparm_fields=number,subcategory",
      method: "GET",
      json: true,
      headers: {
        "Authorization": "Basic " + (new Buffer(config.username + ":" + config.password)).toString("base64"),
        "Accept": "application/json"
      }
    });  
  
}

snowRestClient.getTicketCountByVendor = function(){

  return req({
      url: "https://dev52396.service-now.com/api/now/table/incident?sysparm_query=active=true&sysparm_fields=number,assignment_group",
      method: "GET",
      json: true,
      headers: {
        "Authorization": "Basic " + (new Buffer(config.username + ":" + config.password)).toString("base64"),
        "Accept": "application/json"
      }
    });  
  
}

module.exports = snowRestClient;