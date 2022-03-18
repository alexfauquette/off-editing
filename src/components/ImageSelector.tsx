import * as React from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { getImageUrl } from "../off/request";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export interface ImageSelectorProps {
  isOpen: boolean;
  close: (e?: any) => void;
  imagesIds: string[];
  defaultId: string;
  selectImage: (newId: string) => void;
  code: string;
}

const ImageSelector = ({
  isOpen,
  close,
  imagesIds,
  defaultId,
  selectImage,
  code,
}: ImageSelectorProps) => {
  const [selectedId, setSelectedId] = React.useState(defaultId);
  React.useEffect(() => {
    setSelectedId((id) => {
      if (id === defaultId) {
        return id;
      }
      return defaultId;
    });
  }, [defaultId, setSelectedId]);

  return (
    <Dialog fullWidth maxWidth="xl" open={isOpen} onClose={close}>
      <DialogTitle>Select Packaging Image</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "48%", height: "80vh" }}>
          <ImageList cols={3}>
            {imagesIds.map((id) => (
              <ImageListItem
                key={id}
                onClick={() => setSelectedId(id)}
                sx={{
                  border: id === selectedId ? "solid blue 1rem" : "",
                }}
              >
                <img
                  style={{ objectFit: "contain" }}
                  src={getImageUrl(code, id, "400")}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
        <Box
          sx={{
            width: "48%",
            position: "sticky",
            top: 0,
          }}
        >
          <TransformWrapper>
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
              contentStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={getImageUrl(code, selectedId, "full")}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
              />
            </TransformComponent>
          </TransformWrapper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button
          onClick={() => {
            selectImage(selectedId);
            close();
          }}
        >
          Validate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageSelector;
