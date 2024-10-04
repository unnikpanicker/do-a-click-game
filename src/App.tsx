import React, { useState, useEffect } from "react";
import ThemeSwitch from "./components/ThemeSwitch";

const App: React.FC = () => {
  const [buttonPosition, setButtonPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({
    x: Math.floor(Math.random() * window.innerWidth),
    y: Math.floor(Math.random() * window.innerHeight),
  });
  const [gameStartTime, setGameStartTime] = useState<number>();
  const [gameEndTime, setGameEndTime] = useState<number>();
  const [gameWon, setGameWon] = useState(false);
  const [realButtonRevealed, setRealButtonRevealed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (
      Math.abs(mousePosition.x - targetPosition.x) < 20 &&
      Math.abs(mousePosition.y - targetPosition.y) < 20 &&
      !realButtonRevealed
    ) {
      setButtonPosition({
        top: `${targetPosition.y}px`,
        left: `${targetPosition.x}px`,
      });
      setRealButtonRevealed(true);
    }
  }, [mousePosition, targetPosition, realButtonRevealed]);

  const startGame = () => {
    setGameStartTime(Date.now());
    setGameStarted(true);
  };

  const randomizeButtonPosition = () => {
    if (!realButtonRevealed) {
      const newTop = Math.random() * 90 + "%";
      const newLeft = Math.random() * 90 + "%";
      setButtonPosition({ top: newTop, left: newLeft });
    }
  };

  const handleButtonClick = () => {
    if (realButtonRevealed) {
      setGameWon(true);
      setGameEndTime(Date.now());
    }
  };

  const handlePlayAgain = () => {
    setButtonPosition({ top: "50%", left: "50%" });
    setMousePosition({ x: 0, y: 0 });
    setTargetPosition({
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight),
    });
    setGameWon(false);
    setGameStartTime(0);
    setGameEndTime(0);
    setRealButtonRevealed(false);
    setGameStarted(false);
  };

  const totalTime =
    gameEndTime && gameStartTime
      ? ((gameEndTime - gameStartTime) / 1000).toFixed(2)
      : null;

  return (
    <div
      className={`w-screen h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 relative`}
    >
      <h1 className="absolute top-5 text-2xl font-bold text-gray-400 dark:text-gray-700">
        {gameWon ? `You won in ${totalTime} seconds!` : "Do A Click"}
      </h1>

      {!gameStarted ? (
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-700"
          onClick={startGame}
        >
          Start Game
        </button>
      ) : gameWon ? (
        <button
          className="absolute bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-green-700"
          onClick={handlePlayAgain}
        >
          Play Again
        </button>
      ) : (
        <>
          <div className="fixed bottom-6 left-6 text-lg text-gray-300 dark:text-gray-700">
            ({targetPosition.x}, {targetPosition.y})
          </div>

          {/* <div className="absolute bottom-5 text-lg text-gray-700 dark:text-gray-300">
            Current Mouse Coordinates: ({mousePosition.x}, {mousePosition.y})
          </div> */}

          <button
            className="absolute bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-500 -translate-x-2/4 -translate-y-2/4"
            style={{ top: buttonPosition.top, left: buttonPosition.left }}
            onMouseEnter={randomizeButtonPosition}
            onClick={handleButtonClick}
          >
            {realButtonRevealed ? "Caught Me!" : "Catch Me!"}
          </button>
        </>
      )}
      <div className="fixed bottom-6 right-6">
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default App;
