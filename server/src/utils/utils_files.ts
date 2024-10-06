/**
 * Validates that an error is of a specific type.
 * @param maybeErr Error - Possibly an error
 * @returns {Boolean} - Returns error
 */
const doesNotExistError = (
	maybeErr: unknown
): maybeErr is NodeJS.ErrnoException & { code: "ENOENT" } => {
	return (
		maybeErr instanceof Error &&
		"code" in maybeErr &&
		(maybeErr as NodeJS.ErrnoException).code === "ENOENT"
	);
};

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

export { doesNotExistError, getSmartFileSize, bytesTo };
