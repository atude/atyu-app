export const exhaustSwitch = (type: never): never => {
	throw new Error(`Unhandled type for switch: ${type}`);
};

export const getKeyboardDir = (baseDir: string, keyboardDir: string) =>
  `${baseDir}/qmk_firmware/${keyboardDir}`;