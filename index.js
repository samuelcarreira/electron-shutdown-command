'use strict';

const cp = require('child_process');
const electron = require('electron');
const app = electron.app;

// learn more - documentation:
// windows: https://technet.microsoft.com/en-us/library/bb491003.aspx?f=255&MSPPError=-2147217396
// macos: https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man8/shutdown.8.html 
// linux: https://www.computerhope.com/unix/ushutdow.htm

/**
 * Shutdown command
 * 
 * @param {object} options 
 */
function shutdown(options = {}) {
    if (process.platform !== 'linux' &&
        process.platform !== 'darwin' &&
        process.platform !== 'win32') {
        throw new Error('Unknown or unsupported OS!');
    }

    let cmdarguments = ['shutdown'];

    if (process.platform === 'linux' || process.platform === 'darwin') {
        if (options.sudo) {
            cmdarguments.unshift('sudo');
        }

        cmdarguments.push('-h'); // halt
    }

    if (process.platform === 'win32') {
        cmdarguments.push('-s'); // shutdown

        if (options.force) {
            cmdarguments.push('-f');
        }      
    }

    cmdarguments.push(setTimer(options.timerseconds));

    executeCmd(cmdarguments, options.debug, options.quitapp);
}

/**
 * Hibernate (Windows only)
 * @param {Object} options 
 */
function hibernate(options = {}) {
    if (process.platform !== 'win32') {
        throw new Error('Unsupported OS (only Windows is supported)!');
    }

    let cmdarguments = ['shutdown'];

    cmdarguments.push('-h'); // hibernate    
 
    executeCmd(cmdarguments, options.debug, options.quitapp);
}

/**
 * Ends current session (Windows only)
 * @param {object} options 
 */
function logoff(options = {}) {
    if (process.platform !== 'win32') {
        throw new Error('Unsupported OS (only Windows is supported)!');
    }

    let cmdarguments = ['shutdown'];

    cmdarguments.push('-l'); // logoff    

    executeCmd(cmdarguments, options.debug, options.quitapp);
}

/**
 * Enters sleep mode (macOS Only)
 */
function sleep(options = {}) {
    if (process.platform !== 'darwin') {
        throw new Error('Unsupported OS (only macOS is supported)!');
    }

    let cmdarguments = ['shutdown'];
    
    cmdarguments.push('-s'); // sleep
    
    //cmdarguments.push(setTimer(options.timerseconds));

    executeCmd(cmdarguments, options.debug, options.quitapp);
}

/**
 * Aborts current scheduled shutdown
 * @param {Object} options 
 */
function abort(options = {}) {
    if (process.platform !== 'win32' && process.platform !== 'linux') {
        throw new Error('Unsupported OS (only Windows and Linux are supported)!');
    }

    let cmdarguments = ['shutdown'];
    
    if (process.platform === 'win32') {
        cmdarguments.push('-a'); // abort
    } else {
        // linux
        cmdarguments.push('-c'); // cancel a pending shutdown
    }
    
    executeCmd(cmdarguments, options.debug, options.quitapp);
}

/**
 * Shutdown / power-off your machine
 * @param {Object} options 
 */
function reboot(options = {}) {
    if (process.platform !== 'linux' &&
        process.platform !== 'darwin' &&
        process.platform !== 'win32') {
        throw new Error('Unknown or unsupported OS!');
    }

    let cmdarguments = ['shutdown'];

    cmdarguments.push('-r'); // reboot

    if (process.platform === 'linux' || process.platform === 'darwin') {
        if (options.sudo) {
            cmdarguments.unshift('sudo');
        }
    }

    if (process.platform === 'win32') {
        if (options.force) {
            cmdarguments.push('-f');
        }      
    }

    cmdarguments.push(setTimer(options.timerseconds));

    executeCmd(cmdarguments, options.debug, options.quitapp);
}

/**
 * set current time argument
 * @param {Number} timervalue value in seconds to delay, false to execute now
 */
function setTimer(timervalue) {
    let cmdarguments = [];
    
    if (process.platform === 'linux' ) {
        if (timervalue) {
            cmdarguments.push(timervalue.toString());
        } else {
            cmdarguments.push('now');
        }
    }

    if (process.platform === 'darwin') {
        if (timervalue) {
			let timeinminutes = Math.round(Number(timervalue) / 60);
			if (timeinminutes === 0) {
				timeinminutes = 1; // min 1 minute
			}
            cmdarguments.push('-t ' + timeinminutes.toString());
        } else {
            cmdarguments.push('now');
        }
    }

    if (process.platform === 'win32') {
        if (timervalue) {
            cmdarguments.push('-t ' + timervalue.toString());
        } else {
            cmdarguments.push('-t 0'); // set to 0 because default is 20 seconds
        }
    }

    return cmdarguments;
} 


/**
 * Execute command
 * @param {Object} cmd array of commands 
 * @param {Boolean} debug show console results, not execute the command
 * @param {Boolean} quitapp quit app after send the command
 */
function executeCmd(cmd, debug, quitapp) {
    if (typeof cmd !== 'object') {
        throw new Error('Empty or invalid argument list!');
    }

    let finalcmd = cmd.join(' ');

    if (debug) {
        // debug mode, print to console
        console.log(`Debug shutdown command: ${finalcmd}`)
        if (quitapp) {
            console.log("Now exit app...");
            app.exit(0);
        }
    } else {
        cp.exec(finalcmd, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            //console.log(stdout);
            if (quitapp) {
                app.exit(0);
            }
        });
    }
}

module.exports = {
    shutdown: shutdown,
    reboot: reboot,
    hibernate: hibernate,
    logoff: logoff,
    sleep: sleep,
    abort: abort
};