import styled from "@emotion/styled";
import { Download } from "@mui/icons-material";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useContext } from "react";
import { keyboardsArray } from "../configs/keyboards";
import { FlashState } from "../consts";
import { AppContext } from "../context";
import { runFlash } from "../functions/flash";

const FABBox = styled(Box)`
	position: fixed;
	bottom: 0;
	right: 0;
	margin: 20px;
	display: flex;
	flex-direction: row;
`;

const KeyboardFAB = () => {
	const { keyboard, setKeyboard, flashState, setFlashState, setFlashProgress } = useContext(AppContext);
	const handleChange = (event: SelectChangeEvent<string>) => {
		setKeyboard(event.target.value);
	};

	const handleRunFlash = () => {
		runFlash(keyboard, setFlashState, setFlashProgress);
	};
	
	return (
		<FABBox>
			<FormControl>
				<InputLabel>Keyboard</InputLabel>
				<Select
					value={keyboard}
					label="Keyboard"
					onChange={(e) => handleChange(e)}
				>
					{keyboardsArray.map((keyboard) => (
						<MenuItem 
							key={keyboard.key}
							value={keyboard.key} 
							id={keyboard.key}
						>
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
				disabled={!(flashState === FlashState.DONE || flashState === FlashState.IDLE)}
			>
				Install on keyboard
			</Button>
		</FABBox>
	)
};

export default KeyboardFAB;