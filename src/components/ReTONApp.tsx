import React, { useState, useCallback, useEffect } from 'react';

const ReTONApp = () => {
  const [balance, setBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [yieldRate, setYieldRate] = useState(0.01);
  const [lastYieldTimestamp, setLastYieldTimestamp] = useState(Date.now());
  const [strategy, setStrategy] = useState('balanced');

  const calculateYield = useCallback(() => {
    const now = Date.now();
    const daysPassed = (now - lastYieldTimestamp) / (1000 * 60 * 60 * 24);
    const yieldAmount = stakedBalance * (yieldRate * daysPassed);
    setStakedBalance(prev => prev + yieldAmount);
    setLastYieldTimestamp(now);
  }, [stakedBalance, yieldRate, lastYieldTimestamp]);

  useEffect(() => {
    const timer = setInterval(calculateYield, 60000);
    return () => clearInterval(timer);
  }, [calculateYield]);

  const handleTap = useCallback(() => {
    const gain = 1 * multiplier;
    setBalance(prevBalance => {
      const newBalance = prevBalance + gain;
      return parseFloat(newBalance.toFixed(2));
    });
    setProgress(prevProgress => {
      const newProgress = (prevProgress + 5) % 100;
      if (newProgress < prevProgress) {
        setLevel(prevLevel => prevLevel + 1);
        setMultiplier(prevMultiplier => parseFloat((prevMultiplier * 1.1).toFixed(2)));
      }
      return newProgress;
    });
  }, [multiplier]);

  const handleStake = useCallback(() => {
    calculateYield();
    setStakedBalance(prev => prev + balance);
    setBalance(0);
  }, [balance, calculateYield]);

  const handleUnstake = useCallback(() => {
    calculateYield();
    setBalance(prev => prev + stakedBalance);
    setStakedBalance(0);
  }, [stakedBalance, calculateYield]);

  const handleWithdraw = useCallback(() => {
    alert(`Withdrawing ${balance.toFixed(2)} TON`);
    setBalance(0);
  }, [balance]);

  const handleStrategyChange = useCallback((newStrategy: React.SetStateAction<string>) => {
    setStrategy(newStrategy);
    switch (newStrategy) {
      case 'aggressive':
        setYieldRate(0.02);
        break;
      case 'balanced':
        setYieldRate(0.01);
        break;
      case 'conservative':
        setYieldRate(0.005);
        break;
    }
  }, []);

  const totalBalance = balance + stakedBalance;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0088CC, #005A8C)',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '22rem',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold', color: '#0088CC' }}>reTON</h1>
        <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#005A8C' }}>
          Total: {totalBalance.toFixed(2)} TON
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>
          Available: {balance.toFixed(2)} TON<br/>
          Staked: {stakedBalance.toFixed(2)} TON
        </div>
        <button 
          onClick={handleTap}
          style={{
            width: '10rem',
            height: '10rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0088CC, #005A8C)',
            border: 'none',
            fontSize: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          💎
        </button>
        <div style={{ width: '100%', backgroundColor: '#E0E0E0', height: '0.5rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>
          <div style={{ width: `${progress}%`, backgroundColor: '#0088CC', height: '100%', borderRadius: '0.25rem', transition: 'width 0.3s ease-in-out' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#333' }}>
          <span>Level: {level}</span>
          <span>Multiplier: x{multiplier.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={handleStake} style={{ flex: 1, marginRight: '0.5rem', padding: '0.75rem', backgroundColor: '#0088CC', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color 0.3s' }}>
            Stake
          </button>
          <button onClick={handleUnstake} style={{ flex: 1, marginLeft: '0.5rem', padding: '0.75rem', backgroundColor: '#005A8C', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color 0.3s' }}>
            Unstake
          </button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Investment Strategy:</label>
          <select 
            value={strategy} 
            onChange={(e) => handleStrategyChange(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #0088CC', color: '#333' }}
          >
            <option value="aggressive">Aggressive (2% daily, higher risk)</option>
            <option value="balanced">Balanced (1% daily, moderate risk)</option>
            <option value="conservative">Conservative (0.5% daily, lower risk)</option>
          </select>
        </div>
        <button
          onClick={handleWithdraw}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#00A86B',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default ReTONApp;
