export const exhaustSwitch = (type: never): never => {
	throw new Error(`Unhandled type for switch: ${type}`);
};
