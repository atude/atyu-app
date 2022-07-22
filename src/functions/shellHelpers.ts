export const atyuDir = "~/.atyu/";
export const atyuQmkDir = `${atyuDir}qmk_firmware/`;
export const atyuHomeConfigFile = `${atyuDir}qmk_firmware/atyu_home.json`;

export const getKeyboardDir = (keyboardDir: string) =>
  `${atyuQmkDir}${keyboardDir}`;