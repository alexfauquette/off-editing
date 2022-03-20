import * as React from "react";
import { useParams } from "react-router-dom";

interface CampagneAdminProps {
  campagne?: string;
}

const CampagneAdmin = (props) => {
  const { campagne }: CampagneAdminProps = useParams();

  return <p>campagne: {campagne}</p>;
};

export default CampagneAdmin;
