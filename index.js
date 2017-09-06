'use strict';

const cp = require('child_process');

// learn more - documentation:
// windows: https://technet.microsoft.com/en-us/library/bb491003.aspx?f=255&MSPPError=-2147217396
// macos: https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man8/shutdown.8.html 
// linux: https://www.computerhope.com/unix/ushutdow.htm

/**
 * Shutdown command
 * 
 * @param {object} options {force: boolean} 
 */
function shutdown(options = {}) {
	if (process.platform === 'linux') {
		executeCmd('sudo shutdown -h now');
	} else if (process.platform === 'darwin') {
		executeCmd('sudo shutdown -h now');
	} else if (process.platform === 'win32') {
		if (options.force) {
			executeCmd('shutdown -s -f -t 0');
		} else {
			executeCmd('shutdown -s -t 0');
		}
	} else {
		throw new Error('Unknown or unsupported OS!');
	}
}

function hibernate() {
	if (process.platform === 'win32') {
			executeCmd('shutdown -h');
	} else {
		throw new Error('Unknown or unsupported OS (only Windows is supported)!');
	}
}

function logoff() {
	if (process.platform === 'win32') {
			executeCmd('shutdown -l');
	} else {
		throw new Error('Unknown or unsupported OS (only Windows is supported)!');
	}
}

/**
 * Enters sleep mode (macOS Only)
 */
function sleep() {
	if (process.platform === 'darwin') {
		executeCmd('sudo shutdown -s now');
	} else {
		throw new Error('Unknown or unsupported OS (only macOS is supported)!');
	}
}

function reboot(options = {}) {
	if (process.platform === 'linux') {
		executeCmd('sudo shutdown -r now');
	} else if (process.platform === 'darwin') {
		executeCmd('sudo shutdown -r now');
	} else if (process.platform === 'win32') {
		if (options.force) {
			executeCmd('shutdown -r -f -t 0');
		} else {
			executeCmd('shutdown -r -t 0');
		}
	} else {
		throw new Error('Unknown or unsupported OS!');
	}
}

/**
 * Execute command
 * @param {string} cmd 
 */
function executeCmd(cmd) {
	if (typeof cmd !== 'string') {
		throw new Error('Empty or invalid argument!');
	}

	cp.exec(cmd, (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}
		//console.log(stdout);
	});
}

module.exports = {
	shutdown: shutdown,
	reboot: reboot,
	hibernate: hibernate,
	logoff: logoff,
	sleep: sleep
};
