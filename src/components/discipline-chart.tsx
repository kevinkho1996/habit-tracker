"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface DisciplineChartProps {
  data: number[];
  labels: string[];
}

export function DisciplineChart({ data, labels }: DisciplineChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Success Rate (%)",
        data: data,
        borderColor: "#A855F7",
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(168, 85, 247, 0)");
          gradient.addColorStop(1, "rgba(168, 85, 247, 0.2)");
          return gradient;
        },
        tension: 0.5,
        pointBackgroundColor: "#A855F7",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#A855F7",
        pointHoverBorderWidth: 3,
        pointRadius: (context: any) => (context.dataIndex === context.dataset.data.length - 1 ? 6 : 0), // Show only last point or active point
        borderWidth: 3,
        shadowBlur: 10,
        shadowColor: "rgba(168, 85, 247, 0.5)",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    hover: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: "rgba(15, 7, 27, 0.9)",
        titleFont: { family: 'var(--font-roboto)', size: 12, weight: "bold" },
        bodyFont: { family: 'var(--font-roboto)', size: 14, weight: "bold" },
        padding: 16,
        cornerRadius: 16,
        displayColors: false,
        borderWidth: 1,
        borderColor: "rgba(168, 85, 247, 0.3)",
        callbacks: {
          label: (context) => `${context.parsed.y}% SUCCESS`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(168, 85, 247, 0.3)",
          font: { family: 'var(--font-roboto)', size: 10, weight: 'bold' as const },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(168, 85, 247, 0.05)",
        },
        ticks: {
          color: "rgba(168, 85, 247, 0.3)",
          font: { family: 'var(--font-roboto)', size: 10, weight: 'bold' as const },
          stepSize: 20,
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-2">
      <Line data={chartData} options={options} />
    </div>
  );
}
