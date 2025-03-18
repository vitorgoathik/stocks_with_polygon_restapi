import React, { createContext, useState, ReactNode, useContext } from "react";
import stockData from "../data/stocks.json";
import { Stock } from "../types/Stock";

interface StockDataContextType {
  stockData: Stock[];
}

const StockDataContext = createContext<StockDataContextType | undefined>(
  undefined,
);

interface StockDataProviderProps {
  children: ReactNode;
}

export const StockDataProvider: React.FC<StockDataProviderProps> = ({
  children,
}) => {
  const [stockDataStaticList] = useState<Stock[]>(stockData);

  return (
    <StockDataContext.Provider value={{ stockData: stockDataStaticList }}>
      {children}
    </StockDataContext.Provider>
  );
};

export const useStockData = (): StockDataContextType => {
  const context = useContext(StockDataContext);
  if (!context) {
    throw new Error("useStockData must be used within a StockDataProvider");
  }
  return context;
};
