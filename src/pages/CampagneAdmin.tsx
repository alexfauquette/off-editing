import * as React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import RestoreFromTrashSharpIcon from "@mui/icons-material/RestoreFromTrashSharp";

import axios from "axios";

import {
  DataGrid,
  GridColumns,
  GridRowParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { updateInterface } from "../redux/editorData";
import { getProductEditUrl, getProductUrl } from "../off/request";

const fetchData = (campagne: string, flag: boolean, state: number) =>
  axios.get(
    `https://amathjourney.com/api/off-annotation/data/${campagne}?flag=${flag}&state=${state}`
  );

const useDataFetching = (campagne: string, flag: boolean, state: number) => {
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [index, setIndex] = React.useState(0);

  const refresh = React.useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  React.useEffect(() => {
    let setData = true;
    setLoading(true);
    fetchData(campagne, flag, state).then((result) => {
      if (setData) {
        setRows(result.data.result.map((x) => ({ ...x, id: x.code })));
        setLoading(false);
      }
    });
    return () => {
      setData = false;
    };
  }, [campagne, flag, state, index]);

  return { loading, rows, refresh };
};

interface CampagneAdminProps {
  campagne?: string;
}

const CampagneAdmin = (props) => {
  const { campagne }: CampagneAdminProps = useParams();

  // Get campagne overview
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(updateInterface({ campagne, processSate: 0 }));
  }, [campagne, dispatch]);

  const campagneStates = useSelector<RootState>(
    (state) => state.editorData.fetchedInterfaces?.[campagne] || {}
  );

  // data parameters
  const [step, setStep] = React.useState(0);
  const [flag, setFlag] = React.useState(false);

  const handleStepChange = (event) => {
    setStep(event.target.value);
  };
  const handleFlagChange = (event) => {
    setFlag(event.target.checked);
  };

  const removeFlag = React.useCallback(
    (row) => {
      console.log(row);
      if (!campagne || !row.code || row.state === undefined) {
        return;
      }
      axios.post(
        `https://amathjourney.com/api/off-annotation/${campagne}/${row.code}`,
        {
          ...row,
          flag: false,
          newState: row.state,
        }
      );
    },
    [campagne]
  );

  const { loading, rows, refresh } = useDataFetching(campagne, flag, step);

  const columns: GridColumns = React.useMemo(
    () => [
      { field: "code", width: 200 },
      { field: "campagne", width: 200 },
      { field: "note", valueGetter: ({ row }) => row?.data?.label, flex: 1 },
      {
        field: "actions",
        type: "actions",
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="See product page">
                <VisibilityRoundedIcon />
              </Tooltip>
            }
            label="See product page"
            onClick={() =>
              window.open(getProductUrl(params.row.code), "_blank")
            }
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title="Edit product page">
                <EditRoundedIcon />
              </Tooltip>
            }
            label="Edit product page"
            onClick={() =>
              window.open(getProductEditUrl(params.row.code), "_blank")
            }
          />,
          ...(params.row.flag
            ? [
                <GridActionsCellItem
                  icon={
                    <Tooltip title="Remove Flag">
                      <RestoreFromTrashSharpIcon />
                    </Tooltip>
                  }
                  label="Remove Flag"
                  onClick={async () => {
                    await removeFlag(params.row);
                    refresh();
                  }}
                />,
              ]
            : []),
        ],
        width: 200,
      },
    ],
    [removeFlag, campagne]
  );

  return (
    <Box>
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
              <Link
                component={RouterLink}
                underline="hover"
                color="inherit"
                to="/"
              >
                Campagnes
              </Link>
              <Link
                component={RouterLink}
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
      <Box sx={{ m: 2 }}>
        <FormControl>
          <InputLabel id="step-select-label">Step</InputLabel>
          <Select
            labelId="step-select-label"
            id="step-select"
            value={step}
            label="Step"
            onChange={handleStepChange}
          >
            {" "}
            {campagneStates &&
              Object.keys(campagneStates)
                .map((state) => parseInt(state))
                .sort()
                .map((state) => (
                  <MenuItem value={state} key={state}>
                    step {state}
                  </MenuItem>
                ))}
            <MenuItem value={Object.keys(campagneStates).length}>
              step {Object.keys(campagneStates).length}
            </MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          sx={{ ml: 2 }}
          control={<Checkbox value={flag} onChange={handleFlagChange} />}
          labelPlacement="start"
          label="Item with problem"
        />
      </Box>
      <Box sx={{ height: "500px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Box>
    </Box>
  );
};

export default CampagneAdmin;
