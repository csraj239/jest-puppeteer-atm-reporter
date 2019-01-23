require('dotenv').config();
var fs          = require('fs');
var req         = require('request');
var url         = process.env.BASE_URL;
    user        = process.env.JIRA_USERNAME;
    password    = process.env.JIRA_PASSWORD;
    screenshotpath = null;
    var cycleID = null;
    function uploadAttachement(screenshotpath, resultId) {
        var jiraInfo = {
            uri: 'https://' + user + ':' + password + '@' + url + '/rest/atm/1.0/testresult/' + resultId + '/attachments',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            formData: {
                file: fs.createReadStream(screenshotpath)
            }
        };
    
        req(jiraInfo, function (error, response) {
            if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                if(fs.existsSync(screenshotpath)) fs.unlinkSync(screenshotpath);
            } else {
                console.log('Screenshot not uploaded in ATM.');
            }
        });
    }
    
function testResultUpload (testCaseID, testResult, testEnv, stepResults, screenshotpath){
    let executionTime = null;
    executionTime = Math.round(process.uptime()) * 1000;

    if(process.env.TEST_CYCLE_ID === undefined) cycleID = fs.readFileSync('./cycleID.txt', 'utf8');
    else cycleID = process.env.TEST_CYCLE_ID;
    var requestInfo = {
                uri: 'https://' + user + ':' + password + '@' + url + '/rest/atm/1.0/testrun/' + cycleID + '/testcase/' + testCaseID + '/testresult',
                method: 'POST',
                json: {
                    "status": testResult,
                    "environment": testEnv,
                    "comment": null,
                    "userKey": user,
                    "executionTime": executionTime,
                    "executionDate": null,
                    "issueLinks": null,
                    "scriptResults": JSON.parse(stepResults)
                }
        };
        req(requestInfo, function (error, response, body){
                if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
                    uploadAttachement(screenshotpath, response.body.id);
                }
                else {
                    console.log('Result not uploaded in ATM for TestCase ID:- ' + testCaseID);
                }
            });
};

module.exports.testResultUpload = testResultUpload;
