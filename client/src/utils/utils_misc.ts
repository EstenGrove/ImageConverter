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

export type TKey<T> = keyof T;
export type TRecord<T> = Record<string, T[]>;

const groupBy = <T extends object>(key: TKey<T>, list: T[]) => {
	const grouped = {} as TRecord<T>;
	for (let i = 0; i < list.length; i++) {
		const item = list[i] as T;
		const mapKey = item[key] as TKey<T>;

		if (!grouped[mapKey as keyof object]) {
			grouped[mapKey as keyof TRecord<T>] = [];
		}
		grouped[mapKey as keyof TRecord<T>].push(item as T);
	}
	return grouped;
};

export { addEllipsis, debounce, createImgSrc, groupBy };
