import _shell from "shelljs";

const shell: typeof _shell = window.require("shelljs");
const os = window.require('os');
// const isMac = os.platform() === "darwin";

shell.config.execPath = String(shell.which("node"));

export const getShell = () => shell;
