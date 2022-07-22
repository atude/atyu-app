import { Dispatch, SetStateAction } from "react";

const shell = window.require("shelljs");
shell.config.execPath = String(shell.which("node"));

export const getShell = () => shell;

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
