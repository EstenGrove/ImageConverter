import { useState, useEffect, MouseEvent, RefObject } from "react";

/**
 * Example Usage:
 * 1.
 * const myRef = useRef()
 * const isOutside = useOutsideClick(myRef)
 * 2.
 * const myRef = useRef();
 * const myCallback = () => {...};
 * useOutsideClick(myRef, myCallback)
 * 3.
 * const myRef = useRef()
 * const isOutside = useOutsideClick(myRef, () => {
 *  // do something
 * })
 */
const useOutsideClick = (
	nodeRef: RefObject<HTMLElement> | undefined,
	onOutsideClick?: () => void | undefined
): boolean => {
	const [isOutside, setIsOutside] = useState<boolean>(false);

	const handleOutsideClick = (e: MouseEvent): void => {
		// check if ref is set first
		if (!nodeRef || !nodeRef?.current) return;

		// if click target is within 'nodeRef.current' then it's inside
		if (nodeRef?.current.contains(e.target as HTMLElement)) {
			setIsOutside(false);
		} else {
			// check for optional callback
			if (onOutsideClick) {
				onOutsideClick();
			}
			setIsOutside(true);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleOutsideClick as () => void);

		return () => {
			document.removeEventListener(
				"mousedown",
				handleOutsideClick as () => void
			);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return isOutside;
};

export { useOutsideClick };
