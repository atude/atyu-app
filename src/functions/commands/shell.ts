import { Dispatch, SetStateAction } from "react";
import _shell, { ExecOptions } from "shelljs";
import _os from "os";
import _path from "path";

const shell: typeof _shell = window.require("shelljs");
const os: typeof _os = window.require("os");
const path: typeof _path = window.require("path");

const isMac = os.platform() === "darwin";

// Fix paths
if (isMac) {
	shell.env["PATH"] = "~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin";
} else {
	// TODO: Windows path
}

console.log(shell.which("node"));
console.log("is mac: " + isMac);

shell.config.execPath = isMac ? 
	String(shell.which("node")) : 
	path.join("C:", "Program Files", "nodejs", "node.exe");

// TODO: disable popup script on windows

export const shellExecOptions: ExecOptions & { async: true } = {
	async: true,
	// Specify QMK MSYS shell on windows. Use default shell on mac
	shell: isMac ? shell.env["SHELL"] : "C://TODO",
}

// Weird issue where 'which' using exec does not work properly on mac
export const checkPrereqs = () => {
	if (isMac) {
		return shell.which("git") && shell.which("qmk");
	} else {
		const gitExists = shell.exec("which git", { ...shellExecOptions, async: false }).code === 0;
		const qmkExists = shell.exec("which qmk", { ...shellExecOptions, async: false }).code === 0;
		return gitExists && qmkExists;
	}
};

// Add log in reverse order for printing purposes
export const updateLog = (setLog: Dispatch<SetStateAction<string[]>>, dataString: string) => {
	setLog((existingLog) => [dataString, ...existingLog]);
	console.log(dataString);
};

export const killCmd = (shellCmd: any) => {
  shellCmd.stdout.destroy();
  shellCmd.stderr.destroy();
  shellCmd.kill("SIGINT");
};

export default shell;
