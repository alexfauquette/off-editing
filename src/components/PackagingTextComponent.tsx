import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, TextField } from "@mui/material";
import { RootState, AppDispatch } from "../redux/store";

import { useDispatch, useSelector } from "react-redux";
import { upsertData } from "../redux/editorData/editorDataSlice";
import { ErrorInterface } from "./models";

export const data_needed = ["packaging"];

interface ComponentProps {
  id: string;
}

export const PackagingTextComponent = (props: ComponentProps) => {
  const { id: componentId } = props;

  const dispatch = useDispatch<AppDispatch>();

  const productData = useSelector<RootState>((state) => {
    if (state.offData.codes.length < 1) {
      return null;
    }
    return state.offData.data[state.offData.codes[0]];
  }) as any;

  const productDataIsLoading = !productData || productData.isLoading;

  const offPackagingData = productData?.packaging;

  const setEditorPackaging = React.useCallback(
    (newPackaging) => {
      dispatch(
        upsertData({ editorId: componentId, data: { text: newPackaging } })
      );
    },
    [componentId, dispatch]
  );

  React.useEffect(() => {
    setEditorPackaging(offPackagingData);
  }, [offPackagingData, setEditorPackaging]);

  const currentData = useSelector<RootState>(
    (state) => (state.editorData.data[componentId] as any)?.text
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "2rem", width: "100%" }}></div>
      <div
        style={{ height: "max-content", width: "100%" }}
        className="NotDraggable"
      >
        {productDataIsLoading ? (
          <CircularProgress />
        ) : (
          <TextField
            multiline
            fullWidth
            label="packaging"
            minRows={3}
            value={currentData}
            onChange={(event) => setEditorPackaging(event.target.value)}
          />
        )}
      </div>
      <div style={{ height: "3rem" }}>
        <Button
          onClick={() => {
            setEditorPackaging(offPackagingData);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export const getError = ({ productData, state: { text } }) => {
  if (!text || !text.trim()) {
    return { message: "Le packaging est vide", severity: "error" } as ErrorInterface
  }
};
export const sendData = ({ productData, state: { text } }) => {

  const code = productData.code;

  console.log(`Set "${text}" as packaging of ${code}`)
};

const module = {
  component: PackagingTextComponent,
  getError,
  sendData,
  data_needed,
};

export default module;
