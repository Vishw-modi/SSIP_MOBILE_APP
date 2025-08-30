import { createContext, useContext, useState } from "react";
import { AnalysisResult } from "../../app/(auth)/symptoscan/Step4";

type ResultContextType = {
  result: AnalysisResult;
  setResult: React.Dispatch<React.SetStateAction<any>>;
};

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider = ({ children }: { children: React.ReactNode }) => {
  const [result, setResult] = useState<any>(null);

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
};
