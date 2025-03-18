import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import stockStaticData from "../data/stocks.json";
import { Stock } from "../types/Stock";
import {
  getStockDailyChange,
  getStockPrice,
  getTop100Stocks,
} from "../api/polygonApi";

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
  const [stockData, setStockData] = useState<Stock[]>(stockStaticData);
  const [loading, setLoading] = useState(true);

  const mapStockData = (data: any): Stock => {
    return {
      symbol: data.ticker, // Using the "ticker" field as symbol
      currentPrice: 0, // Placeholder - fetch the current price separately
      dailyChange: 0, // Placeholder - calculate the daily change from price data
      quantityHeld: 0, // Placeholder - this would come from the user's portfolio
    };
  };

  const fetchStockData = async () => {
    try {
      const top100Stocks = await getTop100Stocks();
      if (top100Stocks && top100Stocks.results) {
        const stocksWithData = await Promise.all(
          top100Stocks.results.map(async (stock: any) => {
            const price = await getStockPrice(stock.ticker);
            const dailyChange = await getStockDailyChange(stock.ticker);

            return {
              ...mapStockData(stock),
              currentPrice: price,
              dailyChange: dailyChange,
            };
          }),
        );

        setStockData(stocksWithData);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  if (loading) {
    return <div>Loading stock data...</div>;
  }

  return (
    <StockDataContext.Provider value={{ stockData }}>
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
