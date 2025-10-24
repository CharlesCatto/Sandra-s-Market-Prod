import styles from "./Footer.module.css";
import facebook from "../../assets/img/facebook.png";
import facebookYellow from "../../assets/img/facebookYellow.png";
import instagram from "../../assets/img/instagram.png";
import instagramYellow from "../../assets/img/instagramYellow.png";
import linkedin from "../../assets/img/linkedin.png";
import linkedinYellow from "../../assets/img/linkedinYellow.png";
import twitter from "../../assets/img/twitter.png";
import twitterYellow from "../../assets/img/twitterYellow.png";

function Footer() {
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLImageElement>,
    newSrc: string,
  ) => {
    e.currentTarget.src = newSrc;
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLImageElement>,
    originalSrc: string,
  ) => {
    e.currentTarget.src = originalSrc;
  };

  return (
    <section>
      <footer className={styles.footer}>
        <div className={styles.container_icon}>
          <a href="_">
            <img
              src={facebook}
              alt="icon facebook"
              className={styles.social_icon}
              onMouseEnter={(e) => handleMouseEnter(e, facebookYellow)}
              onMouseLeave={(e) => handleMouseLeave(e, facebook)}
            />
          </a>
          <a href="_">
            <img
              src={instagram}
              alt="icon instagram"
              className={styles.social_icon}
              onMouseEnter={(e) => handleMouseEnter(e, instagramYellow)}
              onMouseLeave={(e) => handleMouseLeave(e, instagram)}
            />
          </a>
          <a href="_">
            <img
              src={linkedin}
              alt="icon linkedin"
              className={styles.social_icon}
              onMouseEnter={(e) => handleMouseEnter(e, linkedinYellow)}
              onMouseLeave={(e) => handleMouseLeave(e, linkedin)}
            />
          </a>
          <a href="_">
            <img
              src={twitter}
              alt="icon twitter"
              className={styles.social_icon}
              onMouseEnter={(e) => handleMouseEnter(e, twitterYellow)}
              onMouseLeave={(e) => handleMouseLeave(e, twitter)}
            />
          </a>
        </div>
        <p className={styles.creators}>Sandra's Market @2025</p>
      </footer>
    </section>
  );
}

export default Footer;
