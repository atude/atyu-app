import { Box, Typography } from "@mui/material";

type Props = {
  name: string;
  desc?: string;
};

const ConfiguratorSectionHeading = (props: Props) => {
  const { name, desc } = props;
  return (
    <Box>
      <Typography variant="subtitle1" fontSize={14}>
        {name}
      </Typography>
      {!!desc?.length && (
        <Typography sx={{ mb: "12px", fontWeight: 400 }} variant="subtitle2" color="secondary">
          {desc}
        </Typography>
      )}
    </Box>
  );
};

export default ConfiguratorSectionHeading;
