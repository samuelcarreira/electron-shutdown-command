electron-shutdown-command
=================

Quickly shutdown, reboot, log off, halt, restarts, etc. your computer using the native shutdown command easily from an electron app. Cross platform (macOS; Windows and Linux)

## Installation

    npm install --save electron-shutdown-command

## Usage

```
const shutdown = require('electron-shutdown-command');

shutdown.shutdown();
```

or

```
/* shutdown after 60 seconds, force all windows to close (windows),
 * run as sudo (macOS and Linux only), debug command to console
 * (not execute it) and quit app after the command execution
 */
shutdown.shutdown({
  force: true,
  timerseconds: 60,
  sudo: true,
  debug: true,
  quitapp: true
})
```
or
```
// Warning: windows only
shutdown.logoff();
```

## Methods

### shutdown([options])
shutdown / power-off your machine

### reboot([options])
Reboot / restarts your machine

### logoff([options])
Ends current session *Windows only*

### sleep([options])
Enters sleep mode *macOS only*

### hibernate([options])
Hibernate *Windows only*

## Options
- `options` `<Object>`
  - `force` `<boolean>`: Forces running applications to close, default is `false` *Windows only*
  - `timerseconds` `<Number>`: Sets the timer (value in seconds). Note in *macOS* the minimum is 60 seconds/1 minute
  - `sudo` `<boolean>`: Run as sudo, default is `false`. *macOS and Linux*
  - `debug` `<boolean>`: Show shutdown command on console **Not runs it**, default is `false`
  - `quitapp` `<boolean>`: Quits your app after the shutdown command, default is `false`

## License

Licensed under MIT

Copyright (c) 2017 [Samuel Carreira]
