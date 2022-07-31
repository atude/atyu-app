import styled from "@emotion/styled";
import { Button, ButtonGroup } from "@mui/material";
import { atyuValue } from "../../functions/configurator";
import { useAtyuContext } from "../../controllers/context/atyuContext";
import { AtyuOptionRadioNumber } from "../../configs/atyuConfig";
import HorizontalBox from "../HorizontalBox";
import ConfiguratorSectionHeading from "./subcomponents/ConfiguratorSectionHeading";

type Props = {
  config: AtyuOptionRadioNumber;
	name: string;
	desc?: string;
};

const ButtonGroupContainer = styled(ButtonGroup)`
`;

const ButtonOption = styled(Button)`
	width: 90px;
`;

const RadioComponent = (props: Props) => {
  const context = useAtyuContext();
  const { name, desc, config } = props;
  const { radioKey, radioValues, defaultValue } = config;
	const value = atyuValue(context[radioKey], defaultValue);

  return (
    <HorizontalBox expanded>
			<ConfiguratorSectionHeading name={name} desc={desc} />
      <ButtonGroupContainer disableElevation>
        {radioValues.map((radioValue) => {
          const { name, value: thisValue } = radioValue;
          return (
            <ButtonOption 
							variant={thisValue === value ? "contained" : "outlined"}
							onClick={() => context.dispatchUpdateValue(radioKey, thisValue)}
							key={name}
						>
              {name}
            </ButtonOption>
          );
        })}
      </ButtonGroupContainer>
    </HorizontalBox>
  );
};

export default RadioComponent;
