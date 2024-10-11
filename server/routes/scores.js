import express from "express";
import fs from "fs";

const router = express.Router();

const readData = () => {
    const scoresData = fs.readFileSync("./data/scores.json");
    const parsedData = JSON.parse(scoresData);
    return parsedData;
};

router.get("/", (_req, res) => {
    const scores = readData();
    res.status(200).json(scores);
});

router.post("/", (req, res) => {
    const { name, turns } = req.body;
    const newScore = {
        name: name,
        moves: turns,
    };

    const scores = readData();
    scores.push(newScore);
    fs.writeFileSync("./data/scores.json", JSON.stringify(scores));

    res.status(201).json(newScore);
});

export default router;
