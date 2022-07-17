import styled from "@emotion/styled";
import { Box, Switch, Typography } from "@mui/material";
import { atyuBooleanValue } from "../../functions/configuratorHelpers";
import { useAtyuContext } from "../../controllers/context/atyuContext";
import { AtyuOptionSwitch } from "../../constants/types/atyuConfig";

type Props = {
  config: AtyuOptionSwitch;
	name: string;
	desc?: string;
};

const SwitchContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const SwitchComponent = (props: Props) => {
  const context = useAtyuContext();
  const { name, desc, config } = props;
  const { key, defaultValue } = config;
	const isEnabled = atyuBooleanValue(context[key], defaultValue);

  return (
		<SwitchContainer>
			<Box>
				<Typography variant="subtitle1">{name}</Typography>
				{!!desc?.length && (
					<Typography variant="subtitle2" color="secondary">{desc}</Typography>
				)}
			</Box>
			<Switch 
				checked={isEnabled}
				onChange={() => context.dispatchToggleKey(key)}
			/>
		</SwitchContainer>
  );
};

export default SwitchComponent;
