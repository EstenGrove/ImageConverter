export type BytesTo = "KB" | "MB" | "GB";

const getSmartFileSize = (bytes: number): string => {
	switch (true) {
		// GB
		case bytes >= 1e9: {
			const gb = bytesTo(bytes, "GB").toFixed(2);
			return gb + " GB";
		}
		case bytes >= 1e6: {
			const mb = bytesTo(bytes, "MB").toFixed(2);

			return mb + " MB";
		}
		case bytes >= 1024: {
			const kb = bytesTo(bytes, "KB").toFixed(2);
			return kb + " KB";
		}

		default:
			return bytes.toFixed(2) + " b";
	}
};

const bytesTo = (bytes: number, to: string): number => {
	switch (to) {
		case "KB": {
			return bytes / 1024;
		}
		case "MB": {
			return bytes / 1e6;
		}
		case "GB": {
			return bytes / 1e9;
		}

		default:
			return bytes;
	}
};

const calculateTotalSize = (files: File[]) => {
	return files.reduce((total, file) => {
		return (total += file.size);
	}, 0);
};

// Calculates total file size of all files in a given list
const getTotalSize = (files: File[]): number => {
	return files.reduce((total, file) => {
		total += file.size;
		return total;
	}, 0);
};

export interface SmartTotals {
	files: string;
	selected: string;
}

// Get totals of selected and all files lists
const getSizeTotals = (filesList: File[], selectedFiles: File[]) => {
	return {
		files: getTotalSize(filesList),
		selected: getTotalSize(selectedFiles),
	};
};

// Get SMART file size totals for selected & all files
const getSmartSizeTotals = (
	filesList: File[],
	selectedFiles: File[]
): SmartTotals => {
	const { files, selected } = getSizeTotals(filesList, selectedFiles);
	const smartAll = getSmartFileSize(files);
	const smartSelected = getSmartFileSize(selected);

	return {
		files: smartAll,
		selected: smartSelected,
	};
};

const revokeFileUrl = (url: string) => {
	URL.revokeObjectURL(url);
};

const saveFile = (blob: Blob, filename: string) => {
	const fileURL = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = fileURL;
	link.download = filename;
	link.click();
	return window.URL.revokeObjectURL(fileURL);
};

const readFileAsText = (file: File): Promise<string> => {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = (e: ProgressEvent<FileReader>) =>
			resolve(e.target?.result as string);

		reader.onerror = (e: ProgressEvent<FileReader>) => reject(e);

		reader.readAsText(file);
	});
};

type ReadAs = "text" | "blob" | "arrayBuffer" | "url";

// Use FileReader instance to read a file in a specific format
const readFileAs = (file: File, as: ReadAs): Promise<unknown> => {
	const reader = new FileReader();
	const readFile = {
		text: (file: File) => reader.readAsText(file),
		url: (file: File) => reader.readAsDataURL(file),
		blob: (file: File) => reader.readAsDataURL(file),
		arrayBuffer: (file: File) => reader.readAsArrayBuffer(file),
	};

	return new Promise((resolve, reject) => {
		reader.onload = (e) => resolve(e.target?.result as unknown);
		reader.onerror = (e) => reject(e);

		// read file w/ target 'as' format
		readFile[as](file);
	});
};

export {
	bytesTo,
	getSmartFileSize,
	getSmartSizeTotals,
	calculateTotalSize,
	revokeFileUrl,
	saveFile,
	readFileAsText,
	readFileAs,
};
