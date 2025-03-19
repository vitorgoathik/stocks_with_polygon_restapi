import { render, screen, fireEvent } from "@testing-library/react";
import StockTable from "./StockTable";
import { usePortfolio } from "../context/PortfolioContext";

jest.mock("../context/PortfolioContext", () => ({
  usePortfolio: jest.fn(),
}));
const usePortfolioMock = usePortfolio as jest.Mock;

describe("StockTable", () => {
  let openModalMock: jest.Mock;

  beforeEach(() => {
    openModalMock = jest.fn();
    usePortfolioMock.mockReturnValue({
      portfolio: [
        {
          symbol: "AAPL",
          currentPrice: 150,
          dailyChange: 2,
          quantityHeld: 100,
        },
        {
          symbol: "GOOGL",
          currentPrice: 2800,
          dailyChange: 1.5,
          quantityHeld: 50,
        },
      ],
      removeStock: jest.fn(),
    });
  });

  it("renders the stock table correctly", () => {
    render(<StockTable openModal={openModalMock} />);
    expect(screen.getByText("Symbol")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });

  it("opens modal with correct symbol when Buy/Sell button is clicked", async () => {
    render(<StockTable openModal={openModalMock} />);

    const buySellButtons = await screen.findAllByRole("button", {
      name: /Buy\/Sell/,
    });

    const buySellButton = buySellButtons.find(
      (button) => button.getAttribute("name") === "buy_sell_AAPL",
    );

    fireEvent.click(buySellButton!);

    expect(openModalMock).toHaveBeenCalledWith("AAPL");
  });
  it("calls removeStock when the remove button is clicked", () => {
    const removeStockMock = jest.fn();
    usePortfolioMock.mockReturnValue({
      portfolio: [
        {
          symbol: "AAPL",
          currentPrice: 150,
          dailyChange: 2,
          quantityHeld: 100,
        },
      ],
      removeStock: removeStockMock,
    });

    render(<StockTable openModal={openModalMock} />);
    const removeButton = screen.getByTestId("remove-btn");
    fireEvent.click(removeButton);

    expect(removeStockMock).toHaveBeenCalledWith("AAPL");
  });
});
