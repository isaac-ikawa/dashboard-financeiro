import React, { useState, useEffect } from 'react';
import Card from './Card';

const BitcoinCard = () => {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);

  const fetchBitcoin = async () => {
    try {
      // Pega o histórico de 2 dias do CoinGecko
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=brl&days=2&interval=daily'
      );
      const data = await res.json();

      if (data?.prices?.length >= 2) {
        const yesterday = data.prices[0][1]; // preço do dia anterior
        const today = data.prices[data.prices.length - 1][1]; // preço mais recente

        setPrice(
          today.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        );
        setChange(today > yesterday ? 'up' : today < yesterday ? 'down' : 'same');
      } else if (data?.prices?.length === 1) {
        // fallback caso tenha só 1 ponto
        const today = data.prices[0][1];
        setPrice(
          today.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        );
        setChange('same');
      }
    } catch (err) {
      console.error('Erro Bitcoin:', err);
    }
  };

  useEffect(() => {
    fetchBitcoin(); // primeira chamada
    const interval = setInterval(fetchBitcoin, 60000); // atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  return <Card title="Bitcoin" value={price} color="#facc15" change={change} />;
};

export default BitcoinCard;
