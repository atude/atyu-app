import { createContext, Dispatch, SetStateAction } from "react";
import { FlashState } from "../consts";

const defaultKeyboard = "satisfaction75";

type AppContextType = {
  keyboard: string;
	flashState: FlashState;
	setKeyboard: Dispatch<SetStateAction<string>>;
	setFlashState: Dispatch<SetStateAction<FlashState>>;
}

export const AppContext = createContext<AppContextType>({
	keyboard: defaultKeyboard,
	flashState: FlashState.IDLE,
	setKeyboard: () => {},
	setFlashState: () => {},
});