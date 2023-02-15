import React from "react";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";

import Link from "./components/Link";

import { initializeChain } from "./common/utils";
import { ActivePlayer } from "./domain/activePlayer";

const App: React.FC = () => {
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [activePlayer, setActivePlayer] = useState(ActivePlayer.PLAYER_ONE);
  const [linkValues, setLinkValues] = useState(initializeChain());
  const handleClick = (linkIndex: number) => {
    if (linkIndex === 0 || linkIndex === linkValues.length - 1) {
      if (activePlayer === ActivePlayer.PLAYER_ONE) {
        setP1Score(p1Score + linkValues[linkIndex]);
        setActivePlayer(ActivePlayer.PLAYER_TWO);
      } else {
        setP2Score(p2Score + linkValues[linkIndex]);
        setActivePlayer(ActivePlayer.PLAYER_ONE);
      }
      if (linkIndex === 0) {
        setLinkValues(linkValues.slice(1));
      } else {
        setLinkValues(linkValues.slice(0, -1));
      }
    }
  };
  const resetGame = () => {
    setActivePlayer(ActivePlayer.PLAYER_ONE);
    setP1Score(0);
    setP2Score(0);
    setLinkValues(initializeChain());
  };
  return (
    <Container className="p-3">
      <Jumbotron>
        <h1 className="header">Links Game</h1>
        <h3>
          Starting with Player 1, alternate selecting either the first or last
          link from the chain. The player with the highest score after all links
          have been selected wins!
        </h3>
      </Jumbotron>
      <h2>
        <Button variant="primary" className="mr-1">
          Player 1: {p1Score}
        </Button>
        <Button variant="primary" className="mr-1">
          Player 2: {p2Score}
        </Button>
      </h2>
      <Container className="p-4">
        {linkValues.length > 0 ? (
          <h2 className="row">
            {linkValues.map((linkValue: number, index: number) => {
              return (
                <div key={index} onClick={() => handleClick(index)}>
                  <Link id={index} value={linkValue} />
                </div>
              );
            })}
          </h2>
        ) : (
          <h2>
            {p1Score === p2Score
              ? "It's a tie!"
              : p1Score > p2Score
              ? "Player 1 Wins!"
              : "Player 2 Wins!"}
            <div>
              <Button
                variant="secondary"
                className="mr-1"
                onClick={() => resetGame()}
              >
                Play Again?
              </Button>
            </div>
          </h2>
        )}
      </Container>
    </Container>
  );
};

export default App;
