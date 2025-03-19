# Stock Portfolio Dashboard

## Overview

The **Stock Portfolio Dashboard** is a React app that helps users manage their stock portfolios. Users can view their stock holdings, update quantities, and track the daily change in stock prices. The app is designed with simplicity in mind, using React's built-in features like Context API to manage the application state.

## Getting Started

Follow these steps to set up the app locally:

### Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (version 16 or later)
- **npm** (Node package manager)

### Steps to Set Up the App

1. **Install Dependencies**

After unzipping the project, navigate to the project folder and run the following command to install all the necessary dependencies:

```bash
npm install
```

2. **Run the app**

Once the dependencies are installed, start the development server with:

```bash
npm start
```

The app will now be available at http://localhost:3000. Any changes you make will automatically be reflected in the browser.

### Running Tests

To run the tests, use:

```bash
npm test
```

This command will run the tests using Jest and React Testing Library and show the results in the terminal. It will also watch for changes in the test files and rerun tests automatically.

### Building for Production

To create an optimized build for production, run:

```bash
npm run build
```

This will generate a production-ready build in the build folder, which you can deploy to a web server.

### State Management

For managing the state of the app, I used React Context API. It's simple, lightweight, and well-suited for a smaller app like this one.

## Why React Context API?

# Pros:

- **No Extra Libraries**: The Context API comes built into React, so there's no need to bring in extra dependencies like Redux or MobX, keeping things light.
- **Easy to Use**: For an app of this size, the Context API is easy to implement and doesn't add unnecessary complexity.
- **Well with React**: Since it's part of the React ecosystem, it's easy to integrate into any React app, making it a great choice for managing global state.

# Cons:

- **Performance Issues with Frequent Updates**: If the app grows and requires more frequent state updates or more complex state management, Context can start to become less efficient.
- **Not Ideal for Large Apps**: As the app becomes more complex, managing large or deeply nested states can become difficult with Context, and you might need a more robust solution like Redux.
- **In this app**, the PortfolioContext manages the user's stock portfolio (adding/removing stocks and updating quantities), while the StockDataContext handles fetching and storing stock data (like current prices and daily changes).

### Features

- **Stock Portfolio View**: Displays a table with the stocks in the user's portfolio, including stock symbols, current prices, daily changes, and quantities.
- **Update Stock Quantities**: Users can update the quantity of any stock in their portfolio, either by increasing or decreasing it.
- **Track Stock Data**: The app integrates with the **Polygon API** to fetch live stock data (e.g., current price, daily change) to keep the portfolio up to date.

### Conclusion

_This app is a simple but functional stock portfolio manager that leverages React Context API for state management. It’s easy to scale for small-to-medium-sized apps, though for larger apps, you might want to look into more complex state management tools like Redux. Overall, the Context API keeps things lightweight and simple for an app like this, while also integrating seamlessly with React’s component-based structure._
