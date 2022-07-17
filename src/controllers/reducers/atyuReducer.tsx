import { Reducer } from "react";
import { AtyuConfig } from "../../constants/types/atyuConfig";
import { exhaustSwitch } from "../../functions/generic";

export const testConfig: AtyuConfig[] = [
	{
		name: "Keyboard Matrix",
		desc: "",
		key: "",
		configurable: false,
		enabledByDefault: true,
		children: [],
	},
	{
		name: "Big Clock",
		desc: "",
		key: "OLED_CLOCK_ENABLED",
		configurable: true,
		enabledByDefault: true,
		children: [],
	},
	{
		name: "Bongo Cat",
		desc: "",
		key: "OLED_BONGO_ENABLED",
		configurable: true,
		enabledByDefault: false,
		children: [
			{
				name: "Use filled bongo cat",
				struct: {
					type: "switch",
					key: "OLED_BONGO_FILLED",
					defaultValue: false,
				}
			}
		],
	},
	{
		name: "Pets Mode",
		desc: "",
		key: "OLED_PETS_ENABLED",
		configurable: true,
		enabledByDefault: false,
		children: [
			{
				name: "Choose your pets",
				desc: "put controls here",
				struct: {
					type: "multiselect_boolean",
					multiselectStruct: [
						{
							name: "Luna",
							key: "OLED_PET_LUNA_ENABLED",
							defaultValue: true,
						},
						{
							name: "Kirby",
							key: "OLED_PET_KIRBY_ENABLED",
							defaultValue: false,
						},
						{
							name: "Pusheen",
							key: "OLED_PET_PUSHEEN_ENABLED",
							defaultValue: true,
						}
					],
					multiselectOptions: {
						max: 3,
					}
				}
			}
		],
	},
	{
		name: "Custom Gif",
		desc: "Have a separate mode to show a looping GIF.",
		key: "OLED_GIF_ENABLED",
		configurable: true,
		enabledByDefault: false,
		children: [
			// {
			// 	name: "Upload a gif",
			// 	struct: {
			// 		type: "special_upload_gif",

			// 	}
			// }
		]
	}
];

export type AtyuState = {
	[key: string]: any;
}

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
			initialState[configSection.key] = configSection.enabledByDefault;
		}
		configSection.children.forEach(childConfigSection => {
			const { type } = childConfigSection.struct;
			switch (type) {
				case "multiselect_boolean": {
					const { multiselectStruct } = childConfigSection.struct;
					multiselectStruct.forEach(multiselectKey => {
						initialState[multiselectKey.key] = multiselectKey.defaultValue;
					});
					break;
				}
				case "multiselect_number": {
					const { multiselectKey, defaultValue } = childConfigSection.struct;
					initialState[multiselectKey] = defaultValue;
					break;
				}
				case "switch":
					const { key, defaultValue } = childConfigSection.struct;
					initialState[key] = defaultValue;
					break;
				default: 
					exhaustSwitch(type);
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
			console.log(`Updating ${key} to ${!state[key]}`)
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
			exhaustSwitch(type);
			return state;
	}
}
