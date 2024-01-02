import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const URL = "https://deckofcardsapi.com/api/deck";

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [draw, setDraw] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    async function getDeck() {
      let res = await axios.get(`${URL}/new/shuffle/`);
      setDeck(res.data);
    }
    getDeck();
  }, [setDeck]);

  useEffect(() => {
    async function getCard() {
      const { deck_id } = deck;
      try {
        let card = await axios.get(`${URL}/${deck_id}/draw/`);

        if (card.data.remaining === 0) {
          setAutoDraw(false);
          alert("Error: no cards remaining!");
        }
        const res = card.data.cards[0];
        setDraw((data) => [
          ...data,
          {
            id: res.code,
            name: res.suit + " " + res.value,
            image: res.image,
          },
        ]);
      } catch (err) {
        alert(err);
      }
    }
    if (autoDraw && !timer.current) {
      timer.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [deck, autoDraw, setAutoDraw]);

  const cards = draw.map((card) => (
    <Card key={card.id} name={card.name} image={card.image} />
  ));

  const toggleBtn = () => {
    setAutoDraw((d) => !d);
  };
  const newShuffle = async () => {
    let res = await axios.get(`${URL}/new/shuffle/`);
    setDeck(res.data);
    setDraw([]);
    setAutoDraw(false);
  };

  return (
    <div>
      {deck ? (
        <div>
          <button className="Deck-btn" onClick={toggleBtn}>
            {autoDraw ? "Stop drawing" : "Start drawing"}
          </button>
          <button className="Deck-btn" onClick={newShuffle}>
            New shuffle
          </button>
        </div>
      ) : null}
      <div className="Card-area">{cards}</div>
    </div>
  );
};

export default Deck;
