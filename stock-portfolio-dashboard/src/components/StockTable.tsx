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
              <td colSpan={5}>Loading...</td>
            </tr>
          ) : (
            portfolio.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.currentPrice}</td>
                <td>{stock.dailyChange.toFixed(2)}%</td>
                <td>{stock.quantityHeld}</td>
                <td>
                  <div className="button-container">
                    <button
                      name={`buy_sell_${stock.symbol}`}
                      data-testid="buy_sell_button"
                      onClick={() => openModal(stock.symbol)}
                    >
                      Buy/Sell
                    </button>
                    <button
                      name={`remove_${stock.symbol}`}
                      data-testid="remove-btn"
                      onClick={() => removeStock(stock.symbol)}
                    >
                      Remove
                    </button>
                  </div>
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
