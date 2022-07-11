import { AlertColor } from "@mui/material";
import { ReactElement } from "react";

export const versionString = "v0.1 alpha"
export const defaultEmptyGif = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export type OledMode = {
	name: string;
	component?: ReactElement;
	icon: ReactElement;
	toggleEnabled?: () => void;
	isEnabled?: boolean;
};

export enum FlashState {
	IDLE,
	COMPILING,
	WAITING_FOR_DFU,
	FLASHING_ERASING,
	FLASHING_DOWNLOADING,
	DONE,
	ERROR,
};

export const FlashStateDisplayStrings: Record<FlashState, string> = {
	[FlashState.IDLE]: "",
	[FlashState.COMPILING]: "Building firmware...",
	[FlashState.WAITING_FOR_DFU]: "Waiting for your keyboard to go into flash mode...",
	[FlashState.FLASHING_ERASING]: "Removing old firmware...",
	[FlashState.FLASHING_DOWNLOADING]: "Installing firmware...",
	[FlashState.DONE]: "Done!",
	[FlashState.ERROR]: "Error during installation!",
};

export const FlashAlertSeverityMap: Record<FlashState, AlertColor | undefined> = {
	[FlashState.IDLE]: undefined,
	[FlashState.COMPILING]: "info",
	[FlashState.WAITING_FOR_DFU]: "info",
	[FlashState.FLASHING_ERASING]: "info",
	[FlashState.FLASHING_DOWNLOADING]: "info",
	[FlashState.DONE]: "success",
	[FlashState.ERROR]: "error",
}