import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Mocking the context providers to return simple children
jest.mock("./context/StockDataContext", () => ({
  StockDataProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("./context/PortfolioContext", () => ({
  PortfolioProvider: ({ children }: { children: React.ReactNode }) => children,
  usePortfolio: () => ({
    portfolio: [
      {
        symbol: "AAPL",
        currentPrice: 150,
        dailyChange: 1.5,
        quantityHeld: 100,
      },
      {
        symbol: "GOOG",
        currentPrice: 2800,
        dailyChange: 2.0,
        quantityHeld: 50,
      },
    ],
    removeStock: jest.fn(),
    updateStockQuantity: jest.fn(),
    getCurrentQuantity: (symbol: string) => {
      return symbol === "AAPL" ? 100 : 50;
    },
  }),
}));

describe("App", () => {
  test("renders the app and shows the correct stock symbols", async () => {
    render(<App />);

    await screen.findByText("AAPL");
    await screen.findByText("GOOG");

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("GOOG")).toBeInTheDocument();
  });

  test("opens the modal when 'Update Stock Quantity' button is clicked", async () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("update-stock-btn"));

    await screen.findByTestId("update-stock-modal-h2");

    expect(screen.queryByTestId("update-stock-modal-h2")).not.toBeNull();
  });

  test("closes the modal when 'Cancel' is clicked", async () => {
    render(<App />);

    fireEvent.click(screen.getByTestId("update-stock-btn"));

    await screen.findByTestId("update-stock-modal-h2");

    fireEvent.click(screen.getByTestId("cancel-btn"));

    await waitFor(() =>
      expect(screen.queryByTestId("update-stock-modal-h2")).toBeNull(),
    );
  });
});
