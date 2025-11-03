import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.snowflake}>
        <div className={styles.inner} />
      </div>
      <p className={styles.loadingText}>Chargement des marchés de Noël...</p>
    </div>
  );
};

export default LoadingSpinner;
