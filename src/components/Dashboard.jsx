import React from 'react';
import DollarCard from './DollarCard';
import BitcoinCard from './BitcoinCard';
import Charts from './Charts';
import '../scss/style.scss';

const Dashboard = () => {
  return (
    <div>
      <header>Dashboard Financeiro</header>

      <section className="cards">
        <DollarCard />
        <BitcoinCard />
      </section>

      <Charts />

      {/* Rodapé */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Desenvolvido por Isaac Ikawa
      </footer>
    </div>
  );
};

export default Dashboard;
