import styled from "@emotion/styled";
import { Box, Checkbox, Typography } from "@mui/material";
import { atyuBooleanValue } from "../../functions/configuratorHelpers";
import { useAtyuContext } from "../../pages/configurator/context";
import { AtyuOptionMultiselectBoolean } from "../../types/atyuConfig";

type Props = {
  config: AtyuOptionMultiselectBoolean;
};

const CheckboxContainer = styled(Box)`
  width: 100%;
  max-height: 200px;
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const CheckboxBox = styled(Box)`
  margin-bottom: -8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 80%;
`;

//TODO: we can use a radio component if max is 1
const MultiselectBooleanComponent = (props: Props) => {
  const context = useAtyuContext();
  const { config } = props;
  const { multiselectStruct, multiselectOptions } = config;
  const enabledAggregate = multiselectStruct.reduce(
    (total, multiselectKey) => (!!context[multiselectKey.key] ? total + 1 : total),
    0
  );

  return (
    <Box>
      {multiselectOptions?.max != null && (
        <Typography component="span" variant="subtitle2" color="secondary">
          Choose up to {multiselectOptions?.max} {multiselectOptions?.max === 1 ? "option" : "options"}.&nbsp;
        </Typography>
      )}
      {multiselectOptions?.min != null && (
        <Typography component="span" variant="subtitle2" color="secondary">
          You must have at least {multiselectOptions?.min} {multiselectOptions?.min === 1 ? "option" : "options"} selected.
        </Typography>
      )}
      <CheckboxContainer>
        {multiselectStruct.map((multiselectKey, i) => {
          const { name, key, defaultValue } = multiselectKey;
          const isEnabled = atyuBooleanValue(context[key], defaultValue);
          return (
            <CheckboxBox key={key}>
              <Checkbox
                disabled={
                  // Disabled if not enough min or too much max
                  !!multiselectOptions &&
                  ((!isEnabled &&
                    multiselectOptions?.max != null &&
                    enabledAggregate >= multiselectOptions?.max) ||
                    (isEnabled &&
                      multiselectOptions?.min != null &&
                      enabledAggregate <= multiselectOptions?.min))
                }
                checked={isEnabled}
                onChange={() => context.dispatchToggleKey(key)}
              />
              <Typography>{name}</Typography>
            </CheckboxBox>
          );
        })}
      </CheckboxContainer>
    </Box>
  );
};

export default MultiselectBooleanComponent;
