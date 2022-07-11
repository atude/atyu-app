import React, { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";

export const Satisfaction75Context = createContext({
	...initialState,
	toggleBigClockEnabled: () => {},
	toggleBongoEnabled: () => {},
	togglePetsEnabled: () => {},
	toggleCustomGifEnabled: () => {},
	updateGif: (gifUrl?: string, gifCode?: string) => {},
});

export const Satisfaction75Provider = ({ children }: { children?: React.ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
	
	const toggleBigClockEnabled = () => dispatch({ type: "TOGGLE_BIG_CLOCK_MODE" });
	const toggleBongoEnabled = () => dispatch({ type: "TOGGLE_BONGO_MODE" });
	const togglePetsEnabled = () => dispatch({ type: "TOGGLE_PETS_MODE" });
	const toggleCustomGifEnabled = () => dispatch({ type: "TOGGLE_CUSTOM_GIF_MODE" });
	const updateGif = (gifUrl?: string, gifCode?: string) => {
		dispatch({ type: "UPDATE_GIF", payload: { gifUrl, gifCode } });
	};

	const value = {
		bigClockEnabled: state.bigClockEnabled,
		bongoEnabled: state.bongoEnabled,
		petsEnabled: state.petsEnabled,
		customGifEnabled: state.customGifEnabled,
		gifUrl: state.gifUrl,
		gifCode: state.gifCode,
		toggleBigClockEnabled,
		toggleBongoEnabled,
		togglePetsEnabled,
		toggleCustomGifEnabled,
		updateGif,
	};

	return (
		<Satisfaction75Context.Provider value={value}>
			{children}
		</Satisfaction75Context.Provider>
	);
};

export const useSatisfaction75 = () => {
  const context = useContext(Satisfaction75Context);
  return context;
}
