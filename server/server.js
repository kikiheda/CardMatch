import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import cardRoutes from "./routes/cards.js";
import scoreRoutes from "./routes/scores.js";

const port = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/cards", cardRoutes);
app.use("/scores", scoreRoutes);

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

const cardData = readData();
let cards = shuffleCards([...cardData]);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        io.to(room).emit("initialize", cards);
    });

    socket.on("flip", (room, card) => {
        io.to(room).emit("flip", card);
    });

    socket.on("match", (room, matchedCards) => {
        io.to(room).emit("match", matchedCards);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

server.listen(port, () => {
    console.log(`Listening on PORT ${port}.`);
});
