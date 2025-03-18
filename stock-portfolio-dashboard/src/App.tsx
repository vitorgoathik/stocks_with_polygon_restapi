import React, { useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import StockTable from './components/StockTable';
import StockModal from './components/StockModal';

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <PortfolioProvider>
      <div className="app">
        <h1>Stock Portfolio</h1>
        <button onClick={openModal}>Buy/Sell Stock</button>
        <StockTable />
        {isModalOpen && <StockModal closeModal={closeModal} />}
      </div>
    </PortfolioProvider>
  );
};

export default App;