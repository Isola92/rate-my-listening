import React from "react";
import { useRecoilValue } from "recoil";
import averageRating from "./selector/averageRating";

export const Result = () => {
  const average = useRecoilValue(averageRating);
  return <h1>Average: {average}</h1>;
};
