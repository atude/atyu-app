type Keyboard = {
	key: string;
	name: string;
	qmkKb: string;
	qmkKm: string;
};

export const keyboardsMap: Record<string, Keyboard> = {
	satisfaction75: {
		key: "satisfaction75",
		name: "Satisfaction75",
		qmkKb: "cannonkeys/satisfaction75/rev1",
		qmkKm: "via",
	},
};

export const keyboardsArray = Object.values(keyboardsMap);
export const defaultKeyboard = "satisfaction75";
