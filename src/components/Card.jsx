import React from 'react';
import '../scss/style.scss';

const Card = ({ title, value, color, change }) => {
  let arrow = '';
  let arrowColor = '';

  if (change === 'up') {
    arrow = '▲';
    arrowColor = '#10b981'; // verde
  } else if (change === 'down') {
    arrow = '▼';
    arrowColor = '#ef4444'; // vermelho
  }

  return (
    <div className="card" style={{ borderColor: color }}>
      <h2>{title}</h2>
      <p style={{ color }}>
        {value ? value : 'Carregando...'}{' '}
        <span style={{ color: arrowColor, fontSize: '1rem' }}>{arrow}</span>
      </p>
    </div>
  );
};

export default Card;
