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

/**
 * @description - A utility for creating an object URI to trigger a file download to a user's machine.
 * @param {Blob} blob - A file blob, typically transformed from the HTTP response object
 * @param {String} filename - A custom filename used for saving the file to a user's machine.
 * @returns {Blob} - Returns a fileblob that's immediately downloaded to a user's machine.
 */
const saveFile = (blob: Blob, filename: string) => {
	const fileURL = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = fileURL;
	link.download = filename;
	link.click();
	return window.URL.revokeObjectURL(fileURL);
};

export {
	bytesTo,
	getSmartFileSize,
	getSmartSizeTotals,
	calculateTotalSize,
	revokeFileUrl,
	saveFile,
};
