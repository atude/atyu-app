import { homeDir, isMac } from "./commands/shell";

export const atyuDir = `~/.atyu/`;
export const atyuQmkDir = `${atyuDir}qmk_firmware/`;
export const atyuHomeConfigFilePath = `${atyuDir}qmk_firmware/atyu_home.json`;
export const atyuKeyboardConfigFilename = "atyu_config.json";
export const atyuHConfigFilename = "atyu.h";

export const getKeyboardDir = (keyboardDir: string) =>
  `${atyuQmkDir}${keyboardDir}`;

export const pathOf = (path: string) => isMac ? 
  path.replace("~", homeDir) : 
  path.replace("~", homeDir).split("/").join("\\");
