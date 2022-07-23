import _Store from "electron-store";
import { createContext, useContext, useEffect, useState } from "react";
const Store: typeof _Store = window.require("electron-store");

// Global saved settings
type AppStore = {
  enableFirmwareSizeCheck: boolean;
};

type AppStoreFunctions = {
  toggleEnableFirmwareSizeCheck: () => void;
};

const defaults: AppStore = {
  enableFirmwareSizeCheck: true,
};

// For reading only purposes, we can reference the store directly instead of
// needing to import the whole context
export const appStore = new Store<AppStore>({ defaults });

export type AppStoreContext = AppStore & AppStoreFunctions;

const context = createContext<AppStoreContext>({
  ...appStore.store,
  toggleEnableFirmwareSizeCheck: () => {},
});

export const AppStoreProvider = ({ children }: { children?: React.ReactNode }) => {
  const [appStoreState, setAppStoreState] = useState<AppStore>(appStore.store);

	// Update entire store if any changes are found
  useEffect(() => {
		appStore.store = appStoreState;
	}, [appStoreState]);

  const value: AppStoreContext = {
    ...appStoreState,
    toggleEnableFirmwareSizeCheck: () =>
      setAppStoreState({
        ...appStoreState,
        enableFirmwareSizeCheck: !appStoreState.enableFirmwareSizeCheck,
      }),
  };

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useAppStoreContext = () => {
  const appStoreContext = useContext(context);
  return appStoreContext;
};
