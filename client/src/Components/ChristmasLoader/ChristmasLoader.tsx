import { useState, useEffect } from "react";
import styles from "./ChristmasLoader.module.css";

// Images de Noël
import starImage from "../../assets/img/christmas/star.png";
import santaImage from "../../assets/img/christmas/santa.png";
import pineImage from "../../assets/img/christmas/pine.png";
import snowflakeImage from "../../assets/img/christmas/snowflake.png";
import giftImage from "../../assets/img/christmas/gift.png";

const christmasItems = [
  { image: starImage, name: "star", animation: styles.starAnimation },
  { image: santaImage, name: "santa", animation: styles.santaAnimation },
  { image: pineImage, name: "pine", animation: styles.pineAnimation },
  {
    image: snowflakeImage,
    name: "snowflake",
    animation: styles.snowflakeAnimation,
  },
  { image: giftImage, name: "gift", animation: styles.giftAnimation },
];

// Générer des IDs uniques pour les flocons de neige
const generateSnowflakes = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `snowflake-${index}-${Date.now()}-${Math.random()}`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 10}s`,
  }));
};

const ChristmasLoader = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const [snowflakes, setSnowflakes] = useState(() => generateSnowflakes(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem(Math.floor(Math.random() * christmasItems.length));
    }, 2000); // Change toutes les 2 secondes

    return () => clearInterval(interval);
  }, []);

  // Régénérer les flocons si le composant est remonté
  useEffect(() => {
    setSnowflakes(generateSnowflakes(20));
  }, []);

  const item = christmasItems[currentItem];

  return (
    <div className={styles.loaderContainer}>
      <div className={`${styles.christmasItem} ${item.animation}`}>
        <img src={item.image} alt={item.name} className={styles.itemImage} />
      </div>
      <p className={styles.loadingText}>Loading Christmas Markets...</p>
      <div className={styles.snowflakes}>
        {snowflakes.map((snowflake) => (
          <div
            key={snowflake.id}
            className={styles.snowflake}
            style={{
              left: snowflake.left,
              animationDelay: snowflake.animationDelay,
              animationDuration: snowflake.animationDuration,
            }}
          >
            ❄
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChristmasLoader;
