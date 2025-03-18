import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Stock } from '../types/Stock';

interface PortfolioContextType {
  stocks: Stock[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  return (
    <PortfolioContext.Provider value={{ stocks }}>
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