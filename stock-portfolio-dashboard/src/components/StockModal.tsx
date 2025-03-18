import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";

interface StockModalProps {
  closeModal: () => void;
  selectedSymbol: string;
}

const StockModal: React.FC<StockModalProps> = ({
  closeModal,
  selectedSymbol,
}) => {
  const { portfolio, updateStockQuantity } = usePortfolio();

  const [symbol, setSymbol] = useState<string>(selectedSymbol);
  const [quantity, setQuantity] = useState<number>(0);

  const [validSymbol, setValidSymbol] = useState<boolean>(true);

  useEffect(() => {
    if (symbol) {
      const stockExists = portfolio.some((stock) => stock.symbol === symbol);
      setValidSymbol(stockExists);
    }
  }, [symbol, portfolio]);

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    const parsedValue = value ? parseInt(value, 10) : 0;
    setQuantity(parsedValue);
  };

  const handleQuantitySubmit = () => {
    if (isNaN(quantity)) {
      alert("Invalid quantity");
      return;
    }

    const matchingStock = portfolio.find((stock) => stock.symbol === symbol);
    if (matchingStock) {
      updateStockQuantity(symbol, quantity);
    } else {
      alert("Symbol not found in portfolio.");
    }

    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          {selectedSymbol
            ? "Update Stock Quantity"
            : `Modify Quantity for ${selectedSymbol}`}
        </h2>

        {!selectedSymbol && (
          <>
            <input
              type="text"
              value={symbol}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSymbol(e.target.value)
              }
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

        {selectedSymbol && (
          <>
            <p>Current Symbol: {selectedSymbol}</p>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityInputChange}
              placeholder="Enter quantity"
            />
          </>
        )}

        <button
          onClick={handleQuantitySubmit}
          disabled={!validSymbol && symbol !== null}
        >
          Update
        </button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default StockModal;
