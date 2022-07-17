import React, { createContext, useContext, useReducer } from "react";
import { reducer, initialState, AtyuState } from "../reducers/atyuReducer";

export type AtyuContext = AtyuState & {
	dispatchUpdateValue: (key: string, value: string | number | boolean) => void;
	dispatchUpdateGif: (gifUrl?: string, gifCode?: string) => void;
};

const context = createContext<AtyuContext>({
  ...initialState,
	dispatchUpdateValue: (key: string, value: string | number | boolean) => {},
  dispatchUpdateGif: (gifUrl?: string, gifCode?: string) => {},
});

export const AtyuConfigProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
