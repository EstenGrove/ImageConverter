import { useLayoutEffect, useRef } from "react";

const useLockBodyScroll = () => {
	useLayoutEffect(() => {
		// Get original value of body overflow
		const originalStyle = window.getComputedStyle(document.body).overflow;
		// Prevent scrolling on mount
		document.body.style.overflow = "hidden";
		// Re-enable scrolling when component unmounts
		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, []);
};

// A more controllable hook for locking the body.style.overflow property
const useLockBodyScrollControlled = () => {
	const isLocked = useRef<boolean>(false);
	const originOverflow = useRef<string>(
		window.getComputedStyle(document.body).overflow
	);

	const lockBody = () => {
		document.body.style.overflow = "hidden";
		isLocked.current = true;
	};
	const unlockBody = () => {
		document.body.style.overflow = originOverflow.current;
		isLocked.current = false;
	};

	return {
		isLocked: isLocked.current,
		lock: lockBody,
		unlock: unlockBody,
	};
};

export { useLockBodyScroll, useLockBodyScrollControlled };
