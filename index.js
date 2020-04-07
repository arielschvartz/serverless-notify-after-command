const { spawn } = require('child_process');
const path = require('path');
const Variables = require('serverless/lib/classes/Variables');

class NotifyAfterServerlessCommand {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.vars = new Variables(serverless);

    this.command = serverless.processedInput.commands[0];

    this.stage = this.stage.bind(this);
    this.shouldRunCommand = this.shouldRunCommand.bind(this);
    this.beforeInitialize = this.beforeInitialize.bind(this);

    this.shouldRunCommand().then(shouldRun => {
      if (shouldRun) {
        this.beforeInitialize();
      }
    })
  }

  get notifyOptions() {
    return Object.assign({
      active: true,
      blacklist: [],
      whitelist: [],
      stages: ['development', 'dev'],
      sound: true
    }, this.serverless.service.custom.notifyAfterCommand || {})
  }

  async stage() {
    let s = this.options.stage || (this.serverless.service.custom || {}).stage || (this.serverless.service.provider || {}).stage || 'development';

    const slsVariableRegex = /^\$\{.*\}$/g;

    if (slsVariableRegex.test(s)) {
      const parts = s.substr(2).slice(0, -1).split(',').map(s => s.trim());
      for (const part of parts) {
        for (let { regex, resolver } of this.serverless.variables.variableResolvers) {
          if (regex.test(part)) {
            s = await this.vars[resolver.name.split('bound ')[1]].apply(this, [part])
            if (s) {
              return s;
            }
          }
        }
      }
    }

    return s;
  }

  async shouldRunCommand() {
    let shouldRun = this.notifyOptions.active;

    const stage = await this.stage();

    if ((this.notifyOptions.whitelist || []).indexOf(this.command) > -1) {
      // IT'S WHITELISTED!
      shouldRun = true;
    }

    if ((this.notifyOptions.blacklist || []).indexOf(this.command) > -1) {
      // IT'S BLACKLISTED!
      shouldRun = false;
    }

    if ((this.notifyOptions.stages || []).indexOf(stage) === -1) {
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
        (process.env.SLS_NOTIFY_SOUND || '').toString().toLowerCase() === 'true' ? true : this.notifyOptions.sound,
        path.resolve(__dirname, './message.wav')
      ], {
        detached: true,
        stdio: 'ignore',
      }
    );

    p.unref();
  }
}

module.exports = NotifyAfterServerlessCommand;