import { Reducer } from "react";
import { AtyuConfig } from "../../types/atyuConfig";

export const testConfig: AtyuConfig[] = [
	{
		name: "Keyboard Matrix",
		description: "",
		key: "",
		configurable: false,
		isEnabledByDefault: false,
		children: [],
	},
	{
		name: "Big Clock",
		description: "",
		key: "OLED_CLOCK_ENABLED",
		configurable: true,
		isEnabledByDefault: false,
		children: [],
	},
	{
		name: "Bongo Cat",
		description: "",
		key: "OLED_BONGO_ENABLED",
		configurable: true,
		isEnabledByDefault: false,
		children: [],
	},
	{
		name: "Pets Mode",
		description: "",
		key: "OLED_PETS_ENABLED",
		configurable: true,
		isEnabledByDefault: false,
		children: [
			{
				name: "Enabled Pets",
				description: "Choose up to 3 pets",
				structure: {
					type: "multiselect_boolean",
					multiselectKeys: [
						{
							key: "OLED_PET_LUNA_ENABLED",
							defaultValue: true,
						},
						{
							key: "OLED_PET_KIRBY_ENABLED",
							defaultValue: false,
						},
						{
							key: "OLED_PET_PUSHEEN_ENABLED",
							defaultValue: true,
						}
					],
					multiselectOptions: {
						min: 1,
						max: 3,
					}
				}
			}
		],
	},
];

export type AtyuState = {
	[key: string]: any;
}
export type AtyuContext = AtyuState & {
	dispatchToggleKey: (key: string) => void;
	dispatchUpdateGif: (gifUrl?: string, gifCode?: string) => void;
};

type AtyuTogglePayload = {
	key?: string;
};

type AtyuGifPayload = {
	gifUrl?: string;
	gifCode?: string;
};

type AtyuReducerPayload = 
	| AtyuTogglePayload
	| AtyuGifPayload
;

type AtyuReducerType = 
	| "TOGGLE"
	| "UPDATE_GIF"
;

type Action = {
	type: AtyuReducerType;
	payload?: AtyuReducerPayload;
}

// Create an initial state that can be consumed by the reducer.
// This should be rerun whenever the keyboard is changed, and then the state
// updated in context or reducer somehow
const generateInitialState = (config: AtyuConfig[]): AtyuState => {
	const initialState: AtyuState = {};

	config.forEach(configSection => {
		if (configSection.key) {
			initialState[configSection.key] = configSection.isEnabledByDefault;
		}
		configSection.children.forEach(childConfigSection => {
			switch (childConfigSection.structure.type) {
				case "multiselect_boolean": {
					const { multiselectKeys } = childConfigSection.structure;
					multiselectKeys.forEach(multiselectKey => {
						initialState[multiselectKey.key] = multiselectKey.defaultValue;
					});
					break;
				}
				case "multiselect_number": {
					const { multiselectKey, defaultValue } = childConfigSection.structure;
					initialState[multiselectKey] = defaultValue;
					break;
				}
			}
		}); 
	});

	console.log("Initial state:");
	console.log(initialState);
	return initialState;
};

export const initialState = generateInitialState(testConfig);

export const reducer: Reducer<AtyuState, Action> = (state, action) => {
	const { type } = action;

	switch (type) {
		case "TOGGLE":
			const { key } = action?.payload as AtyuTogglePayload;
			if (!key) {
				console.log("couldnt find key in payload");
				return state;
			}
			return { ...state, [key]: (!state[key] || false) };
		case "UPDATE_GIF":
			const { gifUrl, gifCode } = action?.payload as AtyuGifPayload;
			if (!gifUrl && !gifCode) {
				return { ...state, gifUrl: "", gifCode: "" };
			}
			return { 
				...state, 
				gifUrl: gifUrl || state.gifUrl,
				gifCode: gifCode || state.gifCode,
			};
		default:
			console.log(state);
			return state;
	}
}
