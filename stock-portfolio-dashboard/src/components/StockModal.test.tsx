import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import StockModal from "./StockModal";
import { usePortfolio } from "../context/PortfolioContext";

jest.mock("../context/PortfolioContext", () => ({
  usePortfolio: jest.fn(),
}));

const usePortfolioMock = usePortfolio as jest.Mock;

describe("StockModal", () => {
  let closeModalMock: jest.Mock;
  let updateStockQuantityMock: jest.Mock;

  beforeEach(() => {
    closeModalMock = jest.fn();
    updateStockQuantityMock = jest.fn();

    usePortfolioMock.mockReturnValue({
      portfolio: [{ symbol: "AAPL", quantityHeld: 100 }],
      updateStockQuantity: updateStockQuantityMock,
      getCurrentQuantity: jest.fn().mockReturnValue(100),
    });
  });

  it("renders without crashing when the modal is open", () => {
    render(<StockModal closeModal={closeModalMock} selectedSymbol="AAPL" />);
    expect(screen.queryByTestId("update-stock-modal-h2")).not.toBeNull();
  });

  it("allows the user to input and submit a valid quantity", async () => {
    render(<StockModal closeModal={closeModalMock} selectedSymbol="AAPL" />);

    const input = screen.getByPlaceholderText(
      "Enter quantity (positive for buy, negative for sell)",
    );
    fireEvent.change(input, { target: { value: "50" } });

    const updateButton = screen.getByTestId("update-btn");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateStockQuantityMock).toHaveBeenCalledWith("AAPL", 50);
      expect(closeModalMock).toHaveBeenCalled();
    });
  });

  it("shows an error if quantity results in negative total", async () => {
    render(<StockModal closeModal={closeModalMock} selectedSymbol="AAPL" />);

    const input = screen.getByPlaceholderText(/Enter quantity/);
    fireEvent.change(input, { target: { value: "-200" } });

    const updateButton = screen.getByTestId("update-btn");
    fireEvent.click(updateButton);

    await waitFor(() => {
      const errorP = screen.getByTestId("error-p");
      expect(errorP).toBeInTheDocument();
      expect(errorP).toHaveTextContent("Cannot have negative stock quantity.");
    });
  });

  it("does not allow negative quantity if it goes below 0 after subtraction", async () => {
    render(<StockModal closeModal={closeModalMock} selectedSymbol="AAPL" />);

    const input = screen.getByPlaceholderText(/Enter quantity/);
    fireEvent.change(input, { target: { value: "-200" } });

    const updateButton = screen.getByTestId("update-btn");
    fireEvent.click(updateButton);

    await waitFor(() => {
      const errorP = screen.getByTestId("error-p");
      expect(errorP).toBeInTheDocument();
      expect(errorP).toHaveTextContent("Cannot have negative stock quantity.");
    });
  });

  it("calls closeModal when cancel button is clicked", () => {
    render(<StockModal closeModal={closeModalMock} selectedSymbol="AAPL" />);

    const cancelButton = screen.getByTestId("cancel-btn");
    fireEvent.click(cancelButton);

    expect(closeModalMock).toHaveBeenCalled();
  });

  it("allows the user to enter a negative number using the minus sign", async () => {
    render(<StockModal closeModal={closeModalMock} selectedSymbol="AAPL" />);

    const input = screen.getByTestId("quantity-txt");
    fireEvent.change(input, { target: { value: "-100" } });

    await waitFor(() => {
      expect(input).toHaveValue("-100");
    });

    const updateButton = screen.getByTestId("update-btn");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateStockQuantityMock).toHaveBeenCalledWith("AAPL", -100);
      expect(closeModalMock).toHaveBeenCalled();
    });
  });
});
