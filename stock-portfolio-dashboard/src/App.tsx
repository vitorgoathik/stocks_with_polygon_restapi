import React, { useState } from "react";
import { StockDataProvider } from "./context/StockDataContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import StockTable from "./components/StockTable";
import StockModal from "./components/StockModal";
import "./styles/modal.css";
import "./styles/table.css";
import "./styles/app.css";

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  const openModalWithSymbolInput = () => {
    setModalOpen(true);
  };

  const openModalWithSelectedSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSymbol("");
    setModalOpen(false);
  };

  return (
    <StockDataProvider>
      <PortfolioProvider>
        <div className="app">
          <h1>Stock Portfolio</h1>
          <button
            className="update-stock-button"
            onClick={openModalWithSymbolInput}
          >
            Update Stock Quantity
          </button>
          <StockTable openModal={openModalWithSelectedSymbol} />

          {isModalOpen && (
            <StockModal
              closeModal={closeModal}
              selectedSymbol={selectedSymbol}
            />
          )}
        </div>
      </PortfolioProvider>
    </StockDataProvider>
  );
};

export default App;
