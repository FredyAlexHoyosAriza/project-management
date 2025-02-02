import React from "react";
import ReactLoading from "react-loading";
import type { LoadingType } from "react-loading";

interface LoadingProps {
  type?: LoadingType; // Define the available loading types from react-loading
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ type = "spin", color = "#ffffff" }) => {
  return (
    <ReactLoading 
      type={type as LoadingType} 
      color={color} 
      height="20%" 
      width="20%" 
    />
  );
};

export default Loading;
