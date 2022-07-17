import React, { createContext, useContext, useReducer } from "react";
import { reducer, initialState, AtyuState } from "../reducers/atyuReducer";

export type AtyuContext = AtyuState & {
	dispatchToggleKey: (key: string) => void;
	dispatchUpdateGif: (gifUrl?: string, gifCode?: string) => void;
};

const context = createContext<AtyuContext>({
  ...initialState,
  dispatchToggleKey: (key: string) => {},
  dispatchUpdateGif: (gifUrl?: string, gifCode?: string) => {},
});

export const AtyuConfigProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: AtyuContext = {
    ...state,
    dispatchToggleKey: (key: string) => dispatch({ type: "TOGGLE", payload: { key } }),
    dispatchUpdateGif: (gifUrl?: string, gifCode?: string) =>
      dispatch({ type: "UPDATE_GIF", payload: { gifUrl, gifCode } }),
  };

  console.log(value);

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useAtyuContext = () => {
  const atyuContext = useContext(context);
  return atyuContext;
};
