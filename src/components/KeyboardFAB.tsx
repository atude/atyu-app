import styled from "@emotion/styled";
import { Download } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { keyboardsArray } from "../configs/keyboards";
import { FlashState } from "../constants/types/flashState";
import { useAppContext } from "../controllers/context/appContext";
import { runFlash } from "../functions/flash";

const FABBox = styled(Paper)`
  position: fixed;
  bottom: 0;
  right: 0;
	padding: 12px;
	margin: 8px;
	border-radius: 10px;
  display: flex;
  flex-direction: row;
	z-index: 10;
`;

const KeyboardFAB = () => {
  const {
    keyboard,
    setKeyboard,
    flashState,
    setFlashState,
    setFlashProgress,
    isDoingTask,
  } = useAppContext();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setKeyboard(event.target.value);
  };

  const canFlash =
		!isDoingTask &&
    (flashState === FlashState.DONE || flashState === FlashState.IDLE);

  const handleRunFlash = () => {
    runFlash(keyboard, setFlashState, setFlashProgress);
  };

  return (
    <FABBox elevation={0}>
      <FormControl>
        <InputLabel>Keyboard</InputLabel>
        <Select
          value={keyboard}
          label="Keyboard"
          onChange={(e) => handleChange(e)}
        >
          {keyboardsArray.map((keyboard) => (
            <MenuItem key={keyboard.key} value={keyboard.key} id={keyboard.key}>
              {keyboard.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        sx={{ ml: "8px" }}
        variant="contained"
        endIcon={<Download />}
        onClick={handleRunFlash}
        disabled={!canFlash}
      >
        Install on keyboard
      </Button>
    </FABBox>
  );
};

export default KeyboardFAB;
