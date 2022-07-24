import _shell from "shelljs";

const shell: typeof _shell = window.require("shelljs");

shell.config.execPath = String(shell.which("node"));

export const getShell = () => shell;
