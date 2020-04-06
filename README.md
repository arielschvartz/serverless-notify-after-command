# serverless-notify-after-command

This is a simple plugin for [Serverless Framework](https://serverless.com/) to send a notification to the linux system notification system after any serverless command (successfull or failed).

## Install

```bash
$ npm install serverless-notify-after-command --save-dev
```

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-notify-after-command
```

## Roadmap

A new version will come shortly so you will be able to filter which commands you want to be notified from the `serverless.yml` file.