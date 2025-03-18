import React, { useState, useEffect } from "react";

import { usePortfolio } from "../context/PortfolioContext";

interface StockModalProps {
  symbol: string | null;
  showSymbolInput: boolean;
  closeModal: () => void;
  symbolInput: string;
  quantityInput: number;
  handleSymbolInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleQuantityInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
}

const StockModal: React.FC<StockModalProps> = ({
  symbol,
  showSymbolInput,
  closeModal,
  symbolInput,
  quantityInput,
  handleSymbolInputChange,
  handleQuantityInputChange,
  handleSubmit,
}) => {
  const { portfolio } = usePortfolio(); // Fetch portfolio here

  const [quantity, setQuantity] = useState<number>(quantityInput);
  const [validSymbol, setValidSymbol] = useState<boolean>(true);

  useEffect(() => {
    if (showSymbolInput && symbolInput) {
      const stockExists = portfolio.some(
        (stock) => stock.symbol === symbolInput,
      );
      setValidSymbol(stockExists); // Validate symbol existence
    }
  }, [showSymbolInput, symbolInput, portfolio]);

  const handleQuantitySubmit = () => {
    if (isNaN(quantity)) {
      alert("Invalid quantity");
      return;
    }
    handleSubmit(); // Call the parent submit function to update the portfolio
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          {showSymbolInput
            ? "Update Stock Quantity"
            : `Modify Quantity for ${symbol}`}
        </h2>

        {/* Symbol input (if showSymbolInput is true) */}
        {showSymbolInput && (
          <>
            <input
              type="text"
              value={symbolInput}
              onChange={handleSymbolInputChange}
              placeholder="Enter stock symbol"
            />
            {!validSymbol && (
              <p style={{ color: "red" }}>
                Stock symbol not found in portfolio.
              </p>
            )}
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityInputChange}
              placeholder="Enter quantity (positive for buy, negative for sell)"
            />
          </>
        )}

        {/* If showSymbolInput is false, we only show quantity input */}
        {!showSymbolInput && (
          <>
            <p>Current Symbol: {symbol}</p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
            />
          </>
        )}

        <button
          onClick={handleQuantitySubmit}
          disabled={!validSymbol && showSymbolInput}
        >
          Update
        </button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default StockModal;
