import { useState, useEffect, RefObject, useCallback, useRef } from "react";

export interface IObserverOptions {
	root?: null;
	rootMargin?: string;
	threshold?: number;
}

export interface IHookOpts {
	settings?: IObserverOptions;
	onIntersect?: (entry: IntersectionObserverEntry) => void;
	onExit?: (entry: IntersectionObserverEntry) => void;
}

// root: parent/ancestor that our 'target' may intersect with (null === viewport)
// rootMargin: distance from between our 'target' & our root
// threshold: the numeric value that we must exceed to trigger a valid 'intersection' occurrence
const defaultOpts: IHookOpts = {
	settings: {
		root: null,
		rootMargin: "0px",
		threshold: 0.3,
	},
};

export interface IEntryState {
	isIntersecting: boolean;
	entry: IntersectionObserverEntry | null;
}

export interface IHookReturn {
	entry: IEntryState;
	observer: IntersectionObserver;
	addElement: (element: HTMLElement, elCallback: TElementCallback) => void;
	removeElement: (element: HTMLElement) => void;
}

// A callback that gets called for each entry being observed by the IntersectionObserver
// export type TElementCallback = (entries: IntersectionObserverEntry[]) => void;
export type TElementCallback = (isIntersecting: boolean) => void;

// A Map of our HTMLElements w/ their respective callbacks
export type TElementsMap = Map<HTMLElement, TElementCallback>;

const useIntersectionObserverShared = (
	parentRef: RefObject<HTMLElement>,
	options: IHookOpts = {}
): IHookReturn => {
	const { settings = defaultOpts, onIntersect, onExit } = options;
	const {
		root = null,
		rootMargin = "0px",
		threshold = 0.5,
	} = settings as IObserverOptions;
	// entry state
	const observerRef = useRef<IntersectionObserver>();
	const elementsMap = useRef<TElementsMap>(new Map());
	const [entryState, setEntryState] = useState<IEntryState>({
		isIntersecting: false,
		entry: null,
	});

	// adds a single HTMLElement to be observed & tracked in our elementsMap
	const addElement = (element: HTMLElement, elCallback: TElementCallback) => {
		const map = elementsMap?.current as TElementsMap;
		const newElement = element as HTMLElement;
		const observer = observerRef?.current as IntersectionObserver;
		// add element to our map & start observe-ing
		map.set(newElement, elCallback);
		observer.observe(newElement);
	};
	// removes a single HTMLElement to be observed & tracked in our elementsMap
	const removeElement = (element: HTMLElement) => {
		const map = elementsMap?.current as TElementsMap;
		const newElement = element as HTMLElement;
		const observer = observerRef?.current as IntersectionObserver;
		// remove from map & observer list
		map.delete(newElement);
		observer.unobserve(newElement);
	};

	// intersection observer callback
	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				const isInRange =
					entry?.isIntersecting && entry?.intersectionRatio >= threshold;

				if (isInRange) {
					setEntryState({
						isIntersecting: true,
						entry: entry,
					});
					// check for handler
					if (onIntersect) {
						onIntersect(entry);
					}
				} else {
					setEntryState({
						isIntersecting: false,
						entry: null,
					});
					if (onExit) {
						onExit(entry);
					}
				}
			});
		},
		[onIntersect, onExit, threshold]
	);

	// create observer, apply handler & settings & observe target node
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;
		const parentEl = parentRef?.current as HTMLElement;
		// 🔻🔻 DO NOT OBSERVE THE PARENT, ONLY THE CHILDREN!!! 🔻🔻 //

		const observer = new IntersectionObserver(handleIntersection, {
			root,
			rootMargin,
			threshold,
		});
		// set parentEl & observe parentEl
		observerRef.current = observer;

		// if a parent was provided, then we add the children to be observed
		if (parentEl) {
			const childs = [...parentEl.children] as Element[];
			childs.forEach((child: Element) => {
				addElement(child as HTMLElement, (isIntersecting: boolean) => {
					// NOTE: this callback isn't really needed with this API design!!!
					console.log("isIntersecting(child):", isIntersecting);
				});
			});
		}

		return () => {
			isMounted = false;
			// if a parent was provided, then we remove the children from being observed on-cleanup
			if (parentEl) {
				const childs = [...parentEl.children] as Element[];
				childs.forEach((child: Element) => {
					removeElement(child as HTMLElement);
				});
			}
		};
	}, [handleIntersection, parentRef, root, rootMargin, threshold]);

	return {
		addElement: addElement,
		removeElement: removeElement,
		observer: observerRef?.current as IntersectionObserver,
		entry: entryState,
	};
};

export { useIntersectionObserverShared };
