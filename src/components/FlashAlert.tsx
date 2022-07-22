import styled from "@emotion/styled";
import { Alert, AlertTitle, Box, Button, ButtonGroup, CircularProgress, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { versionString } from "../constants";
import {
  FlashAlertSeverityMap,
  FlashState,
  FlashStateDisplayStrings,
} from "../constants/types/flashState";
import { useAppContext } from "../controllers/context/appContext";
import { cancelFlash } from "../functions/commands/runFlash";

const AlertStyled = styled(Alert)`
  top: 0;
  position: fixed;
  padding-top: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 90px;
  z-index: 9999;
`;

const ActionButtonsContainer = styled(Box)`
  position: fixed;
  right: 0;
  top: 0;
  margin: 24px;
`;

const LogBox = styled(Box)`
  position: fixed;
	display: flex;
	flex-direction: column-reverse;
	top: 0;
	left: 0;
  height: 300px;
  width: 100%;
  margin-top: 88px;
	padding: 20px;
	overflow-y: scroll;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	background-color: #000;
	box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 8px;
	overscroll-behavior: contain;
`;

const StandardLinearProgress = styled(LinearProgress)`
  width: 400px;
`;

const StyledCircularProgress = styled(CircularProgress)`
	margin-right: 20px;
	margin-left: 20px;
`;

const FlashAlert = () => {
  const { flashState, flashMessage, flashProgress, log, setFlashState, setFlashMessage } =
    useAppContext();
  const flashSeverity = FlashAlertSeverityMap[flashState];
  const displayString = FlashStateDisplayStrings[flashState];
  const [viewLog, setViewLog] = useState(false);

  useEffect(() => {
    if (flashState === FlashState.DONE || flashState === FlashState.CANCELLED) {
      setTimeout(() => {
				setFlashState((prevFlashState) => {
					if (prevFlashState === FlashState.DONE || prevFlashState === FlashState.CANCELLED) {
						setFlashMessage("");
						return FlashState.IDLE;
					}
					return prevFlashState;
				});
      }, 5000);
    }
  }, [flashState, setFlashState, setFlashMessage]);

	const handleCancel = () => cancelFlash();

  const getLogComponent = () => (
    <>
			<ActionButtonsContainer>
				<ButtonGroup>
					{flashState === FlashState.WAITING_FOR_DFU && (
						<Button key="cancel" color="error" variant="outlined" onClick={() => handleCancel()}>
							Cancel
						</Button>
					)}
					<Button key="log" variant="outlined" onClick={() => setViewLog(!viewLog)}>
						{viewLog ? "Hide" : "View"} log
					</Button>
				</ButtonGroup>
			</ActionButtonsContainer>
			{!!viewLog && (
				<LogBox>
					{log.map((logString, i) => (
						<div key={i}><code style={{ fontSize: "12px" }}>{logString}</code></div>
					))}
				</LogBox>
			)}
    </>
  );

  return !flashSeverity ? (
    <AlertStyled severity="info" icon={false}>
      <AlertTitle>Atyu | OLED mods for QMK keyboards</AlertTitle>
      {versionString}
      {getLogComponent()}
    </AlertStyled>
  ) : (
    <AlertStyled severity={flashSeverity}>
      <AlertTitle>{displayString}</AlertTitle>
      {(flashState === FlashState.COMPILING || flashState === FlashState.PATCHING) && (
        <StandardLinearProgress />
      )}
      {flashState === FlashState.WAITING_FOR_DFU && (
        <Box display="flex" flexDirection="row" alignItems="center">
          <span>Please press the RESET key on your keyboard</span>
          <StyledCircularProgress size={20} />
        </Box>
      )}
      {(flashState === FlashState.FLASHING_ERASING ||
        flashState === FlashState.FLASHING_DOWNLOADING) && (
        <StandardLinearProgress variant="determinate" value={flashProgress} />
      )}
      {flashState === FlashState.ERROR && flashMessage.length && <span>{flashMessage}</span>}
			{flashState === FlashState.RUNNING_SETUP && flashMessage.length && (
				<Box display="flex" flexDirection="row" alignItems="center">
					<span>{flashMessage}</span>
					<StyledCircularProgress size={20} />
				</Box>
			)}
      {getLogComponent()}
    </AlertStyled>
  );
};

export default FlashAlert;
