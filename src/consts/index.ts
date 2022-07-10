import { AlertColor } from "@mui/material";

export enum FlashState {
	IDLE,
	COMPILING,
	WAITING_FOR_DFU,
	FLASHING,
	DONE,
	ERROR,
};

export const FlashStateDisplayStrings: Record<FlashState, string> = {
	[FlashState.IDLE]: "",
	[FlashState.COMPILING]: "Building firmware...",
	[FlashState.WAITING_FOR_DFU]: "Waiting for your keyboard to go into RESET mode...",
	[FlashState.FLASHING]: "Installing firmware...",
	[FlashState.DONE]: "Done!",
	[FlashState.ERROR]: "Error during installation!",
};

export const FlashAlertSeverityMap: Record<FlashState, AlertColor | undefined> = {
	[FlashState.IDLE]: undefined,
	[FlashState.COMPILING]: "info",
	[FlashState.WAITING_FOR_DFU]: "info",
	[FlashState.FLASHING]: "info",
	[FlashState.DONE]: "success",
	[FlashState.ERROR]: "error",
}