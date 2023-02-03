import styles from './Logo.module.css';

export default function Logo() {
	return (
		<h1 className={styles.logo}>
			<span className={styles.furi} lang="ja">
				クリスチャン・デボットン
			</span>
			<span className={styles.name}>Christian</span>
			<span className={styles.name}>
				<small className={styles.small}>de</small>Botton
			</span>
		</h1>
	);
}
