import styled from "@emotion/styled";
import { Alert, Box, Switch, Typography } from "@mui/material";
import { OledMode } from "../consts";

type OledModeContainerProps = {
	oledModes: OledMode[];
};

const OledModeBox = styled(Alert)`
	display: flex;
	flex-direction: column;
	margin-bottom: 12px;
	transition: all 0.5s;
`;

const OledModeHeader = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const OledModeHeaderText = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const OledModeContainer = (props: OledModeContainerProps) => {
	const { oledModes } = props;
	return (
		<Box>
			<Typography color="primary" variant="h5" sx={{ mb: "12px" }}>OLED modes</Typography>
				{oledModes.map((oledMode) => {
					const { name, icon, toggleEnabled, isEnabled } = oledMode; 
					return (
						<OledModeBox 
							variant="outlined" 
							severity="info" 
							key={name} 
							icon={false}
							sx={{ filter: (isEnabled !== undefined && !isEnabled) ? "grayscale(100%)" : "none"}}
						>
							<OledModeHeader>
								<OledModeHeaderText>
									{icon}&nbsp;&nbsp;{name}
								</OledModeHeaderText>
								{!!toggleEnabled && 
									<Switch checked={isEnabled} onChange={toggleEnabled} />
								}
							</OledModeHeader>
						</OledModeBox>
					);
				})}
		</Box>
	);
};

export default OledModeContainer;