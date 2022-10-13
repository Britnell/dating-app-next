import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout from "comp/Layout";

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <h2>WElcome</h2>
        <Link href="/app">Go to the App</Link>
      </div>
    </Layout>
  );
}
