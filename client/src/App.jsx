import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import Game from "./components/Game/Game.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
function App() {
    return (
        <div className="App">
            <h1>Matching Game</h1>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game/:mode/:roomId" element={<Game />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
