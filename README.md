# Bitcoin Price Chart App

This application is a React-based Bitcoin price chart that displays simulated price data over different time periods. It's inspired by the token chart in the Moonshot app, focusing on a clean, polished user interface with interactive elements.

## Features

- Real-time Bitcoin price display with percentage change
- Interactive line chart showing price trends
- Time frame selection (1 Day, 1 Month, 1 Year)
- Responsive design for various screen sizes
- Smooth animations and transitions

## Technologies Used

- React
- TypeScript
- Vite (for fast development and optimized builds)
- ECharts (via `echarts-for-react`)
- Ant Design components

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or later recommended)
- npm (usually comes with Node.js) or yarn

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Run one of the following commands to install the dependencies:

   ```
   npm install
   ```
   or if you're using yarn:
   ```
   yarn
   ```

## Running the Application

After installing the dependencies, you can start the development server by running:

```
npm run dev
```
or with yarn:
```
yarn dev
```

This will start the Vite development server. The console output will show you the local URL where you can view your app (typically `http://localhost:5173`). Open this URL in your web browser to view the app.

## Building for Production

To create a production build of the app, run:

```
npm run build
```
or with yarn:
```
yarn build
```

This will generate a `dist` directory with optimized production-ready files.

To preview the production build locally, you can use:

```
npm run preview
```
or with yarn:
```
yarn preview
```


## Notes

- This application currently uses simulated data. In a production environment, you would want to replace this with real-time data from a cryptocurrency API.
- The app is designed with mobile-first principles but is responsive and works well on desktop browsers too.
