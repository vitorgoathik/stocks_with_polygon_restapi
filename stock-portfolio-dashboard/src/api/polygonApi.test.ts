// src/api/polygonApi.test.ts

import axios from "axios";
import {
  getStockPrice,
  getStockPreviousClose,
  getStockDailyChange,
} from "./polygonApi"; // Adjust the import path
jest.mock("axios"); // Mock the entire axios module
const mockedAxios = axios.get as jest.Mock;

describe("polygonApi tests", () => {
  beforeEach(() => {
    // Reset the mocks before each test to avoid tests affecting each other
    jest.clearAllMocks();
  });

  it("should fetch stock price successfully", async () => {
    // Mocking axios.get to return a successful response
    mockedAxios.mockResolvedValue({
      data: {
        results: [{ price: 100 }],
      },
    });

    const price = await getStockPrice("AAPL");
    expect(price).toBe(100);
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.polygon.io/v3/trades/AAPL?order=asc&limit=1&sort=timestamp&apiKey=XS6uA7SXYTlasRjAN_f3wZV79ulPUsrh",
    );
  });

  it("should fetch previous close price successfully", async () => {
    // Mocking axios.get to return a previous close response
    mockedAxios.mockResolvedValue({
      data: {
        results: [{ c: 150 }],
      },
    });

    const closePrice = await getStockPreviousClose("AAPL");
    expect(closePrice).toBe(150);
  });

  it("should calculate daily change successfully", async () => {
    // Mocking the getStockPrice and getStockPreviousClose
    mockedAxios.mockResolvedValueOnce({
      data: {
        results: [{ price: 100 }],
      },
    });
    mockedAxios.mockResolvedValueOnce({
      data: {
        results: [{ c: 90 }],
      },
    });

    const dailyChange = await getStockDailyChange("AAPL");
    expect(dailyChange).toBeCloseTo(11.11, 2); // Expect around 11.11% change
  });
});
