import React, { useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { StockDataProvider } from './context/StockDataContext';
import StockTable from './components/StockTable';
import StockModal from './components/StockModal';
import './styles/modal.css';

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);

  const openModal = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStockSymbol(null);
  };

  return (
    <StockDataProvider>
      <PortfolioProvider>
        <div className="app">
          <h1>Stock Portfolio</h1>
          <StockTable openModal={openModal} />
          
          {isModalOpen && selectedStockSymbol && (
            <StockModal
              symbol={selectedStockSymbol}
              closeModal={closeModal}
            />
          )}
        </div>
      </PortfolioProvider>
    </StockDataProvider>
  );
};

export default App;