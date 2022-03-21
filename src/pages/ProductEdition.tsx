import * as React from "react";
import {
  fetchNewCodes,
  fetchOffProductData,
  removeCode,
} from "../redux/offData";
import {
  cleanData,
  removeMessage,
  validateData,
  Message,
  updateInterface,
  LayoutObject,
} from "../redux/editorData";
import { getProductUrl, getProductEditUrl } from "../off/request";

import { RootState, AppDispatch } from "../redux/store";
import { useParams, Link as RouterLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import GridLayout, { WidthProvider } from "react-grid-layout";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'

import AssistantPhotoRoundedIcon from "@mui/icons-material/AssistantPhotoRounded";

import components from "../components";
import { TextField } from "@mui/material";
import axios from "axios";

const possibleIssues = ["Pas de bonne image", "N'a rien à faire sur OFF"];
const ProblemDialogue = ({ open, close, skip, sendFlag }) => {
  const [otherLabel, setOtherLabel] = React.useState("");

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={close}>
      <DialogTitle>What is your problem</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            m: "auto",
            width: "fit-content",
          }}
        >
          {possibleIssues.map((label) => (
            <Button
              sx={{
                mb: 1,
              }}
              variant="outlined"
              key={label}
              onClick={() => {
                sendFlag(label);
                close();
                skip();
              }}
            >
              {label}
            </Button>
          ))}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <TextField
              label="Autre..."
              value={otherLabel}
              onChange={(event) => {
                setOtherLabel(event.target.value);
              }}
            />

            <Button
              disabled={!otherLabel}
              onClick={() => {
                sendFlag(otherLabel);
                close();
                skip();
              }}
            >
              Envoyer
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            close();
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ResponsiveGridLayout = WidthProvider(GridLayout);

interface ProductEditionParams {
  campagne?: string;
  state?: number;
}

const ProductEdition = (props) => {
  const { campagne, state }: ProductEditionParams = useParams();

  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(updateInterface({ campagne, processSate: state }));
  }, [campagne, dispatch, state]);

  const layout = useSelector<RootState>(
    (state) => state.editorData.interface?.layout || []
  ) as LayoutObject[];

  const codes = useSelector<RootState>(
    (state) => state.offData.codes
  ) as string[];
  const currentData = useSelector<RootState>((state) => {
    if (state.offData.codes.length < 1) {
      return null;
    }
    return state.offData.data[state.offData.codes[0]];
  }) as any;

  const dataToFetch = React.useMemo(
    () =>
      layout.flatMap(
        ({ componentName }) => components[componentName].data_needed
      ),
    [layout]
  );
  const codesToFetch = useSelector<RootState>((state) => {
    if (state.offData.codes.length < 1) {
      return [];
    }
    const lastIndex = Math.min(5, state.offData.codes.length);
    return state.offData.codes
      .slice(0, lastIndex)
      .filter((code) => state.offData.data[code] === undefined);
  }) as string[];

  React.useEffect(() => {
    codesToFetch.forEach((code: string) => {
      if (dataToFetch) {
        const setOfkeysToFetch = new Set(dataToFetch);

        dispatch(
          fetchOffProductData({
            code,
            requestedFields: ["product_name", ...Array.from(setOfkeysToFetch)],
          })
        );
      }
    });
  }, [dispatch, codesToFetch, dataToFetch]);

  React.useEffect(() => {
    if (codes.length < 10) {
      dispatch(fetchNewCodes({ campagne, state }));
    }
  }, [dispatch, codes.length, campagne, state]);

  const skip = () => {
    dispatch(removeCode());
    dispatch(cleanData());
  };
  const validate = () => {
    dispatch(validateData());
    // skip()
  };
  const handleCloseMessage = (id) => {
    dispatch(removeMessage({ id }));
  };

  const [assistantIsOpen, setAssistantIsOpen] = React.useState(false);
  const handleOpenAssistant = React.useCallback(
    () => setAssistantIsOpen(true),
    [setAssistantIsOpen]
  );
  const handleCloseAssistant = React.useCallback(
    () => setAssistantIsOpen(false),
    [setAssistantIsOpen]
  );

  const code = codes?.[0];
  const sendFlag = React.useCallback(
    (label) => {
      if (!campagne || !code) {
        return;
      }
      axios.post(
        `https://amathjourney.com/api/off-annotation/${campagne}/${code}`,
        {
          data: { label },
          flag: true,
          newState: state,
        }
      );
    },
    [code, campagne, state]
  );

  const editorState = useSelector<RootState>((state) => state?.editorData.data);
  const offState = useSelector<RootState>(
    (state) => state?.offData?.data?.[code]
  );
  const messagesState = useSelector<RootState>(
    (state) => state.editorData.messages
  );

  const subState = { ...(offState as object) };
  if ((offState as any)?.images) {
    // @ts-ignore
    subState.images = subState.images?.packaging_fr?.imgid;
  }
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <ProblemDialogue
        open={assistantIsOpen}
        close={handleCloseAssistant}
        skip={skip}
        sendFlag={sendFlag}
      />
      {(messagesState as Message[]).map(({ id, status, message }) => (
        <Snackbar
          key={id}
          open
          autoHideDuration={2000}
          onClose={() => handleCloseMessage(id)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert severity={status} sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      ))}

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
              <Typography color="text.primary">Step {state}</Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ m: "1rem" }}>
            {code && (
              <>
                <Link
                  target="_blank"
                  href={getProductUrl(code)}
                  underline="none"
                  sx={{ mr: "1rem" }}
                >
                  See
                </Link>
                <Link
                  target="_blank"
                  href={getProductEditUrl(code)}
                  underline="none"
                >
                  Edit
                </Link>
              </>
            )}
          </Box>
        </Box>
        {process.env.NODE_ENV === "development" && (
          <Paper>
            <pre>{JSON.stringify(subState, null, 2)}</pre>
            <pre>{JSON.stringify(editorState, null, 2)}</pre>
          </Paper>
        )}
      </Paper>
      <Box sx={{ px: 2, py: 1 }}>
        {currentData ? (
          <ResponsiveGridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={100}
            draggableCancel=".NotDraggable"
            onResize={() => window.dispatchEvent(new Event("resize"))}
            onResizeStop={() => window.dispatchEvent(new Event("resize"))}
          >
            {layout.map(({ i, id, ...other }) => (
              <Box key={i}>
                <Paper sx={{ width: "100%", height: "100%" }}>
                  <DragIndicatorIcon
                    sx={{ position: "fixed", top: 1, right: 1, cursor: "grab" }}
                  />
                  {React.createElement(
                    components[other.componentName].component,
                    { id }
                  )}
                </Paper>
              </Box>
            ))}
          </ResponsiveGridLayout>
        ) : null}
      </Box>
      <Paper sx={{ position: "sticky", bottom: 0, zIndex: 1 }}>
        <Box
          sx={{
            height: "2rem",
            p: 1,
            justifyContent: "end",
            display: "flex",
            position: "sticky",
            bottom: 0,
          }}
        >
          <Button
            onClick={handleOpenAssistant}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            I have a Problem <AssistantPhotoRoundedIcon />
          </Button>
          <Button onClick={skip} variant="outlined" sx={{ mr: 1 }}>
            Skip
          </Button>
          <Button onClick={validate} variant="outlined" sx={{ mr: 1 }}>
            Validate
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default ProductEdition;
