const addEllipsis = (str: string, maxLength: number = 30) => {
	if (str.length <= maxLength) return str;

	const newStr = str.slice(0, maxLength - 3) + "...";

	return newStr;
};

const createImgSrc = (file: File): string => {
	const blob = URL.createObjectURL(file);
	return blob;
};

const debounce = <T extends (...args: unknown[]) => unknown>(
	fn: T,
	ms: number
) => {
	let timerID: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>): void => {
		if (timerID) {
			clearTimeout(timerID);
		}
		timerID = setTimeout(() => {
			fn(...args);
		}, ms);
	};
};

export { addEllipsis, debounce, createImgSrc };
