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
/**
 * Shutdown command
 *
 * @param {object} options
 */
export declare function shutdown(options?: ElectronShutdownCommandUserOptions): void;
/**
 * Hibernate (Windows only)
 * @param {Object} options
 */
export declare function hibernate(options?: ElectronShutdownCommandUserOptions): void;
/**
 * Ends current session (Windows only)
 * @param {object} options
 */
export declare function logoff(options?: ElectronShutdownCommandUserOptions): void;
/**
 * Enters sleep mode (macOS Only)
 */
export declare function sleep(options?: ElectronShutdownCommandUserOptions): void;
/**
 * Aborts current scheduled shutdown
 * @param {Object} options
 */
export declare function abort(options?: ElectronShutdownCommandUserOptions): void;
/**
 * Shutdown / power-off your machine
 * @param {Object} options
 */
export declare function reboot(options?: ElectronShutdownCommandUserOptions): void;
