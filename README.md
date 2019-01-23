## Jest-Puppeteer-Atm-Reporter:
This is a plugin for uploading test execution results in real time (during execution - per `describe` block) for JEST tests to Adaptavist Test Management tool (Kanoah). 

One `describe` block is mapped to one ATM test (`Test case ID` for which can be set using reporter method). Each `test` or `it` block in `describe` will be considered as unique step of that test. Testcase will be marked as `Fail` on failure of atleast one step.

## Install:
```
npm install jest-puppeteer-atm-reporter
npm install dotenv
```

### Environment Variables:
Set following environment variables on your machine:
```
BASE_URL      = baseurl (e.g. --> jira.abcdef.com)
JIRA_USERNAME = username
JIRA_PASSWORD = password
PROJECT_KEY   = XYZ
TEST_CYCLE_ID = OPQ
```
### Note: 
In case you want to create new `TEST_CYCLE_ID` for every run then remove entry for `TEST_CYCLE_ID` from environment variable and use the npm module `GENERATE-ATM-TEST-CYCLE`(https://www.npmjs.com/package/generate-atm-test-cycle) to generate test cycle at runtime programatically.

## Usage:

Set following in package.json for using the jest-atm-reporter:

```
"jest": {
    "reporters": [
      "jest-puppeteer-atm-reporter"
    ]
  },
```
### How to set value `Test case ID` and `Test Environment` from test file. Snippet from a sample JEST test below -

```
beforeAll(async () => {
        reporter.setTestCaseID('<TestCaseID>');
        reporter.setEnvironment('<TestEnvironment>');
    });
```
### How to get screenshot of failure or final verification step. This screenshot will be auto uploaded to ATM TC. Snippet from a sample jest-puppeteer test below -
```
afterAll(async () => {
        let name = '<UniqueFileName.jpeg>';
        await page.screenshot({ path: name, fullPage: true});
        reporter.setScreenshotName(name);
    });
```
Note: `reporter` is global. 


### Features:
* Creates new test environment in Kanoah(ATM) in case the provided test environment is missing in ATM 

* Supports appropriate result upload for both type of JEST test execution - `Sequential` and `Parallel`

* Allows addition of metadata information - `Test case ID` and `Test Environment` per `describe` block

* Uploads test execution results to Kanoah (ATM) with following information - 
    * __Pass / Fail__ test in real time (per JEST `describe` block execution)

    * Uploads the __actual time taken__ for the test to execute

    * Uploads __failure reason__ with *Fail* tests

    * Uploads __failure__ or __final verification__ screenshot with test

    * Each test result upload displays respective environment information as set using the `reporter` method - `setEnvironment` (eg. values - `<applicationName>_desktop_en` or `chrome`) 

