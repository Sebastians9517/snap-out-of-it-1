import React, { useState } from "react";
import "./Snake.css";
import GameOver from "./GameOver.jsx";

function SnakeGame() {
  state = {}

    handleKeyDown = handleKeyDown.bind(this);

    state = {
      width: 0,
      height: 0,
      blockWidth: 0,
      blockHeight: 0,
      gameLoopTimeout: 400,
      timeoutId: 0,
      startSnakeSize: 0,
      snake: [],
      apple: {},
      direction: "right",
      directionChanged: false,
      isGameOver: false,
      snakeColor: props.snakeColor || getRandomColor(),
      appleColor: props.appleColor || getRandomColor(),
      score: 0,
      highScore: Number(localStorage.getItem("snakeHighScore")) || 0,
      newHighScore: false,

  }

  const componentDidMount = () => {
    initGame();
    window.addEventListener("keydown", handleKeyDown);
    gameLoop();
  }

  const initGame = () => {
    // Game size initialization
    let percentageWidth = props.percentageWidth || 45;
    let width =
      document.getElementById("GameBoard").parentElement.offsetWidth *
      (percentageWidth / 100);
    width -= width % 30;
    if (width < 30) width = 35;
    let height = (width / 3) * 2;
    let blockWidth = width / 30;
    let blockHeight = height / 20;

    // snake initialization
    let startSnakeSize = props.startSnakeSize || 6;
    let snake = [];
    let Xpos = width / 2;
    let Ypos = height / 2;
    let snakeHead = { Xpos: width / 2, Ypos: height / 2 };
    snake.push(snakeHead);
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= blockWidth;
      let snakePart = { Xpos: Xpos, Ypos: Ypos };
      snake.push(snakePart);
    }

    // apple position initialization
    let appleXpos =
      Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth;
    let appleYpos =
      Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight;
    while (appleYpos === snake[0].Ypos) {
      appleYpos =
        Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight;
    }

    setState({
      width,
      height,
      blockWidth,
      blockHeight,
      startSnakeSize,
      snake,
      apple: { Xpos: appleXpos, Ypos: appleYpos },
    });
  }

  const gameLoop = () => {
    let timeoutId = setTimeout(() => {
      if (!isGameOver) {
        moveSnake();
        tryToEatSnake();
        tryToEatApple();
        setState({ directionChanged: false });
      }

      gameLoop();
    }, gameLoopTimeout);

    setState({ timeoutId });
  }

  const componentWillUnmount = () => {
    clearTimeout(timeoutId);
    window.removeEventListener("keydown", handleKeyDown);
  }

  const resetGame = () => {
    let width = width;
    let height = height;
    let blockWidth = blockWidth;
    let blockHeight = blockHeight;
    let apple = apple;

    // snake reset
    let snake = [];
    let Xpos = width / 2;
    let Ypos = height / 2;
    let snakeHead = { Xpos: width / 2, Ypos: height / 2 };
    snake.push(snakeHead);
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= blockWidth;
      let snakePart = { Xpos: Xpos, Ypos: Ypos };
      snake.push(snakePart);
    }

    // apple position reset
    apple.Xpos =
      Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth;
    apple.Ypos =
      Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight;
    while (isAppleOnSnake(apple.Xpos, apple.Ypos)) {
      apple.Xpos =
        Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
        blockWidth;
      apple.Ypos =
        Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight;
    }

    setState({
      snake,
      apple,
      direction: "right",
      directionChanged: false,
      isGameOver: false,
      gameLoopTimeout: 400,
      snakeColor: getRandomColor(),
      appleColor: getRandomColor(),
      score: 0,
      newHighScore: false,
    });
  }

  const getRandomColor = () => {
    let hexa = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) color += hexa[Math.floor(Math.random() * 16)];
    return color;
  }

  const moveSnake = () => {
    let snake = snake;
    let previousPartX = snake[0].Xpos;
    let previousPartY = snake[0].Ypos;
    let tmpPartX = previousPartX;
    let tmpPartY = previousPartY;
    moveHead();
    for (let i = 1; i < snake.length; i++) {
      tmpPartX = snake[i].Xpos;
      tmpPartY = snake[i].Ypos;
      snake[i].Xpos = previousPartX;
      snake[i].Ypos = previousPartY;
      previousPartX = tmpPartX;
      previousPartY = tmpPartY;
    }
    setState({ snake });
  }

  const tryToEatApple = () => {
    let snake = snake;
    let apple = apple;

    // if the snake's head is on an apple
    if (snake[0].Xpos === apple.Xpos && snake[0].Ypos === apple.Ypos) {
      let width = width;
      let height = height;
      let blockWidth = blockWidth;
      let blockHeight = blockHeight;
      let newTail = { Xpos: apple.Xpos, Ypos: apple.Ypos };
      let highScore = highScore;
      let newHighScore = newHighScore;
      let gameLoopTimeout = gameLoopTimeout;

      // increase snake size
      snake.push(newTail);

      // create another apple
      apple.Xpos =
        Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
        blockWidth;
      apple.Ypos =
        Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight;
      while (isAppleOnSnake(apple.Xpos, apple.Ypos)) {
        apple.Xpos =
          Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
          blockWidth;
        apple.Ypos =
          Math.floor(
            Math.random() * ((height - blockHeight) / blockHeight + 1)
          ) * blockHeight;
      }

      // increment high score if needed
      if (score === highScore) {
        highScore++;
        localStorage.setItem("snakeHighScore", highScore);
        newHighScore = true;
      }

      // decrease the game loop timeout
      if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5;

      setState({
        snake,
        apple,
        score: score + 1,
        highScore,
        newHighScore,
        gameLoopTimeout,
      });
    }
  }

  const tryToEatSnake = () => {
    let snake = snake;

    for (let i = 1; i < snake.length; i++) {
      if (snake[0].Xpos === snake[i].Xpos && snake[0].Ypos === snake[i].Ypos)
        setState({ isGameOver: true });
    }
  }

  const isAppleOnSnake = (appleXpos, appleYpos) => {
    let snake = snake;
    for (let i = 0; i < snake.length; i++) {
      if (appleXpos === snake[i].Xpos && appleYpos === snake[i].Ypos)
        return true;
    }
    return false;
  }

  const moveHead = () => {
    switch (direction) {
      case "left":
        moveHeadLeft();
        break;
      case "up":
        moveHeadUp();
        break;
      case "right":
        moveHeadRight();
        break;
      default:
        moveHeadDown();
    }
  }

  const moveHeadLeft = () => {
    let width = width;
    let blockWidth = blockWidth;
    let snake = snake;
    snake[0].Xpos =
      snake[0].Xpos <= 0 ? width - blockWidth : snake[0].Xpos - blockWidth;
    setState({ snake });
  }

  const moveHeadUp = () => {
    let height = height;
    let blockHeight = blockHeight;
    let snake = snake;
    snake[0].Ypos =
      snake[0].Ypos <= 0 ? height - blockHeight : snake[0].Ypos - blockHeight;
    setState({ snake });
  }

  const moveHeadRight = () => {
    let width = width;
    let blockWidth = blockWidth;
    let snake = snake;
    snake[0].Xpos =
      snake[0].Xpos >= width - blockWidth ? 0 : snake[0].Xpos + blockWidth;
    setState({ snake });
  }

  const moveHeadDown = () => {
    let height = height;
    let blockHeight = blockHeight;
    let snake = snake;
    snake[0].Ypos =
      snake[0].Ypos >= height - blockHeight ? 0 : snake[0].Ypos + blockHeight;
    setState({ snake });
  }

  const handleKeyDown = (event) => {
    // if spacebar is pressed to run a new game
    if (isGameOver && event.keyCode === 32) {
      resetGame();
      return;
    }

    if (directionChanged) return;

    switch (event.keyCode) {
      case 37:
      case 65:
        goLeft();
        break;
      case 38:
      case 87:
        goUp();
        break;
      case 39:
      case 68:
        goRight();
        break;
      case 40:
      case 83:
        goDown();
        break;
      default:
    }
    setState({ directionChanged: true });
  }

  const goLeft = () => {
    let newDirection = direction === "right" ? "right" : "left";
    setState({ direction: newDirection });
  }

  const goUp = () => {
    let newDirection = direction === "down" ? "down" : "up";
    setState({ direction: newDirection });
  }

  const goRight = () => {
    let newDirection = direction === "left" ? "left" : "right";
    setState({ direction: newDirection });
  }

  const goDown = () => {
    let newDirection = direction === "up" ? "up" : "down";
    setState({ direction: newDirection });
  }


    // Game over
    if (isGameOver) {
      return (
        <GameOver
          width={width}
          height={height}
          highScore={highScore}
          newHighScore={newHighScore}
          score={score}
        />
      );
    }

    return (
      <div
        id="GameBoard"
        style={{
          width: width + 20,
          height: height + 20,
          borderWidth: width / 75,
        }}
      >
        {snake.map((snakePart, index) => {
          return (
            <div
              key={index}
              className="Block"
              style={{
                width: blockWidth,
                height: blockHeight,
                left: snakePart.Xpos,
                top: snakePart.Ypos,
                background: snakeColor,
              }}
            />
          );
        })}
        <div
          className="Block"
          style={{
            width: blockWidth,
            height: blockHeight,
            left: apple.Xpos,
            top: apple.Ypos,
            background: appleColor,
          }}
        />
        <div id="Score" style={{ fontSize: width / 20 }}>
          HIGH-SCORE: {highScore}&ensp;&ensp;&ensp;&ensp;SCORE:{" "}
          {score}
        </div>
        <div class="controls">
          <button
            class="control-button"
            id="left"
            onClick={() => goLeft()}
          >
            ⬅
          </button>
          <button class="control-button" id="up" onClick={() => goUp()}>
            ⬆
          </button>
          <button
            class="control-button"
            id="down"
            onClick={() => goDown()}
          >
            ⬇
          </button>
          <button
            class="control-button"
            id="right"
            onClick={() => goRight()}
          >
            ➡
          </button>
        </div>
      </div>
    );

}

export default SnakeGame;
