import { createContext, Dispatch, SetStateAction } from "react";
import { FlashState } from "../consts";

const defaultKeyboard = "satisfaction75";

type AppContextType = {
  keyboard: string;
	flashState: FlashState;
	flashProgress: number;
	setKeyboard: Dispatch<SetStateAction<string>>;
	setFlashState: Dispatch<SetStateAction<FlashState>>;
	setFlashProgress: Dispatch<SetStateAction<number>>;
}

export const AppContext = createContext<AppContextType>({
	keyboard: defaultKeyboard,
	flashState: FlashState.IDLE,
	flashProgress: 0,
	setKeyboard: () => {},
	setFlashState: () => {},
	setFlashProgress: () => {},
});