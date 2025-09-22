import React, { useState, useEffect } from 'react';
import './App.css';

// Reusable Light component (same as Project 1)
const Light = ({ isOn, color }) => {
  return (
    <div
      className="light"
      style={{
        backgroundColor: isOn ? color : 'gray',
        boxShadow: isOn ? `0 0 20px ${color}` : 'none',
      }}
    ></div>
  );
};

function App() {
  const [phase, setPhase] = useState('idle'); // idle, lighting, green, go, finished
  const [activeLights, setActiveLights] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState(null);
  const totalLights = 5;

  useEffect(() => {
    let interval;
    if (phase === 'lighting') {
      interval = setInterval(() => {
        setActiveLights((prev) => {
          if (prev < totalLights) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setPhase('green');
            return prev;
          }
        });
      }, 1000);
    } else if (phase === 'green') {
      setTimeout(() => {
        setPhase('go');
      }, 1000);
    } else if (phase === 'finished') {
      setTimeout(() => {
        resetRound();
      }, 2000); // Show winner for 2 seconds then reset
    }
    return () => clearInterval(interval);
  }, [phase]);

  const startGame = () => {
    setPhase('lighting');
    setActiveLights(0);
    setWinner(null);
  };

  const handleClick = (player) => {
    if (phase === 'go' && !winner) {
      setWinner(player);
      setScores((prev) => ({
        ...prev,
        [player]: prev[player] + 1,
      }));
      setPhase('finished');
    }
  };

  const resetRound = () => {
    setPhase('idle');
    setActiveLights(0);
    setWinner(null);
  };

  return (
    <div className="App">
      <h1>Jogo de Reflexo</h1>
      <div className="lights-container">
        {Array.from({ length: totalLights }).map((_, index) => {
          if (phase === 'green') {
            return <Light key={index} isOn={true} color="green" />;
          } else if (phase === 'go' || phase === 'finished') {
            return <Light key={index} isOn={false} color="red" />;
          } else {
            return <Light key={index} isOn={index < activeLights} color="red" />;
          }
        })}
      </div>
      {(phase === 'go' || phase === 'finished') && <h2 className="go-text">GO!</h2>}
      {winner && <h3>{winner === 'player1' ? 'Jogador 1' : 'Jogador 2'} venceu a rodada!</h3>}
      <div className="scores">
        <p>Jogador 1: {scores.player1}</p>
        <p>Jogador 2: {scores.player2}</p>
      </div>
      <div className="buttons">
        <button onClick={() => handleClick('player1')} disabled={phase !== 'go' || winner}>
          Jogador 1 Clicar
        </button>
        <button onClick={() => handleClick('player2')} disabled={phase !== 'go' || winner}>
          Jogador 2 Clicar
        </button>
      </div>
      <button onClick={startGame} disabled={phase !== 'idle'}>
        Iniciar Rodada
      </button>
    </div>
  );
}

export default App;