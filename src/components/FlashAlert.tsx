import styled from "@emotion/styled";
import { Alert, AlertTitle, Box, CircularProgress, LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { useContext } from "react";
import { FlashAlertSeverityMap, FlashState, FlashStateDisplayStrings, versionString } from "../consts";
import { AppContext } from "../context";

const AlertStyled = styled(Alert)`
  top: 0;
	padding-top: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  width: 100%;
	height: 90px;
`;

const StandardLinearProgress = styled(LinearProgress)`
	width: 400px;
`;

const FlashAlert = () => {
  const { flashState, setFlashState } = useContext(AppContext);
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
			{flashState === FlashState.FLASHING && <StandardLinearProgress />}
    </AlertStyled>
  );
};

export default FlashAlert;
