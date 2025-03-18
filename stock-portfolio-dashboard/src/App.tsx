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
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(
    null,
  );
  const [showSymbolInput, setShowSymbolInput] = useState<boolean>(false);
  const [symbolInput, setSymbolInput] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<number>(0);

  const openModalWithSymbolInput = () => {
    setShowSymbolInput(true);
    setSelectedStockSymbol(null);
    setModalOpen(true);
  };

  const openModalWithSelectedSymbol = (symbol: string) => {
    setShowSymbolInput(false);
    setSelectedStockSymbol(symbol);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStockSymbol(null);
    setShowSymbolInput(false);
  };

  const handleSymbolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbolInput(e.target.value);
  };

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuantityInput(Number(e.target.value));
  };

  const handleSubmitSymbolAndQuantity = () => {
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
              symbol={selectedStockSymbol}
              showSymbolInput={showSymbolInput}
              closeModal={closeModal}
              symbolInput={symbolInput}
              quantityInput={quantityInput}
              handleSymbolInputChange={handleSymbolInputChange}
              handleQuantityInputChange={handleQuantityInputChange}
              handleSubmit={handleSubmitSymbolAndQuantity}
            />
          )}
        </div>
      </PortfolioProvider>
    </StockDataProvider>
  );
};

export default App;
