import styles from "./FullScreenLoader.module.css";

const FullScreenLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.snowflake}>
        <div className={styles.inner} />
      </div>
      <p className={styles.loadingText}>Loading Christmas Markets...</p>
    </div>
  );
};

export default FullScreenLoader;
