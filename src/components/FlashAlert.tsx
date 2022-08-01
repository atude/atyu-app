import styled from "@emotion/styled";
import { CancelOutlined, SaveAlt, Segment } from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  LinearProgress,
	Snackbar,
	Tooltip,
} from "@mui/material";
import { useState } from "react";
import { versionString } from "../constants";
import {
  FlashAlertSeverityMap,
  FlashState,
  FlashStateDisplayStrings,
} from "../constants/types/flashState";
import { useAppContext } from "../controllers/context/appContext";
import { cancelFlash } from "../functions/commands/runFlash";
import { nodeCmd } from "../functions/commands/shell";
import { logFilePath, pathOf } from "../functions/path";

const AlertStyled = styled(Alert)`
  top: 0;
  position: fixed;
  padding-top: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 90px;
  z-index: 999;
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
  const { flashState, flashMessage, flashProgress, log } = useAppContext();
  const flashSeverity = FlashAlertSeverityMap[flashState];
  const displayString = FlashStateDisplayStrings[flashState];
  const [viewLog, setViewLog] = useState(false);
	const [snackbar, setSnackbar] = useState<[string, AlertColor]>(["", "info"]);

  const handleCancel = () => cancelFlash();
	const downloadLog = () => {
		console.log(pathOf(logFilePath));
		const cmd = nodeCmd.saveToFile(log.reverse().join("\n"), pathOf(logFilePath));
		if (cmd.success) {
			setSnackbar(["Saved log to desktop", "success"]);
		} else {
			setSnackbar(["Failed to save log to desktop", "error"]);
		}
	}

  const getLogComponent = () => (
    <>
      <ActionButtonsContainer>
				<Snackbar open={!!snackbar[0].length} autoHideDuration={6000} onClose={() => setSnackbar(["", "info"])}>
					<Alert severity={snackbar[1]}>
						{snackbar[0]}
					</Alert>
				</Snackbar>	
        <ButtonGroup>
          {flashState === FlashState.WAITING_FOR_DFU && (
						<Tooltip title="Cancel installation">
							<Button key="cancel" color="error" variant="outlined" onClick={handleCancel}>
								<CancelOutlined />
							</Button>
						</Tooltip>
          )}
					<Tooltip title={viewLog ? "Hide log" : "View log"}>
						<Button key="view" variant="outlined" onClick={() => setViewLog(!viewLog)}>
							<Segment />
						</Button>
					</Tooltip>
					<Tooltip title="Save log to desktop">
						<Button key="dowload" variant="outlined" onClick={downloadLog}>
							<SaveAlt />
						</Button>
					</Tooltip>
        </ButtonGroup>
      </ActionButtonsContainer>
      {!!viewLog && (
        <LogBox>
          {log.map((logString, i) => (
            <div key={i}>
              <code style={{ fontSize: "12px" }}>{logString}</code>
            </div>
          ))}
        </LogBox>
      )}
    </>
  );

  return !flashSeverity ? (
    <AlertStyled severity="info" icon={false}>
      <AlertTitle>Atyu | Mods for QMK keyboards</AlertTitle>
      {versionString}
      {getLogComponent()}
    </AlertStyled>
  ) : (
    <AlertStyled severity={flashSeverity}>
      <AlertTitle>{displayString}</AlertTitle>
      <Box display="flex" flexDirection="row" alignItems="center">
        {!!flashMessage.length && <span>{flashMessage}</span>}
        {(flashState === FlashState.COMPILING ||
          flashState === FlashState.PATCHING ||
          flashState === FlashState.CHECK_SIZE) && <StandardLinearProgress />}
        {(flashState === FlashState.WAITING_FOR_DFU ||
          flashState === FlashState.RUNNING_SETUP ||
          flashState === FlashState.UPDATING) && <StyledCircularProgress size={20} />}
        {(flashState === FlashState.FLASHING_ERASING ||
          flashState === FlashState.FLASHING_DOWNLOADING) && (
          <StandardLinearProgress variant="determinate" value={flashProgress} />
        )}
      </Box>
      {getLogComponent()}
    </AlertStyled>
  );
};

export default FlashAlert;
