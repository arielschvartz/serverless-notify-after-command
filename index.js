const { spawn } = require('child_process');
const path = require('path');

class NotifyAfterServerlessCommand {
  constructor(serverless, options) {
    this.beforeInitialize = this.beforeInitialize.bind(this)

    this.beforeInitialize(serverless.processedInput.commands[0]);
  }

  beforeInitialize(command) {
    const p = spawn(
      'sh',
      [
        path.resolve(__dirname, './checkProcess.sh'),
        command,
      ], {
        detached: true,
        stdio: 'ignore',
      }
    );

    p.unref();
  }
}

module.exports = NotifyAfterServerlessCommand;