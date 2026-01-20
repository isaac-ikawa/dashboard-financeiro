import React, { useState, useEffect } from 'react';
import Card from './Card';

const DollarCard = () => {
  const [rate, setRate] = useState(null);
  const [change, setChange] = useState(null);

  const fetchDollarBC = async () => {
    try {
      // Últimos 2 registros do Banco Central
      const res = await fetch(
        'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/2?formato=json'
      );
      const data = await res.json();
      if (data?.length === 2) {
        const today = parseFloat(data[1].valor);
        const yesterday = parseFloat(data[0].valor);

        setRate(
          today.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        );
        setChange(today > yesterday ? 'up' : today < yesterday ? 'down' : 'same');
      }
    } catch (err) {
      console.error('Erro Dólar BC:', err);
    }
  };

  useEffect(() => {
    fetchDollarBC();
    const interval = setInterval(fetchDollarBC, 60000);
    return () => clearInterval(interval);
  }, []);

  return <Card title="Dólar (USD/BRL)" value={rate} color="#10b981" change={change} />;
};

export default DollarCard;
