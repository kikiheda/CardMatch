import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Card from "../Card/Card.jsx";
import "./Game.scss";
import Modal from "../Modal/Modal.jsx";

const socket = io("http://localhost:8080");

const Game = () => {
    const { mode, roomId } = useParams();
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [initialFlip, setInitialFlip] = useState(mode === "one-player");
    const [timer, setTimer] = useState(mode === "one-player" ? 5 : 0);
    const [turns, setTurns] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState("");
    const [numMatched, setNumMatched] = useState(0);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const getCards = async () => {
        try {
            let response = await axios.get("http://localhost:8080/cards");
            setCards(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (mode === "two-player") {
            socket.emit("joinRoom", roomId);

            socket.on("initialize", (initialData) => {
                const newArray = [...initialData];
                setCards(newArray);
            });

            socket.on("flip", (card) => {
                setFlippedCards((prev) => [...prev, card]);
            });

            socket.on("match", (matched) => {
                setMatchedCards((prev) => [...prev, ...matched]);
                setFlippedCards([]);
            });

            return () => {
                socket.off("initialize");
                socket.off("flip");
                socket.off("match");
            };
        } else {
            getCards();

            const timerInterval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(timerInterval);
                        setInitialFlip(false);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [mode, roomId]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstCard, secondCard] = flippedCards;
            if (firstCard.alt === secondCard.alt) {
                const matched = [firstCard.id, secondCard.id];
                if (mode === "two-player") {
                    socket.emit("match", roomId, matched);
                }
                setMatchedCards((prev) => [...prev, ...matched]);
                setNumMatched(numMatched + 1);
                setFlippedCards([]);
            } else {
                setTimeout(() => setFlippedCards([]), 2000);
                setTurns(turns + 1);
            }
        }

        if (numMatched === 8) {
            setGameOver(true);
        }
    }, [flippedCards, matchedCards, mode, roomId]);

    const handleCardClick = (card) => {
        if (
            !initialFlip &&
            flippedCards.length < 2 &&
            !flippedCards.includes(card) &&
            !matchedCards.includes(card.id)
        ) {
            if (mode === "two-player") {
                socket.emit("flip", roomId, card);
            }
            setFlippedCards((prev) => [...prev, card]);
        }
    };

    const postScore = async () => {
        try {
            await axios.post(`http://localhost:8080/scores`, {
                name: name,
                turns: turns,
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleName = (event) => {
        setName(event.target.value);
    };

    const submitForm = () => {
        postScore();
        navigate("/");
    };

    const closeModal = () => {
        console.log("in");
        navigate("/");
    };

    return (
        <div className="game-section">
            <div>Turns: {turns}</div>
               {mode === "one-player" && initialFlip && (
                    <div className="timer">Time left: {timer}s</div>
                )}
            <div className="game">
             
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        handleClick={handleCardClick}
                        isFlipped={
                            initialFlip ||
                            flippedCards.includes(card) ||
                            matchedCards.includes(card.id)
                        }
                        isMatched={matchedCards.includes(card.id)}
                    />
                ))}
            </div>
            <Modal isOpen={gameOver} onClose={closeModal}>
                <h2>Game Over</h2>
                <p>
                    {mode === "two-player"
                        ? `Winner: ${winner}`
                        : "You've completed the game!"}
                </p>
                <p>Turns: {turns}</p>
                <form onSubmit={submitForm}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={handleName}
                        required
                    ></input>
                    <button type="submit">Submit Score</button>
                </form>
                <button onClick={closeModal}>Return to Home</button>
            </Modal>
        </div>
    );
};

export default Game;
