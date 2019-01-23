require('dotenv').config();
var env = require('./createEnvironment')
var atm = require('./resultUpload');
var rep = require("./reporter");
var fs  = require('fs');
var arrStepStatus   = [];
    arrStepComment  = [];
    testCaseStatus  = "Pass";
    testCaseComment = null;
    

class JasmineATMReporter {
    constructor() {
    }
    /**
     * Stores step (test or it block) level result information in arrays 
     */
    specDone(specResult){
        arrStepStatus.push(specResult.status);
        if(specResult.failedExpectations.length > 0)arrStepComment.push('MESSAGE ::==> ' + specResult.failedExpectations[0].message);
        else arrStepComment.push(null);
    };

    /**
     * Stores complete test (describe block) level result information in arrays 
     */
    suiteDone(suiteResult){
        if(process.argv.ENVIRONMENT !== undefined) env.createEnvironment(process.argv.ENVIRONMENT);
        else process.argv.ENVIRONMENT = null;
        var TestStepdata;
        var testStepStatus
        for(var iLoop=0; iLoop < arrStepStatus.length; iLoop++) {
                if(arrStepStatus[iLoop] === "failed") testCaseStatus = "Fail";
                if(arrStepStatus[iLoop] === "failed") testStepStatus = "Fail";
                else testStepStatus = "Pass";
                if(iLoop === 0){
                    if((iLoop === 0) && (arrStepStatus.length === 1)){
                        var data = "[{\"index\":" + iLoop + ", \"status\":\"" + testStepStatus + "\", \"comment\":" + JSON.stringify(arrStepComment[iLoop]) + "}]";
                        TestStepdata = data;
                    }
                    else {
                        var data = "[{\"index\":" + iLoop + ", \"status\":\"" + testStepStatus + "\", \"comment\":" + JSON.stringify(arrStepComment[iLoop]) + "}, ";
                        TestStepdata = data;
                    }  
                }
                else {
                    if(iLoop === arrStepStatus.length -1){
                        var data = "{\"index\":" + iLoop + ", \"status\":\"" + testStepStatus + "\", \"comment\":" + JSON.stringify(arrStepComment[iLoop]) + "}]";
                        TestStepdata = TestStepdata + data;
                    }
                    else {
                        var data = "{\"index\":" + iLoop + ", \"status\":\"" + testStepStatus + "\", \"comment\":" + JSON.stringify(arrStepComment[iLoop]) + "}, ";
                        TestStepdata = TestStepdata + data;
                    }
                }
            }
            atm.testResultUpload(process.argv.TEST_CASE_ID, testCaseStatus, process.argv.ENVIRONMENT, TestStepdata, process.argv.SCREENSHOT_PATH);
            arrStepStatus = [];
            arrStepComment = [];
    };
}

function registerAtmReporter() {
    const reporter = global.reporter = new rep();
    jasmine.getEnv().addReporter(new JasmineATMReporter());
}

exports.registerAtmReporter = registerAtmReporter;
registerAtmReporter();
