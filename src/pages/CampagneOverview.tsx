import * as React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";

import StepCard from "../components/StepCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { updateInterface } from "../redux/editorData";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

interface CampagneAdminProps {
  campagne?: string;
}

const CampagneOverview = (props) => {
  const { campagne }: CampagneAdminProps = useParams();
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(updateInterface({ campagne, processSate: 0 }));
  }, [campagne, dispatch]);

  const campagneStates = useSelector<RootState>(
    (state) => state.editorData.fetchedInterfaces?.[campagne]
  );

  const [productQuantities, setProductQuantities] = React.useState({});

  React.useEffect(() => {
    let setData = true;
    setProductQuantities({});
    const fetData = async () => {
      const response = await fetch(
        `https://amathjourney.com/api/off-annotation/overview/${campagne}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (setData) {
        const formatedCounts = {};
        data.result.forEach(({ state, flag, count }) => {
          formatedCounts[state] = { ...formatedCounts[state], [flag]: count };
        });
        setProductQuantities(formatedCounts);
      }
    };
    fetData();
    return () => {
      setData = false;
    };
  }, [campagne]);

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Campagnes
        </Link>
        <Typography color="text.primary">{campagne}</Typography>
      </Breadcrumbs>
      <div>
        {campagneStates &&
          Object.keys(campagneStates)
            .map((state) => parseInt(state))
            .sort()
            .map((state) => {
              const { title, description } = campagneStates[state];
              const waiting = productQuantities?.[state]?.["false"] || 0;
              const flagged = productQuantities?.[state]?.["true"] || 0;

              return (
                <StepCard
                  key={`${campagne}-${state}`}
                  title={title}
                  description={description}
                  campagne={campagne}
                  step={state}
                  todo={waiting}
                  flagged={flagged}
                />
              );
            })}
      </div>
    </div>
  );
};

export default CampagneOverview;
