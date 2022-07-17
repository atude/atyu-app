// import { AccessTime, Gif, Pets, ViewComfyRounded } from "@mui/icons-material";
import styled from "@emotion/styled";
import { Alert, Box, Button, Switch, Typography, useTheme } from "@mui/material";
import MultiselectBooleanComponent from "./configurator/MultiselectBooleanComponent";
import { atyuBooleanValue } from "../functions/configuratorHelpers";
import { AtyuChildConfig, AtyuConfig } from "../constants/types/atyuConfig";
import { runCodegen } from "../pages/codegen";
import { useAtyuContext } from "../controllers/context/atyuContext";
import { testConfig } from "../controllers/reducers/atyuReducer";
// import Satisfaction75GifTool from "./modes/Satisfaction75GifTool";

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

const OledModeComponent = styled.div`
  margin: 12px auto;
  padding: 14px 8px 0 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${(props) => props.color};
`;

const getChildComponent = (childConfigSection: AtyuChildConfig) => {
  switch (childConfigSection.struct.type) {
    case "multiselect_boolean":
      return <MultiselectBooleanComponent config={childConfigSection.struct} />;
    case "multiselect_number":
      return <></>;
  }
};

// This is the UI generator
const Configurator = () => {
  const context = useAtyuContext();
  const theme = useTheme();
  // TODO: here we want to read the config to create the UI components.
  // can split it up so its easy to create here or something like that
  // oleed modes replaced with something else

  const config: AtyuConfig[] = testConfig;

  return (
    <Box>
      <Typography color="primary" variant="h5" sx={{ mb: "18px" }}>
        Configure OLED modes
      </Typography>
      {config.map((configSection: AtyuConfig) => {
        const { name, desc, key, configurable, children, enabledByDefault } =
          configSection;
        const { dispatchToggleKey } = context;
        const isEnabled = atyuBooleanValue(context[key], enabledByDefault);

        return (
          <OledModeBox
            variant="outlined"
            severity="info"
            key={name}
            icon={false}
            sx={{ filter: isEnabled !== undefined && !isEnabled ? "grayscale(100%)" : "none" }}
          >
            <OledModeHeader>
              <OledModeHeaderText>
                {/*{icon}*/}&nbsp;&nbsp;<Typography variant="button">{name}</Typography>
              </OledModeHeaderText>
              {!!configurable && (
                <Switch checked={isEnabled} onChange={() => dispatchToggleKey(key)} />
              )}
            </OledModeHeader>
            {!!isEnabled && !!children.length && (
              <OledModeComponent color={theme.palette.primary.main}>
                {children.map((childConfigSection, i) => {
									const { name: childName, desc: childDesc } = childConfigSection;
									return (
										<Box sx={{ width: "100%" }} key={i}>
											<Typography variant="subtitle1">{childName}</Typography>
											{!!childDesc.length && (
												<Typography sx={{ mb: "12px" }} variant="subtitle2" color={theme.palette.info.main}>{childDesc}</Typography>
											)}
											{getChildComponent(childConfigSection)}
										</Box>
									)
								})}
              </OledModeComponent>
            )}
          </OledModeBox>
        );
      })}
      <Button onClick={() => console.log(runCodegen(context))}>codegen test</Button>
    </Box>
  );
};

export default Configurator;
