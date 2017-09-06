electron-shutdown-command
=================

Quickly shutdown, reboot, log off, halt, your computer using the native shutdown command easily from an electron app. Cross platform (macOS; Windows and Linux)

Installation
------------

    npm install --save electron-shutdown-command

## Usage

```
const shutdown = require('electron-shutdown-command');

shutdown.shutdown();
```

or

```
shutdown.shutdown({force: true});
```

## Methods

# shutdown([options])
shutdown / power-off your machine

- `options` `<Object>`
  - `force` `<boolean>`: Forces running applications to close, default is `false`. *Windows only*

# reboot()
Reboot / restarts your machine

# logoff()
Ends current session *Windows only*

# sleep()
Enters sleep mode *macOS only*

# hibernate()
Hibernate *Windows only*

License
-------

Licensed under MIT

Copyright (c) 2017 [Samuel Carreira]