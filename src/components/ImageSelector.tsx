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
  ImageListItemBar,
} from "@mui/material";
import { getImageUrl } from "../off/request";
import { format } from "date-fns";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export interface ImageSelectorProps {
  imageType: string;
  isOpen: boolean;
  close: (e?: any) => void;
  imagesIds: { id: string; uploaded_t: number; uploader: string }[];
  defaultId: string;
  selectImage: (newId: string) => void;
  code: string;
}

const ImageSelector = ({
  imageType,
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
      <DialogTitle>Select {imageType} image</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "33%", height: "80vh", maxHeight: "500px" }}>
          <ImageList cols={1}>
            {imagesIds
              .filter(({ uploaded_t }) => !!uploaded_t)
              .map(({ id, uploaded_t, uploader }) => (
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
                  <ImageListItemBar
                    title={format(new Date(uploaded_t * 1000), "MM/dd/yyyy")}
                    subtitle={uploader}
                  />
                </ImageListItem>
              ))}
          </ImageList>
        </Box>
        <Box
          sx={{
            width: "60%",
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
                src={
                  getImageUrl(code, selectedId, "full") ||
                  `${process.env.PUBLIC_URL}/assets/not_selected.png`
                }
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = `${process.env.PUBLIC_URL}/assets/404.png`;
                }}
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
