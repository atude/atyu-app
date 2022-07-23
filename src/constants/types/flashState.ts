import { AlertColor } from "@mui/material";

export enum FlashState {
	IDLE,
	PATCHING,
	COMPILING,
	WAITING_FOR_DFU,
	FLASHING_ERASING,
	FLASHING_DOWNLOADING,
	DONE,
	ERROR,
	CANCELLED,
	RUNNING_SETUP,
	UPDATING,
};

export const FlashStateDisplayStrings: Record<FlashState, string> = {
	[FlashState.IDLE]: "",
	[FlashState.PATCHING]: "Saving changes...",
	[FlashState.COMPILING]: "Building firmware...",
	[FlashState.WAITING_FOR_DFU]: "Waiting for your keyboard to go into flash mode...",
	[FlashState.FLASHING_ERASING]: "Removing old firmware...",
	[FlashState.FLASHING_DOWNLOADING]: "Installing firmware...",
	[FlashState.DONE]: "Done!",
	[FlashState.ERROR]: "An error occurred.",
	[FlashState.CANCELLED]: "Cancelled task.",
	[FlashState.RUNNING_SETUP]: "Running initial setup...",
	[FlashState.UPDATING]: "Updating...",
};

export const FlashAlertSeverityMap: Record<FlashState, AlertColor | undefined> = {
	[FlashState.IDLE]: undefined,
	[FlashState.PATCHING]: "info",
	[FlashState.COMPILING]: "info",
	[FlashState.WAITING_FOR_DFU]: "info",
	[FlashState.FLASHING_ERASING]: "info",
	[FlashState.FLASHING_DOWNLOADING]: "info",
	[FlashState.DONE]: "success",
	[FlashState.ERROR]: "error",
	[FlashState.CANCELLED]: "warning",
	[FlashState.RUNNING_SETUP]: "info",
	[FlashState.UPDATING]: "info",
}