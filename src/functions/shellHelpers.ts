export const atyuDir = "~/.atyu/";
export const atyuQmkDir = `${atyuDir}qmk_firmware/`;
export const atyuHomeConfigFilePath = `${atyuDir}qmk_firmware/atyu_home.json`;
export const atyuKeyboardConfigFilename = "atyu_config.json";
export const atyuHConfigFilename = "atyu.h";

export const getKeyboardDir = (keyboardDir: string) =>
  `${atyuQmkDir}${keyboardDir}`;