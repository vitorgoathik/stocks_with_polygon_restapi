import axios from "axios";

const API_KEY = "XS6uA7SXYTlasRjAN_f3wZV79ulPUsrh";
const getPreviousCloseRequestUrl = (symbol: string) =>
  `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${API_KEY}`;
const getStockPriceRequestUrl = (symbol: string) =>
  `https://api.polygon.io/v3/trades/${symbol}?order=asc&limit=1&sort=timestamp&apiKey=${API_KEY}`;
const getTop100StocksRequestUrl = () =>
  `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&order=asc&limit=100&sort=ticker&apiKey=${API_KEY}`;

export const getStockPrice = async (symbol: string): Promise<number> => {
  try {
    const response = await axios.get(getStockPriceRequestUrl(symbol));
    return response.data?.results?.[0]?.price || 0;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return 0; // TODO this endpoint is returning bad request for some reason.
  }
};

export const getStockPreviousClose = async (
  symbol: string,
): Promise<number> => {
  try {
    const response = await axios.get(getPreviousCloseRequestUrl(symbol));
    const closePrice = response.data?.results?.[0]?.c || 0;
    return closePrice;
  } catch (error) {
    console.error(`Error fetching previous close for ${symbol}:`, error);
    return 0;
  }
};

export const getStockDailyChange = async (symbol: string): Promise<number> => {
  try {
    const currentPrice = await getStockPrice(symbol);
    const previousClose = await getStockPreviousClose(symbol);
    if (previousClose === 0) return 0;
    return ((currentPrice - previousClose) / previousClose) * 100;
  } catch (error) {
    console.error(`Error calculating daily change for ${symbol}:`, error);
    return 0;
  }
};

export const getTop100Stocks = async () => {
  try {
    const response = await axios.get(getTop100StocksRequestUrl());
    return response.data;
  } catch (error) {
    console.error("Error fetching stock tickers:", error);
    return null;
  }
};
