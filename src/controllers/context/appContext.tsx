import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { FlashState } from "../../constants/types/flashState";

const defaultKeyboard = "satisfaction75";

type AppContext = {
  keyboard: string;
	flashState: FlashState;
	flashProgress: number;
	isDoingTask: boolean;
	setKeyboard: Dispatch<SetStateAction<string>>;
	setFlashState: Dispatch<SetStateAction<FlashState>>;
	setFlashProgress: Dispatch<SetStateAction<number>>;
	setDoingTask:  Dispatch<SetStateAction<boolean>>;
}

const context = createContext<AppContext>({
	keyboard: defaultKeyboard,
	flashState: FlashState.IDLE,
	flashProgress: 0,
	isDoingTask: false,
	setKeyboard: () => {},
	setFlashState: () => {},
	setFlashProgress: () => {},
	setDoingTask: () => {},
});

export const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  const [keyboard, setKeyboard] = useState<string>(defaultKeyboard);
  const [flashState, setFlashState] = useState<FlashState>(FlashState.IDLE);
  const [flashProgress, setFlashProgress] = useState<number>(0);
	const [isDoingTask, setDoingTask] = useState<boolean>(false);

  const value: AppContext = {
		keyboard,
		setKeyboard,
		flashState,
		setFlashState,
		flashProgress,
		setFlashProgress,
		isDoingTask, 
		setDoingTask,
  };

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useAppContext = () => {
  const appContext = useContext(context);
  return appContext;
};