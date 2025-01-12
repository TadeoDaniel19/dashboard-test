/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PieController,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(LineElement, BarElement, PieController, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);

interface GraphProps {
  type: 'line' | 'bar' | 'pie';
  data: any;
  options?: any;
}

export default function Graph({ type, data, options }: GraphProps) {
  switch (type) {
    case 'line':
      return <Line data={data} options={options} />;
    case 'bar':
      return <Bar data={data} options={options} />;
    case 'pie':
      return <Pie data={data} options={options} />;
    default:
      return null;
  }
}
