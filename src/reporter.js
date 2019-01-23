var path = require('path')
class Reporter {
/**
 * To set the user provided test case id as environment variable
 */
    setTestCaseID(tcid) {
        process.argv.TEST_CASE_ID = tcid;
    }

/**
 * To set the user provided test environment as environment variable
 */
    setEnvironment(env){
        process.argv.ENVIRONMENT = env;
    }
/**
 * To set the page handle for screenshot on failure
 */
    setScreenshotName(name){
        process.argv.SCREENSHOT_PATH = process.cwd() + '/' + name;
    }
}
module.exports = Reporter;
