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

import cp = require('child_process');
import {app} from 'electron';

export interface ElectronShutdownCommandUserOptions {
  /**
   * Sets the timer (value in seconds).
   * Notes: in macOS the minimum is 1 minute. The logoff, sleep
   * and hibernate option cannot be scheduled, it executes immediately
   *
   * @default 0
   */
  timerseconds?: number;
  /**
   * Quits your app after the shutdown command
   *
   * @default false
   */
  quitapp?: boolean;
  /**
   * Run as sudo *macOS and Linux only*
   *
   * @default false
   */
  sudo?: boolean;
  /**
   * Forces running applications to close *Windows only*
   *
   * @default false
   */
  force?: boolean;
  /**
   * Shows shutdown command on console for debugging
   * purposes **NOTE: It does not run it**
   *
   * @default false
   */
  debug?: boolean;
}

interface ElectronShutdownCommandOptions {
  timerseconds: number;
  quitapp: boolean;
  sudo: boolean;
  force: boolean;
  debug: boolean;
}

function applyDefaults(options: ElectronShutdownCommandUserOptions): ElectronShutdownCommandOptions {
  const defaultOptions: ElectronShutdownCommandOptions = {
    timerseconds: 0,
    quitapp: false,
    sudo: false,
    force: false,
    debug: false
  };

  return {...defaultOptions, ...options};
}

/**
 * Shutdown command
 *
 * @param {object} options
 */
export function shutdown(options: ElectronShutdownCommandUserOptions = {}) {
  const validatedOptions: ElectronShutdownCommandOptions = applyDefaults(options);

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

/**
 * Hibernate (Windows only)
 * @param {Object} options
 */
export function hibernate(options: ElectronShutdownCommandUserOptions = {}) {
  if (process.platform !== 'win32') {
    throw new Error('Unsupported OS (only Windows is supported)!');
  }

  const validatedOptions: ElectronShutdownCommandOptions = applyDefaults(options);

  const cmdarguments = ['shutdown'];

  cmdarguments.push('-h'); // Hibernate

  executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}

/**
 * Ends current session (Windows only)
 * @param {object} options
 */
export function logoff(options: ElectronShutdownCommandUserOptions = {}) {
  if (process.platform !== 'win32') {
    throw new Error('Unsupported OS (only Windows is supported)!');
  }

  const validatedOptions: ElectronShutdownCommandOptions = applyDefaults(options);

  const cmdarguments = ['shutdown'];

  cmdarguments.push('-l'); // Logoff

  executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}

/**
 * Enters sleep mode (macOS Only)
 */
export function sleep(options: ElectronShutdownCommandUserOptions = {}) {
  if (process.platform !== 'darwin') {
    throw new Error('Unsupported OS (only macOS is supported)!');
  }

  const validatedOptions: ElectronShutdownCommandOptions = applyDefaults(options);

  const cmdarguments = ['shutdown'];

  cmdarguments.push('-s'); // Sleep

  // cmdarguments.push(setTimer(options.timerseconds));

  executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}

/**
 * Aborts current scheduled shutdown
 * @param {Object} options
 */
export function abort(options: ElectronShutdownCommandUserOptions = {}) {
  if (process.platform !== 'win32' && process.platform !== 'linux') {
    throw new Error('Unsupported OS (only Windows and Linux are supported)!');
  }

  const validatedOptions: ElectronShutdownCommandOptions = applyDefaults(options);

  const cmdarguments = ['shutdown'];

  if (process.platform === 'win32') {
    cmdarguments.push('-a'); // Abort
  } else {
    // Linux
    cmdarguments.push('-c'); // Cancel a pending shutdown
  }

  executeCmd(cmdarguments, validatedOptions.debug, validatedOptions.quitapp);
}

/**
 * Shutdown / power-off your machine
 * @param {Object} options
 */
export function reboot(options: ElectronShutdownCommandUserOptions = {}) {
  const validatedOptions: ElectronShutdownCommandOptions = applyDefaults(options);

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

/**
 * Set current time argument
 * @param {Number} timervalue value in seconds to delay, false to execute now
 */
function setTimer(timervalue: number): string[] {
  const cmdarguments = [];

  if (process.platform === 'linux') {
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
        timeinminutes = 1; // Minimum 1 minute
      }

      cmdarguments.push(`-t ${timeinminutes.toString()}`);
    } else {
      cmdarguments.push('now');
    }
  }

  if (process.platform === 'win32') {
    if (timervalue) {
      cmdarguments.push(`-t ${timervalue.toString()}`);
    } else {
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
function executeCmd(cmd: string[], debug: boolean, quitapp: boolean): void {
  const finalcmd = cmd.join(' ');

  if (debug) {
    // Debug mode, print to console
    console.log(`Debug shutdown command: ${finalcmd}`);
    if (quitapp) {
      console.log('Now exit app...');
      app.exit(0);
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
      app.exit(0);
    }
  });
}
