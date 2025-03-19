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
  const { portfolio, updateStockQuantity, getCurrentQuantity } = usePortfolio();
  const [symbol, setSymbol] = useState<string>(selectedSymbol);
  const [quantity, setQuantity] = useState<number | string>(0);
  const [validSymbol, setValidSymbol] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
    let parsedValue = "";

    if (value.startsWith("0-") || value.startsWith("-0")) {
      setQuantity("-");
    }

    if (/^-?\d*$/.test(value)) {
      setQuantity(value === "" ? "0" : value);
    }
  };

  const handleQuantitySubmit = () => {
    const currentQuantity = getCurrentQuantity(symbol);

    if (!validSymbol) {
      setError("Stock symbol not found in portfolio.");
      return;
    }

    if (quantity !== "-") {
      const updatedQuantity =
        currentQuantity !== null ? currentQuantity! + quantity : 0;

      if (eval(`${updatedQuantity}`.replace(/^0+/, "") || "0") < 0) {
        setError("Cannot have negative stock quantity.");
        return;
      }

      updateStockQuantity(symbol, Number(quantity));
      closeModal();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 data-testid="update-stock-modal-h2">
          {selectedSymbol
            ? "Update Stock Quantity"
            : `Modify Quantity for ${symbol}`}
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
          </>
        )}

        <input
          type="text"
          value={quantity}
          onChange={handleQuantityInputChange}
          data-testid="quantity-txt"
          placeholder="Enter quantity (positive for buy, negative for sell)"
        />

        {selectedSymbol && (
          <>
            <p>Current Symbol: {selectedSymbol}</p>
            <p>Current Quantity: {getCurrentQuantity(selectedSymbol)!}</p>
          </>
        )}

        {error && (
          <p data-testid="error-p" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button onClick={handleQuantitySubmit} data-testid="update-btn">
          Update
        </button>
        <button onClick={closeModal} data-testid="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default StockModal;
