import React from "react";
import { usePortfolio } from "../context/PortfolioContext";

interface StockTableProps {
  openModal: (symbol: string) => void;
}

const StockTable: React.FC<StockTableProps> = ({ openModal }) => {
  const { portfolio, removeStock } = usePortfolio();

  return (
    <div className="stock-table">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Daily Change (%)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.length === 0 ? (
            <tr>
              <td colSpan={5}>No stocks in your portfolio</td>
            </tr>
          ) : (
            portfolio.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.currentPrice}</td>
                <td>{stock.dailyChange}</td>
                <td>{stock.quantityHeld}</td>
                <td>
                  <button onClick={() => openModal(stock.symbol)}>
                    Buy/Sell
                  </button>
                  <button onClick={() => removeStock(stock.symbol)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
