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

const ChristmasLoader = () => {
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem(Math.floor(Math.random() * christmasItems.length));
    }, 2000); // Change toutes les 2 secondes

    return () => clearInterval(interval);
  }, []);

  const item = christmasItems[currentItem];

  return (
    <div className={styles.loaderContainer}>
      <div className={`${styles.christmasItem} ${item.animation}`}>
        <img src={item.image} alt={item.name} className={styles.itemImage} />
      </div>
      <p className={styles.loadingText}>Loading Christmas Markets...</p>
      <div className={styles.snowflakes}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.snowflake}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
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
