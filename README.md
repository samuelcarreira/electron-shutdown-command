# Electron Shutdown Command

Quickly shutdown, reboot, log off, halt, restarts, etc. your computer using the native shutdown command easily from an electron app. Cross platform (Windows; macOS and Linux)


## ATTENTION macOS and Linux Users:
**You need to run the app as sudo/root to allow to run the shutdown command!**


## Key Features
* **Secure and lightweight:** Uses only node/electron native modules

* **Written in TypeScript**

* **Well documented and easy to use**


## Installation
```
npm install --save electron-shutdown-command
```
or

```
yarn add electron-shutdown-command
```


## Usage

```
const shutdown = require('electron-shutdown-command');

shutdown.shutdown(); // simple system shutdown with default options
```
or
```
import * as shutdown from 'electron-shutdown-command';

shutdown.shutdown(); // simple system shutdown with default options
```
or

```
/* shutdown after 60 seconds, force all windows to close (Microsoft Windows only),
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
// Warning: Microsoft Windows only
shutdown.logoff();
```


## Methods

### shutdown([options])
> shutdown / power-off your machine

### reboot([options])
> Reboot / restarts your machine

### logoff([options])
> Ends current session *Windows only*

### sleep([options])
> Enters sleep mode *macOS only*

### hibernate([options])
> Hibernate *Windows only*

### abort([options])
> Aborts or cancels a pending shutdown (this does not apply to "shutdown now", which does not wait before shutting down) *Windows and Linux only*

## Options

Property         | Type     | Default    | Description
---------------- | -------- | ---------- | ----------------------
`force`  | `boolean` | `false`     | Forces running applications to close *Windows only*
`sudo`  | `boolean` | `false`     | Run command as sudo *macOS and Linux*
`debug`  | `boolean` | `false`     | Shows shutdown command on console for debugging purposes **NOTE: It does not run it**
`quitapp`  | `boolean` | `false`     |  Quits your app after the shutdown command
`timerseconds`  | `number` | `0`     |  Sets the timer (value in seconds). **NOTES**: in *macOS* the minimum is 1 minute. The logoff, sleep and hibernate option cannot be scheduled, they are executed immediately


## Motivation and history
I quickly wrote this library because I need to add a shutdown option to an Electron Windows App. This is a very simple library that justs executes the shutdown command on different OS. **Warning:** I didn't have enough time to fully test this module on macOS and Linux.  If there is enough interest in some specific platform I can try to improve this module (I currently use this module on Windows 10).

## Contribution
Please send pull requests improving the usage and fixing bugs, improving documentation and providing better examples, or providing some tests, because these things are important.


## Learn More
Shutdown command
 * Windows: https://technet.microsoft.com/en-us/library/bb491003.aspx?f=255&MSPPError=-2147217396
 * macOS: https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man8/shutdown.8.html
 * Linux: https://www.computerhope.com/unix/ushutdow.htm

 * [Create Shortcuts on the Desktop to Run Programs as Root in Ubuntu 11.10](https://www.howtogeek.com/112700/create-shortcuts-on-the-desktop-to-run-programs-as-root-in-ubuntu-11.10/)
 * [How to Run GUI Apps as root in Mac OS X](https://osxdaily.com/2013/02/06/how-to-run-gui-apps-as-root-in-mac-os-x/)

## License
- Licensed under MIT

- Copyright (c) 2017-2020 [Samuel Carreira]