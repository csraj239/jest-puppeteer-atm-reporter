
/**
 * The default behaviour - run as Custom Reporter, in parallel with Jest default reporter.
 */
class JestReporter {
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;
      }
      onTestStart(test) {
        const setupPath = require.resolve('./src/setup');
        const setupTestFrameworkScriptFile = test.context.config.setupTestFrameworkScriptFile;
        if (!setupTestFrameworkScriptFile) {
            test.context.config = Object.assign({}, test.context.config, { setupTestFrameworkScriptFile: setupPath });
        }
    }
}

module.exports = JestReporter;
