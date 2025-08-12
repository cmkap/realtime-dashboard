import { useContext } from "react";
import { DataContext, DataContextType } from "../context/DataContext";

export const useData = (): DataContextType => {
  return useContext(DataContext);
};
