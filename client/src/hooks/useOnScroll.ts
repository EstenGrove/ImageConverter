import { RefObject, useCallback, useEffect, useState } from "react";

export interface ScrollPos {
	top: number;
	bottom: number;
}

interface Actions {
	onScroll: (pos: ScrollPos) => void;
}

const useOnScroll = (elRef: RefObject<HTMLElement>, actions: Actions) => {
	const { onScroll } = actions;
	const [scrollPos, setScrollPos] = useState<ScrollPos>({
		top: 0,
		bottom: 0,
	});

	const handleScroll = useCallback(() => {
		const node = elRef.current as HTMLElement;
		const top = node.scrollTop;
		const bottom = node.scrollTop + node.clientHeight;
		setScrollPos({ top, bottom });
		return onScroll && onScroll({ top, bottom });
	}, [elRef, onScroll]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		const node = elRef?.current as HTMLElement;

		node?.addEventListener("scroll", handleScroll, false);

		return () => {
			isMounted = false;

			node?.removeEventListener("scroll", handleScroll, false);
		};
	}, [elRef, handleScroll]);

	return scrollPos;
};

export { useOnScroll };
