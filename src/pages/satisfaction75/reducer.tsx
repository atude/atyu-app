import { Reducer } from "react";

export type Satisfaction75State = {
	matrixEnabled: boolean;
	bigClockEnabled: boolean;
	customGifEnabled: boolean;
	gifUrl: string;
	gifCode: string;
}

type Action = {
	type: ActionType;
	payload?: any; // TODO??
}

type ActionType = 
	| "TOGGLE_MATRIX_MODE"
	| "TOGGLE_BIG_CLOCK_MODE"
	| "TOGGLE_CUSTOM_GIF_MODE"
	| "UPDATE_GIF"
;

export const initialState: Satisfaction75State = {
	matrixEnabled: true,
  bigClockEnabled: true,
	customGifEnabled: false,
	gifUrl: "",
	gifCode: "",
};

export const reducer: Reducer<Satisfaction75State, Action> = (state, action) => {
	const { type, payload } = action;
	console.log(state);
  switch (type) {
    case "TOGGLE_MATRIX_MODE":
			return {
				...state,
				matrixEnabled: !state.matrixEnabled,
			};
		case "TOGGLE_BIG_CLOCK_MODE":
			return { ...state, bigClockEnabled: !state.bigClockEnabled };
		case "TOGGLE_CUSTOM_GIF_MODE":
				return { ...state, customGifEnabled: !state.customGifEnabled };
		case "UPDATE_GIF":
			if (!payload.gifUrl && !payload.gifCode) {
				return state;
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