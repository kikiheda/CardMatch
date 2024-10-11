import "./Card.scss";

const Card = ({ card, handleClick, isFlipped, isMatched }) => {
    const handleCardClick = () => {
        if (!isFlipped && !isMatched) {
            handleClick(card);
        }
    };

    return (
        <div
            className={`card ${isFlipped ? "flipped" : ""} ${
                isMatched ? "matched" : ""
            }`}
            onClick={handleCardClick}
        >
            <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">
                    <img
                        src={`http://localhost:8080/${card.url}`}
                        alt={card.alt}
                    />
                </div>
            </div>
        </div>
    );
};

export default Card;
