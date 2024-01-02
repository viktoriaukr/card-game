import React, { useState } from "react";

const Card = ({ name, image }) => {
  const [{ angle, randomX, randomY }] = useState({
    angle: Math.random() * 90 - 45,
    randomX: Math.random() * 40 - 20,
    randomY: Math.random() * 40 - 20,
  });

  const transform = `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`;

  return <img alt={name} src={image} style={{ transform }} />;
};
export default Card;
