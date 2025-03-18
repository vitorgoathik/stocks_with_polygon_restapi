import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useStockData } from './StockDataContext';
import { Stock } from '../types/Stock';

interface PortfolioContextType {
  portfolio: Stock[];
  addStock: (symbol: string, quantity: number) => void;
  updateStockQuantity: (symbol: string, quantity: number) => void;
  removeStock: (symbol: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const { stockData } = useStockData();
  const [portfolio, setPortfolio] = useState<Stock[]>(stockData);

  const addStock = (symbol: string, quantity: number) => {
    const stock = stockData.find((stock) => stock.symbol === symbol);
    if (stock) {
      setPortfolio((prevPortfolio) => [
        ...prevPortfolio,
        { ...stock, quantityHeld: quantity },
      ]);
    }
  };

  const updateStockQuantity = (symbol: string, quantity: number) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.map((stock) =>
        stock.symbol === symbol
          ? {
              ...stock,
              quantityHeld: stock.quantityHeld + quantity >= 0
                ? stock.quantityHeld + quantity
                : stock.quantityHeld,
            }
          : stock
      )
    );
  };

  const removeStock = (symbol: string) => {
    setPortfolio((prevPortfolio) => prevPortfolio.filter((stock) => stock.symbol !== symbol));
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, addStock, updateStockQuantity, removeStock }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};