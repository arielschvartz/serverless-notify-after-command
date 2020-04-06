const Serverless = require('serverless/lib/Serverless');
const path = require('path');
const cp = require('child_process');
cp.spawn = jest.fn((commandName, args = [], options = {}) => ({ unref: jest.fn() }))
const Plugin = require('./index');

let serverless;
let options = {};

beforeEach(() => {
  serverless = new Serverless();
  serverless.cli = new serverless.classes.CLI();
  serverless.processedInput = serverless.cli.processInput();
  serverless.processedInput.commands = ['deploy'];
  serverless.service = {
    service: 'test-service',
    custom: {},
    provider: {
      stage: 'development'
    },
    functions: {},
    resources: {},
    package: {},
  };
});

test('default configuration notifyOptions object', () => {
  const p = new Plugin(serverless, options)

  expect(p.notifyOptions).toEqual({
    active: true,
    blacklist: [],
    whitelist: [],
    stages: ['development'],
    sound: true
  });
});

test('default configuration shouldRunCommand object', () => {
  const p = new Plugin(serverless, options)

  expect(p.shouldRunCommand).toBe(true)
});

test('when some configs are passed it is merged', () => {
  serverless.service.custom.notifyAfterCommand = {
    blacklist: ['deploy']
  };
  const p = new Plugin(serverless, options)

  expect(p.notifyOptions).toEqual({
    active: true,
    blacklist: ['deploy'],
    whitelist: [],
    stages: ['development'],
    sound: true
  });
});

test('when active is false', () => {
  serverless.service.custom.notifyAfterCommand = {
    active: false
  };
  const p = new Plugin(serverless, options)

  expect(p.shouldRunCommand).toBe(false)
});

test('when active is false and command is whitelisted', () => {
  serverless.service.custom.notifyAfterCommand = {
    active: false,
    whitelist: ['deploy']
  };
  const p = new Plugin(serverless, options)

  expect(p.shouldRunCommand).toBe(true)
});

test('when active is true and command is blacklisted', () => {
  serverless.service.custom.notifyAfterCommand = {
    active: true,
    blacklist: ['deploy']
  };
  const p = new Plugin(serverless, options)

  expect(p.shouldRunCommand).toBe(false)
});

test('when in another stage', () => {
  serverless.service.provider.stage = 'staging';
  const p = new Plugin(serverless, options)

  expect(p.shouldRunCommand).toBe(false)
});

test('when in another stage but with the option passed', () => {
  serverless.service.provider.stage = 'staging';
  serverless.service.custom.notifyAfterCommand = {
    stages: ['staging']
  }
  const p = new Plugin(serverless, options)

  expect(p.shouldRunCommand).toBe(true)
});

test('when a forced environment variable is passed', () => {
  process.env.SLS_NOTIFY = 'false';

  const p = new Plugin(serverless, options)
  
  expect(p.shouldRunCommand).toBe(false)
});

test('when a forced environment variable is passed', () => {
  process.env.SLS_NOTIFY = 'true';
  serverless.service.custom.notifyAfterCommand = {
    active: false
  };

  const p = new Plugin(serverless, options)
  
  expect(p.shouldRunCommand).toBe(true)
});

test('test that spawn is called with the correct arguments', () => {
  const p = new Plugin(serverless, options)
  
  expect(cp.spawn).toHaveBeenCalledWith(
    'sh',
    [
      path.resolve(__dirname, './checkProcess.sh'),
      'deploy',
      true
    ],
    {
      detached: true,
      stdio:  'ignore'
    }
  )
});

test('test that spawn is called with the correct arguments', () => {
  serverless.processedInput.commands = ['logs']
  const p = new Plugin(serverless, options)
  
  expect(cp.spawn).toHaveBeenCalledWith(
    'sh',
    [
      path.resolve(__dirname, './checkProcess.sh'),
      'logs',
      true
    ],
    {
      detached: true,
      stdio:  'ignore'
    }
  )
});

test('test that spawn is called with the correct arguments', () => {
  serverless.service.custom.notifyAfterCommand = {
    sound: false
  };
  const p = new Plugin(serverless, options)
  
  expect(cp.spawn).toHaveBeenCalledWith(
    'sh',
    [
      path.resolve(__dirname, './checkProcess.sh'),
      'deploy',
      false
    ],
    {
      detached: true,
      stdio:  'ignore'
    }
  )
});
