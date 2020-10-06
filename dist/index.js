"use strict";
/*!
 * Electron Shutdown Command
 *
 * Learn more - documentation:
 * windows: https://technet.microsoft.com/en-us/library/bb491003.aspx?f=255&MSPPError=-2147217396
 * macos: https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man8/shutdown.8.html
 * linux: https://www.computerhope.com/unix/ushutdow.htm
 *
 * Licensed under MIT
 * Copyright (c) 2020 [Samuel Carreira]
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reboot = exports.abort = exports.sleep = exports.logoff = exports.hibernate = exports.shutdown = void 0;
const cp = require("child_process");
const electron_1 = require("electron");
function applyDefaults(options) {
    const defaultOptions = {
        timerseconds: 0,
        quitapp: false,
        sudo: false,
        force: false,
        debug: false
    };
    return { ...defaultOptions, ...options };
}
/**
 * Shutdown command
 *
 * @param {object} options
 */
function shutdown(options = {}) {
    const validatedOptions = applyDefaults(options);
    const cmdarguments = ['shutdown'];
    if (process.platform === 'linux' || process.platform === 'darwin') {
        if (options.sudo) {
            cmdarguments.unshift('sudo');
        }
        cmdarguments.push('-h'); // Halt
    }
    if (process.platform === 'win32') {
        cmdarguments.push('-s'); // Shutdown
        if (options.force) {
            cmdarguments.push('-f');
        }
    }
    cmdarguments.push(...setTimer(validatedOptions.timerseconds));
    executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}
exports.shutdown = shutdown;
/**
 * Hibernate (Windows only)
 * @param {Object} options
 */
function hibernate(options = {}) {
    if (process.platform !== 'win32') {
        throw new Error('Unsupported OS (only Windows is supported)!');
    }
    const validatedOptions = applyDefaults(options);
    const cmdarguments = ['shutdown'];
    cmdarguments.push('-h'); // Hibernate
    executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}
exports.hibernate = hibernate;
/**
 * Ends current session (Windows only)
 * @param {object} options
 */
function logoff(options = {}) {
    if (process.platform !== 'win32') {
        throw new Error('Unsupported OS (only Windows is supported)!');
    }
    const validatedOptions = applyDefaults(options);
    const cmdarguments = ['shutdown'];
    cmdarguments.push('-l'); // Logoff
    executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}
exports.logoff = logoff;
/**
 * Enters sleep mode (macOS Only)
 */
function sleep(options = {}) {
    if (process.platform !== 'darwin') {
        throw new Error('Unsupported OS (only macOS is supported)!');
    }
    const validatedOptions = applyDefaults(options);
    const cmdarguments = ['shutdown'];
    cmdarguments.push('-s'); // Sleep
    // cmdarguments.push(setTimer(options.timerseconds));
    executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}
exports.sleep = sleep;
/**
 * Aborts current scheduled shutdown
 * @param {Object} options
 */
function abort(options = {}) {
    if (process.platform !== 'win32' && process.platform !== 'linux') {
        throw new Error('Unsupported OS (only Windows and Linux are supported)!');
    }
    const validatedOptions = applyDefaults(options);
    const cmdarguments = ['shutdown'];
    if (process.platform === 'win32') {
        cmdarguments.push('-a'); // Abort
    }
    else {
        // Linux
        cmdarguments.push('-c'); // Cancel a pending shutdown
    }
    executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}
exports.abort = abort;
/**
 * Shutdown / power-off your machine
 * @param {Object} options
 */
function reboot(options = {}) {
    const validatedOptions = applyDefaults(options);
    const cmdarguments = ['shutdown'];
    cmdarguments.push('-r'); // Reboot
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
    cmdarguments.push(...setTimer(validatedOptions.timerseconds));
    executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}
exports.reboot = reboot;
/**
 * Set current time argument
 * @param {Number} timervalue value in seconds to delay, false to execute now
 */
function setTimer(timervalue) {
    const cmdarguments = [];
    if (process.platform === 'linux') {
        if (timervalue) {
            cmdarguments.push(timervalue.toString());
        }
        else {
            cmdarguments.push('now');
        }
    }
    if (process.platform === 'darwin') {
        if (timervalue) {
            let timeinminutes = Math.round(Number(timervalue) / 60);
            if (timeinminutes === 0) {
                timeinminutes = 1; // Minimum 1 minute
            }
            cmdarguments.push(`-t ${timeinminutes.toString()}`);
        }
        else {
            cmdarguments.push('now');
        }
    }
    if (process.platform === 'win32') {
        if (timervalue) {
            cmdarguments.push(`-t ${timervalue.toString()}`);
        }
        else {
            cmdarguments.push('-t 0'); // Set to 0 because default is 20 seconds
        }
    }
    return cmdarguments;
}
/**
 * Execute command

 * @param {Boolean} debug show console results, not execute the command
 * @param {Boolean} quitapp quit app after send the command
 */
function executeCmd(cmd, debug, quitapp) {
    const finalcmd = cmd.join(' ');
    if (debug) {
        // Debug mode, print to console
        console.log(`Debug shutdown command: ${finalcmd}`);
        if (quitapp) {
            console.log('Now exit app...');
            electron_1.app.exit(0);
        }
        return;
    }
    // Execute the command
    cp.exec(finalcmd, err => {
        if (err) {
            console.error(err);
            return;
        }
        if (quitapp) {
            electron_1.app.exit(0);
        }
    });
}
//# sourceMappingURL=index.js.map