import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PortfolioProvider, usePortfolio } from "../context/PortfolioContext";
import { StockDataProvider } from "../context/StockDataContext";
import React from "react";
import * as api from "../api/polygonApi";

const mockStockData = [
  { symbol: "stock1", price: 555, quantityHeld: 10 },
  { symbol: "stock2", price: 125, quantityHeld: 5 },
  { symbol: "stock3", price: 321, quantityHeld: 3 },
];

jest.mock("../api/polygonApi", () => ({
  getTop100Stocks: jest.fn(),
  getStockPrice: jest.fn(),
  getStockDailyChange: jest.fn(),
}));

describe("PortfolioContext", () => {
  beforeEach(() => {
    (api.getTop100Stocks as jest.Mock).mockResolvedValue({
      results: [
        { ticker: "stock1" },
        { ticker: "stock2" },
        { ticker: "stock3" },
      ],
    });

    (api.getStockPrice as jest.Mock).mockResolvedValueOnce(555);
    (api.getStockPrice as jest.Mock).mockResolvedValueOnce(125);
    (api.getStockPrice as jest.Mock).mockResolvedValueOnce(321);

    (api.getStockDailyChange as jest.Mock).mockResolvedValueOnce(0.1);
    (api.getStockDailyChange as jest.Mock).mockResolvedValueOnce(1.2);
    (api.getStockDailyChange as jest.Mock).mockResolvedValueOnce(-0.3);
  });

  it("adds a stock to the portfolio", async () => {
    const TestComponent = () => {
      const { portfolio, addStock } = usePortfolio();
      return (
        <div>
          <button onClick={() => addStock("stock1", 100)}>Add stock1</button>
          <div>{portfolio.length}</div>
        </div>
      );
    };

    render(
      <StockDataProvider>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </StockDataProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Loading stock data..."),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    const addButton = await screen.findByText("Add stock1");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  it("removes a stock from the portfolio", async () => {
    const TestComponent = () => {
      const { portfolio, removeStock } = usePortfolio();
      return (
        <div>
          {portfolio.length > 0 && (
            <button onClick={() => removeStock("stock1")}>Remove stock1</button>
          )}
          <div>{portfolio.length}</div>
        </div>
      );
    };

    render(
      <StockDataProvider>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </StockDataProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Loading stock data..."),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    const removeButton = await screen.findByText("Remove stock1");
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("updates the stock quantity in the portfolio", async () => {
    const TestComponent = () => {
      const { portfolio, updateStockQuantity } = usePortfolio();
      return (
        <div>
          <button onClick={() => updateStockQuantity("stock1", 5)}>
            Add 5 to stock1
          </button>
          <div>
            {portfolio.map((stock) => (
              <p key={stock.symbol}>
                {stock.symbol}: {stock.quantityHeld}
              </p>
            ))}
          </div>
        </div>
      );
    };

    render(
      <StockDataProvider>
        <PortfolioProvider>
          <TestComponent />
        </PortfolioProvider>
      </StockDataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Add 5 to stock1")).toBeInTheDocument();
    });

    const addQuantityButton = screen.getByText("Add 5 to stock1");
    fireEvent.click(addQuantityButton);
    fireEvent.click(addQuantityButton);
    fireEvent.click(addQuantityButton);

    const quantityElements = await screen.findAllByText(/stock1: \d+/);

    expect(quantityElements[0]).toHaveTextContent("stock1: 15");
  });
});
