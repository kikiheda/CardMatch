import express from "express";
import fs from "fs";

const router = express.Router();

const readData = () => {
    const cardsData = fs.readFileSync("./data/cards.json");
    const parsedData = JSON.parse(cardsData);
    return parsedData;
};

const shuffleCards = (cards) => {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
};

router.get("/", (_req, res) => {
    const cardData = readData();
    let cards = shuffleCards([...cardData]);
    res.status(200).json(cards);
});

export default router;
