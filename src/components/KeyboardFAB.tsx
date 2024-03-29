import styled from "@emotion/styled";
import { Download, Downloading } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FlashState } from "../constants/types/flashState";
import { useAppContext } from "../controllers/context/appContext";
import { useAtyuContext } from "../controllers/context/atyuContext";
import runFlash from "../functions/commands/runFlash";

const FABBox = styled(Paper)`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  z-index: 10;
`;

const KeyboardFAB = () => {
  const appContext = useAppContext();
  const atyuContext = useAtyuContext();
	const { keyboard, keyboardsConfig, flashState, isDoingTask, setKeyboard } = appContext;

  const handleChange = (event: SelectChangeEvent<string>) => {
    setKeyboard(event.target.value);
  };

  const canFlash =
    !isDoingTask &&
    (flashState === FlashState.DONE ||
      flashState === FlashState.IDLE ||
      flashState === FlashState.ERROR);

  const handleRunFlash = (onlyPatch: boolean) => {
    runFlash(appContext, atyuContext, onlyPatch);
  };

  return (
    <FABBox elevation={0}>
      <FormControl>
        <InputLabel>Keyboard</InputLabel>
        <Select disabled={!canFlash} value={keyboard} label="Keyboard" onChange={(e) => handleChange(e)}>
          {Object.values(keyboardsConfig).map((keyboard) => (
            <MenuItem key={keyboard.key} value={keyboard.key} id={keyboard.key}>
              {keyboard.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        sx={{ ml: "8px" }}
        variant="outlined"
        endIcon={<Download />}
        onClick={() => handleRunFlash(true)}
        disabled={!canFlash}
      >
        Save
      </Button>
      <Button
        sx={{ ml: "8px" }}
        variant="contained"
        endIcon={<Downloading />}
        onClick={() => handleRunFlash(false)}
        disabled={!canFlash}
      >
        Save & Install
      </Button>
    </FABBox>
  );
};

export default KeyboardFAB;
