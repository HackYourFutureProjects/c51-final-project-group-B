import { Link } from "react-router-dom";
import styles from "./error.module.css";
import ErrorImage from "../../assets/error.png";
const ErrorArea = () => {
  return (
    <div className={styles.errorArea}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.colXL8}>
            <div className={styles.errorImg}>
              <img src={ErrorImage} alt="Error Illustration" />
            </div>
            <div className={styles.textCenter}>
              <h3 className={styles.errorTitle}>Opps! Page Not Found</h3>
              <p className={styles.text}>
                Sorry This Page Not found take a look at our most popular
              </p>
              <Link to="/" className={styles.themeBtn}>
                GO TO HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorArea;
