import styled from "@emotion/styled";
import { Box, Switch } from "@mui/material";
import { atyuValue } from "../../functions/configurator";
import { useAtyuContext } from "../../controllers/context/atyuContext";
import { AtyuOptionSwitch } from "../../configs/atyuConfig";
import ConfiguratorSectionHeading from "./subcomponents/ConfiguratorSectionHeading";

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
			<ConfiguratorSectionHeading name={name} desc={desc} />
			<Switch 
				checked={isEnabled}
				onChange={() => context.dispatchUpdateValue(key, !isEnabled)}
			/>
		</SwitchContainer>
  );
};

export default SwitchComponent;
