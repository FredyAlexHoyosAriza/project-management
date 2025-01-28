import React from "react";
import ReactLoading, { LoadingType } from "react-loading";

interface LoadingProps {
  type?: LoadingType; // Define the available loading types from react-loading
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ type = "spin", color = "#ffffff" }) => {
  return (
    <ReactLoading 
      type={type} 
      color={color} 
      height="20%" 
      width="20%" 
    />
  );
};

export default Loading;
