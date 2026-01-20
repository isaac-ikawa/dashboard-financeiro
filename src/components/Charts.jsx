import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Charts = () => {
  const [labels, setLabels] = useState([]);
  const [dolarData, setDolarData] = useState([]);
  const [bitcoinData, setBitcoinData] = useState([]);

  const fetchData = async () => {
    try {
      // Dólar últimos 30 dias - Banco Central
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);

      const formatDate = (date) =>
        date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      const startDateStr = start.toISOString().split('T')[0].split('-').reverse().join('/');
      const endDateStr = end.toISOString().split('T')[0].split('-').reverse().join('/');

      const resDollar = await fetch(
        `https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados?formato=json&dataInicial=${startDateStr}&dataFinal=${endDateStr}`
      );
      const dataDollar = await resDollar.json();
      if (dataDollar?.length) {
        const l = dataDollar.map((item) =>
          formatDate(new Date(item.data.split('/').reverse().join('/')))
        );
        const v = dataDollar.map((item) => parseFloat(item.valor));
        setLabels(l);
        setDolarData(v);
      }

      // Bitcoin últimos 30 dias - CoinGecko
      const resBTC = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=brl&days=30&interval=daily'
      );
      const dataBTC = await resBTC.json();
      if (dataBTC?.prices) {
        setBitcoinData(dataBTC.prices.map((p) => p[1]));
      }
    } catch (err) {
      console.error('Erro Charts:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#f9fafb' } },
      tooltip: {
        callbacks: {
          label: function (context) {
            return (
              context.dataset.label +
              ': ' +
              context.parsed.y.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            );
          },
        },
      },
      datalabels: {
        display: true,
        color: '#fff',
        align: 'top',
        formatter: (value) =>
          value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        font: { size: 10 },
      },
    },
    scales: {
      x: { ticks: { color: '#f9fafb', font: { size: 10 } }, grid: { color: '#4b5563' } },
      y: { ticks: { color: '#f9fafb', font: { size: 10 } }, grid: { color: '#4b5563' } },
    },
  };

  return (
    <div className="charts-grid">
      <div className="chart-wrapper">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Dólar (USD/BRL)',
                data: dolarData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.2)',
                tension: 0.3,
              },
            ],
          }}
          options={options}
          plugins={[ChartDataLabels]}
        />
      </div>
      <div className="chart-wrapper">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Bitcoin (BRL)',
                data: bitcoinData,
                borderColor: '#facc15',
                backgroundColor: 'rgba(250,204,21,0.2)',
                tension: 0.3,
              },
            ],
          }}
          options={options}
          plugins={[ChartDataLabels]}
        />
      </div>
    </div>
  );
};

export default Charts;
