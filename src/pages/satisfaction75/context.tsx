import React, { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";

export const Satisfaction75Context = createContext({
	...initialState,
	toggleMatrixEnabled: () => {},
	toggleBigClockEnabled: () => {},
	toggleCustomGifEnabled: () => {},
});

export const Satisfaction75Provider = ({ children }: { children?: React.ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
	
	const toggleMatrixEnabled = () =>  dispatch({ type: "TOGGLE_MATRIX_MODE" });
	const toggleBigClockEnabled = () => dispatch({ type: "TOGGLE_BIG_CLOCK_MODE" });
	const toggleCustomGifEnabled = () => dispatch({ type: "TOGGLE_CUSTOM_GIF_MODE" });

	const value = {
		matrixEnabled: state.matrixEnabled,
		bigClockEnabled: state.bigClockEnabled,
		customGifEnabled: state.customGifEnabled,
		toggleMatrixEnabled,
		toggleBigClockEnabled,
		toggleCustomGifEnabled,
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
