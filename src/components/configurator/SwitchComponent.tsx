import styled from "@emotion/styled";
import { Box, Switch, Typography } from "@mui/material";
import { atyuValue } from "../../functions/configurator";
import { useAtyuContext } from "../../controllers/context/atyuContext";
import { AtyuOptionSwitch } from "../../configs/atyuConfig";

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
	const isEnabled = atyuValue(context[key], defaultValue);

  return (
		<SwitchContainer>
			<Box>
				<Typography variant="subtitle1" fontSize={14}>{name}</Typography>
				{!!desc?.length && (
					<Typography variant="subtitle2" color="secondary">{desc}</Typography>
				)}
			</Box>
			<Switch 
				checked={isEnabled}
				onChange={() => context.dispatchUpdateValue(key, !isEnabled)}
			/>
		</SwitchContainer>
  );
};

export default SwitchComponent;
