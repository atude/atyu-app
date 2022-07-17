import styled from "@emotion/styled";
import { Alert, AlertTitle, Box, CircularProgress, LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { versionString } from "../constants";
import { FlashAlertSeverityMap, FlashState, FlashStateDisplayStrings } from "../constants/types/flashState";
import { useAppContext } from "../controllers/context/appContext";

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

const StandardLinearProgress = styled(LinearProgress)`
	width: 400px;
`;

const FlashAlert = () => {
  const { flashState, setFlashState, flashProgress } = useAppContext();
  const flashSeverity = FlashAlertSeverityMap[flashState];
  const displayString = FlashStateDisplayStrings[flashState];

	useEffect(() => {
		if (flashState === FlashState.DONE) {
			setTimeout(() => {
				if (flashState === FlashState.DONE) {
					setFlashState(FlashState.IDLE);
				}
			}, 5000);
		}
	}, [flashState, setFlashState]);

  return !flashSeverity ? (
    <AlertStyled severity="info" icon={false}>
				<AlertTitle>Atyu | OLED mods for QMK keyboards</AlertTitle>
				{versionString}
    </AlertStyled>
  ) : (
    <AlertStyled severity={flashSeverity}>
			<AlertTitle>{displayString}</AlertTitle>
			{flashState === FlashState.COMPILING && <StandardLinearProgress />}
			{flashState === FlashState.WAITING_FOR_DFU && (
				<Box display="flex" flexDirection="row" alignItems="center">
					<span>Please press the RESET key on your keyboard&nbsp;&nbsp;</span>
					<CircularProgress size={20}/>
				</Box>
			)}
			{
				(
					flashState === FlashState.FLASHING_ERASING || 
					flashState === FlashState.FLASHING_DOWNLOADING
				) && (
					<StandardLinearProgress variant="determinate" value={flashProgress} />
				)
			}
    </AlertStyled>
  );
};

export default FlashAlert;
