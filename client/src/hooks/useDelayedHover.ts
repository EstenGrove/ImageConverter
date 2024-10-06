import { useRef, useState } from "react";

interface TActions {
	onHover?: (() => void) | null;
	onExit?: (() => void) | null;
}

const defaultActions: TActions = {
	onHover: () => {},
	onExit: () => {},
};

const useDelayedHover = (delay: number, actions: TActions = defaultActions) => {
	const { onHover, onExit } = actions;
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

	const startTimer = () => {
		clearTimeout(hoverTimer.current);
		// set up our timer
		hoverTimer.current = setTimeout(() => {
			setIsHovered(true);
			return onHover && onHover();
		}, delay);
	};

	const stopTimer = () => {
		clearTimeout(hoverTimer.current);
		setIsHovered(false);
		return onExit && onExit();
	};

	return {
		isHovered: isHovered,
		timer: hoverTimer.current,
		startTimer: startTimer,
		stopTimer: stopTimer,
	};
};

export { useDelayedHover };
