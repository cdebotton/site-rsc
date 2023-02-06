import styles from './page.module.css';

export default function Home() {
	return (
		<div className={styles.container}>
			<div className={styles.intro}>
				<h2 className={styles.heading}>Oh,{'\n'}Hello!</h2>
				<p>
					My name&apos;s <strong>Christian</strong> and I&apos;m a software
					engineer based in San Francisco.
				</p>
				<p>
					Over my decade-and-a-half long career, I&apos;ve worked on{' '}
					<strong>platform</strong>,<strong>product</strong>, and{' '}
					<strong>user experience</strong> engineering teams as both an
					engineering manager and an individual contributor.
				</p>
			</div>
		</div>
	);
}
