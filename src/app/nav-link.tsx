'use client';

import { cva, cx } from 'class-variance-authority';
import { AnimatePresence, type Variants, motion } from 'framer-motion';
import NextLink from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

const linkStyles = cva('relative pb-[1px] tracking-tight font-medium', {
	variants: {
		active: {
			true: '',
		},
	},
	defaultVariants: {
		active: false,
	},
});

const Link = motion(NextLink);

const indicatorAnimations: Variants = {
	initial: {
		opacity: 0,
	},
	enter: {
		opacity: 1,
	},
	exit: {
		opacity: 0,
	},
};

export default function NavLink({
	href,
	children,
	className,
	exact = false,
	...rest
}: React.ComponentProps<typeof Link> & { exact?: boolean }) {
	let segment = `/${useSelectedLayoutSegment()}` ?? '';
	let active = exact ? segment === href : href.toString().startsWith(segment);

	return (
		<Link
			href={href}
			className={cx(linkStyles({ active }), className)}
			{...rest}
		>
			{children}
			<AnimatePresence initial={false}>
				{active && (
					<motion.span
						className="bg-indigo-11 absolute bottom-0 left-0 h-[2px] w-full"
						layoutId="nav-link.active-indicator"
						initial="initial"
						animate="enter"
						exit="exit"
						variants={indicatorAnimations}
					/>
				)}
			</AnimatePresence>
		</Link>
	);
}
