# serverless-notify-after-command

This is a simple plugin for [Serverless Framework](https://serverless.com/) to send a notification to the linux system notification system after any serverless command (successfull or failed).

This plugin depends that your operational system is able to run the bash commands:
``` bash
sleep 
```
``` bash
notify-send
```
``` bash
paplay
```

For the plugin to work, it creates a child process the checks the amount of processes from serverless running in the system.

## Install

```bash
$ npm install serverless-notify-after-command --save-dev
```

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-notify-after-command
```
## Configure

The configuration of the plugin is done by defining a `custom: notifyAfterCommand` object in your `serverless.yml` with your specific configuration.

| Attribute | Type    | Default         | Description                                   |
|:--------- |:------- |:--------------- |:--------------------------------------------- |
| active    | Boolean | true            | Should run or not by default                  |
| blacklist | Array   | []              | Blacklist commands, even when active is true  |
| whitelist | Array   | []              | Whitelist commands, even when active is false |
| stages    | Array   | ['development'] | The list of stages to run                     |
| sound     | Boolean | true            | True if a sound should be played too          |

```yaml
custom:
  notifyAfterCommand:
    active: true
    blacklist: []
    whitelist: []
    stages: ['development']
    sound: true
```

Besides the `serverless.yml` configuration, you can pass Environment Variables to force it to use or not. Just set the SLS_NOTIFY to true or false, if you want notifications or not.

If you want to force the sound to play event when sound is false, pass the SLS_NOTIFY_SOUND=true.

``` bash
SLS_NOTIFY=true serverless [command]
SLS_NOTIFY=true sls [command]
SLS_NOTIFY_SOUND=true sls [command]
```

## Roadmap

Customize the notification sound.