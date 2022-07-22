import React, { createContext, useContext, useEffect, useReducer } from "react";
import { reducer, AtyuState, generateInitialState } from "../reducers/atyuReducer";
import { useAppContext } from "./appContext";

export type AtyuContext = AtyuState & {
	dispatchUpdateValue: (key: string, value: string | number | boolean) => void;
	dispatchUpdateGif: (gifUrl?: string, gifCode?: string) => void;
};

const context = createContext<AtyuContext>({
	dispatchUpdateValue: (key: string, value: string | number | boolean) => {},
  dispatchUpdateGif: (gifUrl?: string, gifCode?: string) => {},
});

export const AtyuConfigProvider = ({ children }: { children?: React.ReactNode }) => {
	const { atyuConfigMap, keyboard } = useAppContext();
  const [state, dispatch] = useReducer(reducer, {});

	useEffect(() => {
		const newState = generateInitialState(atyuConfigMap[keyboard]);
		dispatch({ type: "CHANGE_KEYBOARD", payload: { newState }});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keyboard]);

  const value: AtyuContext = {
    ...state,
		dispatchUpdateValue: (key: string, value: string | number | boolean) => 
			dispatch({ type: "UPDATE_VALUE", payload: { key, value } }),
    dispatchUpdateGif: (gifUrl?: string, gifCode?: string) =>
      dispatch({ type: "UPDATE_GIF", payload: { gifUrl, gifCode } }),
  };

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useAtyuContext = () => {
  const atyuContext = useContext(context);
  return atyuContext;
};
