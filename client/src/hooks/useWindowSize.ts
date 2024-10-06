import { useState, useMemo, useEffect } from "react";

export interface WindowSize {
	width: number;
	height: number;
}

const useWindowSize = () => {
	const [size, setSize] = useState<WindowSize>({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const windowSize: WindowSize = useMemo(() => size, [size]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);

		return () => {
			isMounted = false;
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return windowSize;
};

export { useWindowSize };
