import * as React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import logo from "../logo.svg";

const ImageViewer = () => {
  const [imageType, setImageType] = React.useState("front");
  const [imageResolution, setImageResolution] = React.useState("full");

  const handleChangeImageType = (event) => {
    setImageType(event.target.value);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "start",
          mb: 1,
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 150, mr: 1 }}>
          <InputLabel id="image-type-label">Type</InputLabel>
          <Select
            labelId="image-type-label"
            id="image-type"
            value={imageType}
            label="Type"
            onChange={handleChangeImageType}
          >
            <MenuItem value="front">Front</MenuItem>
            <MenuItem value="ingredients">Ingredients</MenuItem>
            <MenuItem value="nutrition">Nutrition</MenuItem>
            <MenuItem value="recycling">Recycling</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="image-resolution-label">Resolution</InputLabel>
          <Select
            labelId="image-resolution-label"
            id="image-resolution"
            value={imageResolution}
            label="Resolution"
            onChange={handleChangeImageType}
          >
            <MenuItem value="400">400px</MenuItem>
            <MenuItem value="800">800px</MenuItem>
            <MenuItem value="full">Full</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className="NotDraggable" sx={{ display: "contents" }}>
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
              border: "10px solid red",
            }}
          >
            <img
              src={logo}
              alt="test"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "start",
          mt: 1,
          mb: 1,
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 150, mr: 1 }}>
          <InputLabel id="image-type-label">Type</InputLabel>
          <Select
            labelId="image-type-label"
            id="image-type"
            value={imageType}
            label="Type"
            onChange={handleChangeImageType}
          >
            <MenuItem value="front">Front</MenuItem>
            <MenuItem value="ingredients">Ingredients</MenuItem>
            <MenuItem value="nutrition">Nutrition</MenuItem>
            <MenuItem value="recycling">Recycling</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="image-resolution-label">Resolution</InputLabel>
          <Select
            labelId="image-resolution-label"
            id="image-resolution"
            value={imageResolution}
            label="Resolution"
            onChange={handleChangeImageType}
          >
            <MenuItem value="400">400px</MenuItem>
            <MenuItem value="800">800px</MenuItem>
            <MenuItem value="full">Full</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

const module = {
  component: ImageViewer,
  getError: () => [],
  sendData: () => null,
};

export default module;
