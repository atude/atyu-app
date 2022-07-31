import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { AtyuConfigMap } from "../../configs/atyuConfig";
import { KeyboardsConfig } from "../../configs/keyboardConfig";
import { defaultKeyboardKey } from "../../constants";
import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";

export type AppContext = {
  appReadyState: AppReadyState;
  keyboard: string;
  keyboardsConfig: KeyboardsConfig;
  atyuConfigMap: AtyuConfigMap;
  flashState: FlashState;
  flashMessage: string;
  flashProgress: number;
  isDoingTask: boolean;
  log: string[];
	thumbnails: Record<string, string>;
  setAppReadyState: Dispatch<SetStateAction<AppReadyState>>;
  setKeyboard: Dispatch<SetStateAction<string>>;
  setKeyboardsConfig: Dispatch<SetStateAction<KeyboardsConfig>>;
  setAtyuConfigMap: Dispatch<SetStateAction<AtyuConfigMap>>;
  setFlashState: (state: FlashState, msg?: string) => void;
  setFlashMessage: Dispatch<SetStateAction<string>>;
  setFlashProgress: Dispatch<SetStateAction<number>>;
  setDoingTask: Dispatch<SetStateAction<boolean>>;
  setLog: Dispatch<SetStateAction<string[]>>;
	setThumbnails: Dispatch<SetStateAction<Record<string, string>>>;
};

const context = createContext<AppContext>({
  appReadyState: AppReadyState.LOADING,
  keyboard: defaultKeyboardKey,
  keyboardsConfig: {},
  atyuConfigMap: {},
  flashState: FlashState.IDLE,
  flashMessage: "",
  flashProgress: 0,
  isDoingTask: false,
  log: [],
	thumbnails: {},
  setAppReadyState: () => {},
  setKeyboard: () => {},
  setKeyboardsConfig: () => {},
  setAtyuConfigMap: () => {},
  setFlashState: () => {},
  setFlashMessage: () => {},
  setFlashProgress: () => {},
  setDoingTask: () => {},
  setLog: () => {},
	setThumbnails: () => {},
});

let timer: NodeJS.Timeout;

export const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  const [appReadyState, setAppReadyState] = useState<AppReadyState>(AppReadyState.LOADING);
  const [keyboard, setKeyboard] = useState<string>(defaultKeyboardKey);
  const [keyboardsConfig, setKeyboardsConfig] = useState<KeyboardsConfig>({});
  const [atyuConfigMap, setAtyuConfigMap] = useState<AtyuConfigMap>({});
  const [flashState, setFlashState] = useState<FlashState>(FlashState.IDLE);
  const [flashMessage, setFlashMessage] = useState<string>("");
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const [isDoingTask, setDoingTask] = useState<boolean>(false);
  const [log, setLog] = useState<string[]>([]);
	const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  const timedFlashState = (state: FlashState) =>
    state === FlashState.DONE || state === FlashState.CANCELLED;

  useEffect(() => {
    if (timedFlashState(flashState)) {
			clearTimeout(timer);
			timer = setTimeout(
				() => {
					setFlashState(FlashState.IDLE);
					setFlashMessage("");
				},
				5000
			);
    } else {
			if (timer) {
				clearTimeout(timer);
			}
		}
  }, [flashState, flashMessage, setFlashState, setFlashMessage]);

  const value: AppContext = {
    appReadyState,
    setAppReadyState,
    keyboard,
    setKeyboard,
    keyboardsConfig,
    setKeyboardsConfig,
    atyuConfigMap,
    setAtyuConfigMap,
    flashState,
    setFlashState: (state: FlashState, msg?: string) => {
      setFlashState(state);
      setFlashMessage(msg ?? "");
    },
    flashMessage,
    setFlashMessage,
    flashProgress,
    setFlashProgress,
    isDoingTask,
    setDoingTask,
    log,
    setLog,
		thumbnails,
		setThumbnails,
  };

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useAppContext = () => {
  const appContext = useContext(context);
  return appContext;
};
