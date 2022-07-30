// import { AccessTime, Gif, Pets, ViewComfyRounded } from "@mui/icons-material";
import styled from "@emotion/styled";
import { Alert, Box, Switch, Typography, useTheme } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import MultiselectBooleanComponent from "../components/configurator/MultiselectBooleanComponent";
import { atyuValue } from "../functions/configurator";
import { AtyuChildConfig } from "../configs/atyuConfig";
import { useAtyuContext } from "../controllers/context/atyuContext";
import SwitchComponent from "../components/configurator/SwitchComponent";
import { exhaustSwitch } from "../functions/generic";
import UpdateGifComponent from "../components/configurator/UpdateGifComponent";
import RadioComponent from "../components/configurator/RadioComponent";
import { defaultGifRadioStruct } from "../constants";
import { useAppContext } from "../controllers/context/appContext";
import HorizontalBox from "../components/HorizontalBox";
import { grey } from "@mui/material/colors";
import { InfoOutlined } from "@mui/icons-material";

const OledModeBox = styled(Alert)`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  transition: all 0.5s;
`;

const OledModeHeader = styled.div`
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

const NotesTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    maxWidth: "800px",
		padding: "12px",
  },
}));

const getChildComponent = (childConfigSection: AtyuChildConfig, name: string, desc?: string) => {
  const struct = childConfigSection.struct;
  const type = struct.type;
  switch (type) {
    case "multiselect_boolean":
      return <MultiselectBooleanComponent config={struct} name={name} desc={desc} />;
    case "radio_number":
      return <RadioComponent config={struct} name={name} desc={desc} />;
    case "switch":
      return <SwitchComponent config={struct} name={name} desc={desc} />;
    case "update_gif":
      return (
        <Box>
          <UpdateGifComponent />
          <RadioComponent config={defaultGifRadioStruct} name="GIF speed" />
        </Box>
      );
    default:
      exhaustSwitch(type);
  }
};

// This is the UI generator entry point
const Configurator = () => {
  const { atyuConfigMap, keyboard } = useAppContext();
  const context = useAtyuContext();
  const theme = useTheme();
  const config = atyuConfigMap[keyboard];

  return (
    <Box>
      <Typography color="primary" variant="h5" sx={{ mb: "18px" }}>
        OLED Options
      </Typography>
      {!!config?.length &&
        config.map((configSection) => {
          const { name, desc, key, configurable, children, enabledByDefault, notes } =
            configSection;
          const isEnabled = atyuValue(context[key], enabledByDefault);

          return (
            <OledModeBox
              variant="outlined"
              severity="info"
              key={name}
              icon={false}
              sx={{ filter: isEnabled !== undefined && !isEnabled ? "grayscale(100%)" : "none" }}
            >
              <HorizontalBox expanded>
                <Box>
                  <OledModeHeader>
                    {/*TODO: {icon}*/}
                    <Typography variant="button">{name}</Typography>
                  </OledModeHeader>
                  {!!desc?.length && <Typography variant="body2">{desc}</Typography>}
                </Box>
                <HorizontalBox>
                  {!!notes?.length && (
                    <NotesTooltip
											placement="left-start"
                      title={
                        <Box>
                          {notes.map((note, i) => (
                            <div key={i}>
                              <Typography color={grey[300]} variant="caption" fontSize={13}>
                                • {note}
                              </Typography>
                            </div>
                          ))}
                        </Box>
                      }
                    >
                      <InfoOutlined sx={{ mr: 2 }} />
                    </NotesTooltip>
                  )}
                  {!!configurable && (
                    <Switch
                      checked={isEnabled}
                      onChange={() => context.dispatchUpdateValue(key, !isEnabled)}
                    />
                  )}
                </HorizontalBox>
              </HorizontalBox>
              {!!isEnabled && !!children.length && (
                <OledModeComponent color={theme.palette.primary.main}>
                  {children.map((childConfigSection, i) => {
                    const { name: childName, desc: childDesc } = childConfigSection;
                    return (
                      <Box sx={{ width: "100%" }} key={i}>
                        {getChildComponent(childConfigSection, childName, childDesc)}
                      </Box>
                    );
                  })}
                </OledModeComponent>
              )}
            </OledModeBox>
          );
        })}
      {/* <Button onClick={() => console.log(runCodegen(context))}>codegen test</Button> */}
    </Box>
  );
};

export default Configurator;
