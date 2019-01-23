require('dotenv').config();
const req   = require('request');
var url     = process.env.BASE_URL;
user        = process.env.JIRA_USERNAME;
password    = process.env.JIRA_PASSWORD;

/**
 *  This method will read the ENVIRONMENT NAME (set using reporter method in test) 
 * and search for it under available ATM environment values.
 * 
 * If provided ENVIRONMENT NAME is unavailable in ATM, will create a new environment in ATM
 * or will return error in case of failure.
**/

function createEnvironment(env){
    ENVIRONMENT_NAME = env;
    
    req({
        method: 'GET',
        url: 'https://' + user + ':' + password + '@' + url + '/rest/atm/1.0/environments?projectKey=' + process.env.PROJECT_KEY, 
        json: true, // indicates the returning data is JSON, no need for JSON.parse()
    }, function (error, response, body) {
        var flag = false;
        if(error || ENVIRONMENT_NAME === undefined){
            console.log('ERROR with getting environment list.'); // informs user of the error in case of api call failure
        }
        else {
            for (var key in body) {
                if(JSON.stringify(body[key].name) === '"' + ENVIRONMENT_NAME + '"'){
                    flag = true
                    break;
                }
            }
            if(flag === false){
                var jiraEnvInfo = {
                    uri: 'https://' + user + ':' + password + '@' + url + '/rest/atm/1.0/environments',
                    method: 'POST',
                    json: {
                        "projectKey": process.env.PROJECT_KEY,
                        "name": ENVIRONMENT_NAME
                      }
                };
                req(jiraEnvInfo, function (error, response) {
                    if (response.statusCode === 200 || response.statusCode === 201){
                        console.log('Environment created :: ' + ENVIRONMENT_NAME); // informs user of the test environment created successfully
                    }  
                    else {
                        console.log('Environment not creeated.'); // informs user of the error in case of api call failure
                    }
                });
            }
        }  
    });
}
module.exports.createEnvironment = createEnvironment;