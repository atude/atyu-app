type Keyboard = {
	key: string;
	name: string;
	qmkKb: string;
	qmkKm: string;
	dir: string;
};

export const keyboardsMap: Record<string, Keyboard> = {
	satisfaction75: {
		key: "satisfaction75",
		name: "Satisfaction75",
		qmkKb: "cannonkeys/satisfaction75/rev1",
		qmkKm: "via",
		dir: "keyboards/cannonkeys/satisfaction75",
	},
};

export const keyboardsArray = Object.values(keyboardsMap);
export const defaultKeyboard = "satisfaction75";
