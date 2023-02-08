import { formatDistance } from 'date-fns';
import Link from 'next/link';

import styles from './page.module.css';

import { getBlogPosts } from '@/lib/docs';

export default function Home() {
	let posts = getBlogPosts();

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
					<strong>platform</strong>, <strong>product</strong>, and{' '}
					<strong>user experience</strong> engineering teams as both an
					engineering manager and an individual contributor.
				</p>
			</div>
			<div className={styles.posts}>
				{posts.map((post) => (
					<article className={styles.post} key={post._id}>
						<Link className={styles.postLink} href={post.slug}>
							<h2 className={styles.postTitle}>{post.title}</h2>
							<span className={styles.postDate}>
								{formatDistance(new Date(post.date), new Date(), {
									addSuffix: true,
								})}
							</span>
							<span className={styles.postDescription}>{post.description}</span>
						</Link>
					</article>
				))}
			</div>
		</div>
	);
}
