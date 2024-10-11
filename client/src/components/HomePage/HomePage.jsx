import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
    const [scores, setScores] = useState([]);

    const createRoomId = () => {
        return Math.random().toString(36).substring(7);
    };

    const navigate = useNavigate();
    const handleModeSelection = (selectedMode) => {
        navigate(`/game/${selectedMode}/${createRoomId()}`);
    };

    const getScores = async () => {
        try {
            let response = await axios.get("http://localhost:8080/scores");
            let scores = response.data;
            scores.sort(function (a, b) {
                return a.moves - b.moves;
            });
            setScores(scores);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getScores();
    }, []);

    useEffect(() => {
        scores.sort(function (a, b) {
            return a.moves - b.moves;
        });
        console.log(scores);
    }, [scores]);

    if (!scores.length) {
        return <>Loading</>;
    }
    return (
        <>
            <div>
                {/* <p>Select an option</p> */}

                <div>
                    <button onClick={() => handleModeSelection("one-player")}>
                       One Player
                    </button>
                    <button onClick={() => handleModeSelection("two-player")}>
                        Two Players
                    </button>
                </div>
            </div>
            <div>
                <p>Leader Board</p>
                {scores.map((score) => {
                    return (
                        <p>
                            {score.name} : {score.moves}
                        </p>
                    );
                })}
            </div>
        </>
    );
};

export default HomePage;
