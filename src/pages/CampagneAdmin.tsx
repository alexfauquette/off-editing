import * as React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

interface CampagneAdminProps {
  campagne?: string;
}

const CampagneAdmin = (props) => {
  const { campagne }: CampagneAdminProps = useParams();

  return <Box>
    <Paper sx={{ minHeight: "4rem", position: "sticky", top: 0, zIndex: 1 }}>
      <Box
        sx={{
          height: "2rem",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ m: "1rem" }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} underline="hover" color="inherit" to="/">
              Campagnes
            </Link>
            <Link component={RouterLink}
              underline="hover"
              color="inherit"
              to={`/${campagne}`}
            >
              {campagne}
            </Link>
            <Typography color="text.primary">Admin</Typography>
          </Breadcrumbs>
        </Box>
      </Box>
    </Paper>
  </Box>;
};

export default CampagneAdmin;
