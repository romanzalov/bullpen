import React, { useState, useEffect, useCallback, useRef } from "react";
import { Typography, Button, Space } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const { Title, Text } = Typography;

import BitcoinLogo from "./BitcoinLogo";

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
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    const data = preGeneratedData[timeframe];
    setPriceData(data);
    setDisplayPrice(data[data.length - 1].price);
    setPriceChange(
      ((data[data.length - 1].price - data[0].price) / data[0].price) * 100
    );
  }, [timeframe]);

  const updatePriceDisplay = useCallback(
    (price: number | null) => {
      if (price !== null) {
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

  const options: Highcharts.Options = {
    title: {
      text: undefined,
    },
    xAxis: {
      type: "datetime",
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      lineWidth: 0,
      tickWidth: 0,
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
    },
    tooltip: {
      valueDecimals: 2,
      valuePrefix: "$",
    },
    series: [
      {
        type: "area",
        name: "Bitcoin Price",
        data: priceData.map((point) => [point.timestamp, point.price]),
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgb(199, 113, 243)"],
            [0.7, "rgb(76, 175, 254)"],
          ],
        },
        fillOpacity: 0.2,
      },
    ],
    chart: {
      zooming: {
        type: "x",
      },
      events: {
        load: function (this: Highcharts.Chart) {
          const lastPoint =
            this.series[0].points[this.series[0].points.length - 1];
          if (lastPoint) {
            lastPoint.onMouseOver();
          }
        },
      },
    },
    plotOptions: {
      area: {
        marker: {
          radius: 2,
          enabled: false,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              height: 200, // Reduce height for mobile devices
            },
            xAxis: {
              labels: {
                rotation: -45,
                style: {
                  fontSize: "8px",
                },
              },
            },
            yAxis: {
              labels: {
                style: {
                  fontSize: "8px",
                },
              },
            },
          },
        },
      ],
    },
  };

  const handleTimeframeChange = (newTimeframe: Timeframe) => {
    setTimeframe(newTimeframe);
  };

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (chart) {
      const updateTooltip = (e: MouseEvent) => {
        const event = chart.pointer.normalize(e);
        const point = chart.series[0].searchPoint(event, true);
        if (point) {
          updatePriceDisplay(point.y || null);
        }
      };

      const addListeners = () => {
        chart.container.addEventListener("mousemove", updateTooltip);
        chart.container.addEventListener(
          "touchmove",
          updateTooltip as EventListener
        );
      };

      const removeListeners = () => {
        chart.container.removeEventListener("mousemove", updateTooltip);
        chart.container.removeEventListener(
          "touchmove",
          updateTooltip as EventListener
        );
      };

      addListeners();

      return () => {
        if (chart && chart.container) {
          removeListeners();
        }
      };
    }
  }, [updatePriceDisplay]);

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
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
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
