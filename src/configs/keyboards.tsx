import { ReactElement } from "react";
import Satisfaction75 from "../pages/keyboards/Satisfaction75";

type Keyboard = {
	key: string;
	name: string;
	qmkKb: string;
	qmkKm: string;
	home: ReactElement;
};

export const keyboardsMap: Record<string, Keyboard> = {
	satisfaction75: {
		key: "satisfaction75",
		name: "Satisfaction75",
		qmkKb: "cannonkeys/satisfaction75/rev1",
		qmkKm: "via",
		home: <Satisfaction75 />,
	},
};

export const keyboardsArray = Object.values(keyboardsMap);

export const defaultKeyboard = "satisfaction75";
