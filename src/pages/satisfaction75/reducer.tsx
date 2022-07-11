import { Reducer } from "react";

export type Satisfaction75State = {
	bigClockEnabled: boolean;
	bongoEnabled: boolean;
	petsEnabled: boolean;
	customGifEnabled: boolean;
	gifUrl: string;
	gifCode: string;
}

type Action = {
	type: ActionType;
	payload?: any; // TODO??
}

type ActionType = 
	| "TOGGLE_BIG_CLOCK_MODE"
	| "TOGGLE_BONGO_MODE"
	| "TOGGLE_PETS_MODE"
	| "TOGGLE_CUSTOM_GIF_MODE"
	| "UPDATE_GIF"
;

export const initialState: Satisfaction75State = {
  bigClockEnabled: true,
	bongoEnabled: true,
	petsEnabled: true,
	customGifEnabled: false,
	gifUrl: "",
	gifCode: "",
};

export const reducer: Reducer<Satisfaction75State, Action> = (state, action) => {
	const { type, payload } = action;
  switch (type) {
		case "TOGGLE_BIG_CLOCK_MODE":
			return { ...state, bigClockEnabled: !state.bigClockEnabled };
		case "TOGGLE_BONGO_MODE":
				return { ...state, bongoEnabled: !state.bongoEnabled };
		case "TOGGLE_PETS_MODE":
				return { ...state, petsEnabled: !state.petsEnabled };
		case "TOGGLE_CUSTOM_GIF_MODE":
				return { ...state, customGifEnabled: !state.customGifEnabled };
		case "UPDATE_GIF":
			if (!payload.gifUrl && !payload.gifCode) {
				return { ...state, gifUrl: "", gifCode: "" };
			}
			return { 
				...state, 
				gifUrl: payload.gifUrl || state.gifUrl,
				gifCode: payload.gifCode || state.gifCode,
			};
    default:
      return state;
  }
};