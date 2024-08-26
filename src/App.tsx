import React, { useState, useEffect, useCallback, useRef } from "react";
import { Typography, Button, Space } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import type { EChartsOption, LineSeriesOption } from "echarts";

const BitcoinLogo: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    style={{ verticalAlign: "middle", marginRight: "8px" }}
  >
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
      />
    </g>
  </svg>
);

const { Title, Text } = Typography;

interface StockDataPoint {
  timestamp: number;
  price: number;
}

type Timeframe = "1d" | "30" | "365";

const generateStaticData = (
  timeframe: Timeframe,
  startPrice: number
): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  let currentPrice = startPrice;
  const now = Date.now();
  let points: number;
  let interval: number;
  let maxChange: number;

  switch (timeframe) {
    case "1d":
      points = 50;
      interval = 60 * 60 * 1000; // 1 hour in milliseconds
      maxChange = 0.005; // 0.5% max change per hour
      break;
    case "30":
      points = 100;
      interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      maxChange = 0.02; // 2% max change per day
      break;
    case "365":
      points = 365;
      interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
      maxChange = 0.03; // 3% max change per day
      break;
  }

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 2 * maxChange;
    currentPrice = currentPrice * (1 + change);
    data.push({
      timestamp: now - (points - 1 - i) * interval,
      price: Number(currentPrice.toFixed(2)),
    });
  }

  return data;
};

const preGeneratedData: Record<Timeframe, StockDataPoint[]> = {
  "1d": generateStaticData("1d", 60000),
  "30": generateStaticData("30", 60000),
  "365": generateStaticData("365", 60000),
};

const BitcoinPriceChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("1d");
  const [priceData, setPriceData] = useState<StockDataPoint[]>(
    preGeneratedData["1d"]
  );
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    const data = preGeneratedData[timeframe];
    setPriceData(data);
    setDisplayPrice(data[data.length - 1].price);
    setPriceChange(
      ((data[data.length - 1].price - data[0].price) / data[0].price) * 100
    );
  }, [timeframe]);

  const updatePriceDisplay = useCallback(
    (params: any) => {
      if (params && params.value) {
        const price = params.value[1];
        setDisplayPrice(price);
        const initialPrice = priceData[0]?.price;
        if (initialPrice) {
          setPriceChange(((price - initialPrice) / initialPrice) * 100);
        }
      } else {
        const lastDataPoint = priceData[priceData.length - 1];
        if (lastDataPoint) {
          setDisplayPrice(lastDataPoint.price);
          setPriceChange(
            ((lastDataPoint.price - priceData[0].price) / priceData[0].price) *
              100
          );
        }
      }
    },
    [priceData]
  );


  let base = +new Date(1968, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let date = [];
  let data = [Math.random() * 300];
  for (let i = 1; i < 20000; i++) {
    let now = new Date((base += oneDay));
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
  }



  const options: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: 'Large Area Chart'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },
        areaStyle: {
          color: "rgba(24, 144, 255, 0.2)",
          origin: "start",
        },
        data: data
      }
    ]
  };

  const handleTimeframeChange = (newTimeframe: Timeframe) => {
    setTimeframe(newTimeframe);
  };

  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance();
    if (chart) {
      chart.on("updateAxisPointer", (params: any) => {
        if (params.axesInfo && params.axesInfo.length > 0) {
          const axisValue = params.axesInfo[0].value;
          const pointIndex = priceData.findIndex(
            (point) => point.timestamp === axisValue
          );
          if (pointIndex !== -1) {
            updatePriceDisplay({
              value: [axisValue, priceData[pointIndex].price],
            });
          }
        } else {
          updatePriceDisplay(null);
        }
      });
    }

    return () => {
      if (chart) {
        chart.off("updateAxisPointer");
      }
    };
  }, [updatePriceDisplay, priceData]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Title
            level={2}
            style={{
              marginBottom: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
            <BitcoinLogo />
            BTC
          </Title>
          {displayPrice !== null && (
            <Text strong style={{ fontSize: "1.2rem" }}>
              $
              {displayPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {priceChange !== null && (
                <span
                  style={{
                    marginLeft: "10px",
                    color: priceChange >= 0 ? "green" : "red",
                  }}
                >
                  {priceChange >= 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                  {Math.abs(priceChange).toFixed(2)}%
                </span>
              )}
            </Text>
          )}
        </div>
        <div style={{ width: "100vw", overflow: "hidden" }}>
          <ReactECharts
            ref={chartRef}
            option={options}
            style={{ height: "300px", width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>
        <Space
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            size="small"
            type={timeframe === "1d" ? "primary" : "default"}
            onClick={() => handleTimeframeChange("1d")}
          >
            1 Day
          </Button>
          <Button
            size="small"
            type={timeframe === "30" ? "primary" : "default"}
            onClick={() => handleTimeframeChange("30")}
          >
            1 Month
          </Button>
          <Button
            size="small"
            type={timeframe === "365" ? "primary" : "default"}
            onClick={() => handleTimeframeChange("365")}
          >
            1 Year
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default BitcoinPriceChart;
