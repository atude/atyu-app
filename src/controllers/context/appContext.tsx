import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { defaultKeyboardKey } from "../../constants";
import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";

export type AppContext = {
	appReadyState: AppReadyState;
  keyboard: string;
	flashState: FlashState;
	flashMessage: string;
	flashProgress: number;
	isDoingTask: boolean;
	log: string[];
	setAppReadyState: Dispatch<SetStateAction<AppReadyState>>;
	setKeyboard: Dispatch<SetStateAction<string>>;
	setFlashState: Dispatch<SetStateAction<FlashState>>;
	setFlashMessage: Dispatch<SetStateAction<string>>;
	setFlashProgress: Dispatch<SetStateAction<number>>;
	setDoingTask:  Dispatch<SetStateAction<boolean>>;
	setLog:  Dispatch<SetStateAction<string[]>>;
}

const context = createContext<AppContext>({
	appReadyState: AppReadyState.LOADING,
	keyboard: defaultKeyboardKey,
	flashState: FlashState.IDLE,
	flashMessage: "",
	flashProgress: 0,
	isDoingTask: false,
	log: [],
	setAppReadyState: () => {},
	setKeyboard: () => {},
	setFlashState: () => {},
	setFlashMessage: () => {},
	setFlashProgress: () => {},
	setDoingTask: () => {},
	setLog: () => {},
});

export const AppProvider = ({ children }: { children?: React.ReactNode }) => {
	const [appReadyState, setAppReadyState] = useState<AppReadyState>(AppReadyState.LOADING);
  const [keyboard, setKeyboard] = useState<string>(defaultKeyboardKey);
  const [flashState, setFlashState] = useState<FlashState>(FlashState.IDLE);
	const [flashMessage, setFlashMessage] = useState<string>("");
  const [flashProgress, setFlashProgress] = useState<number>(0);
	const [isDoingTask, setDoingTask] = useState<boolean>(false);
	const [log, setLog] = useState<string[]>([]);

  const value: AppContext = {
		appReadyState,
		setAppReadyState,
		keyboard,
		setKeyboard,
		flashState,
		setFlashState,
		flashMessage,
		setFlashMessage,
		flashProgress,
		setFlashProgress,
		isDoingTask, 
		setDoingTask,
		log,
		setLog,
  };

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useAppContext = () => {
  const appContext = useContext(context);
  return appContext;
};