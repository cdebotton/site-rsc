import { type VariantProps, cva, cx } from 'class-variance-authority';

const buttonStyles = cva();

type ButtonProps = VariantProps<typeof buttonStyles>;

export default function Button({
	children,
	className,
	...rest
}: React.ComponentProps<'button'> & ButtonProps) {
	return (
		<button className={cx(buttonStyles(), className)} {...rest}>
			{children}
		</button>
	);
}
