import { render, screen, waitFor } from "@testing-library/react";
import { StockDataProvider, useStockData } from "../context/StockDataContext";
import stockStaticData from "../data/stocks.json";

jest.mock("../api/polygonApi", () => {
  const stockStaticData = require("../data/stocks.json");
  return {
    getTop100Stocks: jest.fn().mockResolvedValue({ results: stockStaticData }),
    getStockPrice: jest.fn().mockResolvedValue(100),
    getStockDailyChange: jest.fn().mockResolvedValue(5),
  };
});

describe("StockDataContext", () => {
  it("shows loading state while fetching data", () => {
    const TestComponent = () => {
      const { stockData } = useStockData();
      return (
        <div>
          {stockData.length === 0 ? "Loading stock data..." : "Data loaded"}
        </div>
      );
    };

    render(
      <StockDataProvider>
        <TestComponent />
      </StockDataProvider>,
    );

    expect(screen.getByText("Loading stock data...")).toBeInTheDocument();
  });

  it("fetches stock data and displays stock information", async () => {
    const TestComponent = () => {
      const { stockData } = useStockData();
      return (
        <div>
          {stockData.length > 0 ? (
            stockData.map((stock) => (
              <div key={stock.symbol}>
                <h3>{stock.symbol}</h3>
                <p>Price: ${stock.currentPrice}</p>
                <p>Daily Change: {stock.dailyChange}%</p>
              </div>
            ))
          ) : (
            <div>No stocks available</div>
          )}
        </div>
      );
    };

    render(
      <StockDataProvider>
        <TestComponent />
      </StockDataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(stockStaticData[0].symbol)).toBeInTheDocument();
    });

    const priceElements = await screen.findAllByText(/Price: \$\d+/);

    expect(priceElements[0]).toHaveTextContent("Price: $555");
    expect(priceElements[1]).toHaveTextContent("Price: $125");
    expect(priceElements[2]).toHaveTextContent("Price: $321");

    const changeElements = await screen.findAllByText(
      /Daily Change: -?\d+(\.\d+)?%/,
    );

    expect(changeElements[0]).toHaveTextContent("Daily Change: 0.1%");
    expect(changeElements[1]).toHaveTextContent("Daily Change: 1.2%");
    expect(changeElements[2]).toHaveTextContent("Daily Change: -0.3%");
  });
});
