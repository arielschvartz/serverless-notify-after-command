const { spawn } = require('child_process');
const path = require('path');

class NotifyAfterServerlessCommand {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.command = serverless.processedInput.commands[0];

    this.beforeInitialize = this.beforeInitialize.bind(this);

    if (this.shouldRunCommand) {
      this.beforeInitialize();
    }
  }

  get notifyOptions() {
    return Object.assign({
      active: true,
      blacklist: [],
      whitelist: [],
      stages: ['development'],
      sound: true
    }, this.serverless.service.custom.notifyAfterCommand || {})
  }

  get stage() {
    return this.serverless.service.provider.stage || this.serverless.service.custom.stage || this.options.stage || 'development';
  }

  get shouldRunCommand() {
    let shouldRun = this.notifyOptions.active;

    if ((this.notifyOptions.whitelist || []).indexOf(this.command) > -1) {
      // IT'S WHITELISTED!
      shouldRun = true;
    }

    if ((this.notifyOptions.blacklist || []).indexOf(this.command) > -1) {
      // IT'S BLACKLISTED!
      shouldRun = false;
    }

    if ((this.notifyOptions.stages || []).indexOf(this.stage) === -1) {
      // DO NOT RUN IN THIS STAGE
      shouldRun = false;
    }

    if (process.env.SLS_NOTIFY != null) {
      if ((process.env.SLS_NOTIFY || '').toString().toLowerCase() === 'true') {
        shouldRun = true;
      }

      if ((process.env.SLS_NOTIFY || '').toString().toLowerCase() === 'false') {
        shouldRun = false;
      }
    }

    return shouldRun;
  }

  beforeInitialize() {
    const p = spawn(
      'sh',
      [
        path.resolve(__dirname, './checkProcess.sh'),
        this.command,
        this.notifyOptions.sound,
      ], {
        detached: true,
        stdio: 'ignore',
      }
    );

    p.unref();
  }
}

module.exports = NotifyAfterServerlessCommand;