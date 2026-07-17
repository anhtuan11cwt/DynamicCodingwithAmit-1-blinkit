import { createContext, useContext } from "react";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      "useGlobalContext phải được sử dụng trong một GlobalProvider",
    );
  }

  return context;
};
