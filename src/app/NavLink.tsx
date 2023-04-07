'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const indicatorVariants: Variants = {
	initial: { scaleX: 0 },
	enter: { scaleX: 1 },
	exit: { scaleX: 0 },
};

export default function NavLink({
	children,
	exact = false,
	...props
}: React.ComponentProps<typeof Link> & { exact?: boolean }) {
	let pathname = usePathname();
	let isActive = exact
		? pathname === props.href
		: pathname.startsWith(props.href.toString());

	return (
		<Link {...props}>
			{children}
			<AnimatePresence initial={false}>
				{isActive && <motion.span layoutId="nav-link.indicator" />}
			</AnimatePresence>
		</Link>
	);
}
