import * as React from "react";
import GridLayout, { WidthProvider, Layout } from "react-grid-layout";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import components from "../components";

import axios from "axios";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const saveCampagne = ({ campagneRef, campagneTitle, states }) => {
  console.log(campagneRef.current);
  states.forEach((index) => {
    const {
      title: stepTitle,
      description: stepDescritpion,
      layout,
    } = campagneRef.current[index];

    const body = {
      state: index,
      title: stepTitle,
      description: stepDescritpion,
      layout: layout.map((item) => {
        Object.keys(item).forEach((key) => {
          if (!["h", "i", "w", "x", "y"].includes(key)) {
            delete item[key];
          }
        });

        return {
          ...item,
          componentName: item.i,
          id: item.i,
        };
      }),
    };
    if (campagneTitle) {
      axios.put(
        `https://amathjourney.com/api/off-annotation/admin/${campagneTitle}`,
        { ...body, layout: JSON.stringify(body.layout) }
      );
    }
  });
};

const CampagneStep = ({ updateRef }) => {
  const [layout, setLayout] = React.useState<any[]>([]);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    updateRef({
      layout,
      title,
      description,
    });
  }, [layout, title, description]);
  return (
    <Paper sx={{ mt: 3, py: 2, mx: 1 }} elevation={1}>
      <TextField
        label="Titre de l'étape"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <TextField
        label="description de l'étape"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", maxWidth: "100%", overflow: "auto" }}>
          {Object.keys(components).map((key) => (
            <FormControlLabel
              label={key}
              key={key}
              control={
                <Checkbox
                  onChange={(event) => {
                    if (event.target.checked) {
                      setLayout((l) => [
                        ...l,
                        { i: key, x: 0, y: 0, w: 3, h: 3 },
                      ]);
                    } else {
                      setLayout((l) => [...l.filter(({ i }) => i !== key)]);
                    }
                  }}
                />
              }
            />
          ))}
        </Box>
        <Paper elevation={3} sx={{ minHeight: "200px", mt: 1 }}>
          <ResponsiveGridLayout
            className="layout"
            layout={layout}
            onLayoutChange={(layout: Layout[]) => {
              setLayout(layout);
            }}
            cols={12}
            rowHeight={100}
          >
            {layout.map(({ i }) => (
              <Box key={i}>
                <Paper elevation={3} sx={{ width: "100%", height: "100%" }}>
                  {i}
                </Paper>
              </Box>
            ))}
          </ResponsiveGridLayout>
        </Paper>
      </Box>
    </Paper>
  );
};

export default function CampagneCreation() {
  const [campagneTitle, setCampagneTitle] = React.useState("");
  const [states, setStates] = React.useState([0]);

  const campagneRef = React.useRef({});

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        sx={{ m: 2, width: "auto" }}
        label="Titre de la campagne"
        fullWidth
        value={campagneTitle}
        onChange={(event) => setCampagneTitle(event.target.value)}
      />

      {states.map((key) => {
        if (campagneRef.current[key] === undefined) {
          campagneRef.current[key] = {};
        }
        return (
          <CampagneStep
            key={key}
            updateRef={(x) => (campagneRef.current[key] = x)}
          />
        );
      })}

      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <Button
          variant="outlined"
          size="large"
          disabled={states.length <= 1}
          onClick={() => {
            setStates((s) => s.slice(0, s.length - 1));
          }}
          sx={{ mr: 2 }}
        >
          Remove
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            setStates((s) => [...s, s.length]);
          }}
        >
          Add
        </Button>
      </Box>
      <Button
        onClick={() => {
          saveCampagne({ campagneRef, campagneTitle, states });
        }}
      >
        Save
      </Button>
    </Box>
  );
}
