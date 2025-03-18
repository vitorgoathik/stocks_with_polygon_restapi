import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface StockModalProps {
  symbol: string;
  closeModal: () => void;
}

const StockModal: React.FC<StockModalProps> = ({ symbol, closeModal }) => {
  const { portfolio, updateStockQuantity } = usePortfolio();
  const [quantity, setQuantity] = useState<number>(0);
  const stock = portfolio.find((stock) => stock.symbol === symbol);
  
  const currentQuantity = stock ? stock.quantityHeld : 0;

  const handleSubmit = () => {
    if (isNaN(quantity)) {
      alert("Invalid quantity");
      return;
    }

    updateStockQuantity(symbol, quantity);
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Update Stock Quantity for {symbol}</h2>
        <p>Current Quantity: {currentQuantity}</p>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Enter quantity (positive for buy, negative for sell)"
        />
        <button onClick={handleSubmit}>Update</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default StockModal;