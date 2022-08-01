import { homeDir, isMac } from "./commands/shell";

export const logFilePath = `${homeDir}/Desktop/atyu_log_${new Date().getTime()}.txt`;
export const atyuDir = `~/.atyu/`;
export const atyuQmkDir = `${atyuDir}qmk_firmware/`;
export const atyuThumbnailsDir = `${atyuQmkDir}atyu/thumbnails/`;
export const atyuHomeConfigFilePath = `${atyuDir}qmk_firmware/atyu_home.json`;
export const atyuKeyboardConfigFilename = "atyu_config.json";
export const atyuHConfigFilename = "atyu.h";
export const atyuHResourcesFilename = "atyu_resources.h";

export const getKeyboardDir = (keyboardDir: string) =>
  `${atyuQmkDir}${keyboardDir}`;

// Use when we are doing commands for mac/windows natively (i.e. via node commands)
export const pathOf = (path: string) => isMac ? 
  path.replace("~", homeDir) : 
  path.replace("~", homeDir).split("/").join("\\");
