import { convert as convertEndpoints, currentEnv } from "./utils_env";
import { fetchWithAuth } from "./utils_http";

export type OptKey = "resize" | "quality" | "width" | "height" | "format";

export type ConvertOpts = Record<OptKey, string>;

export interface ConvertOptions {
	format?: "webp" | "avif" | "jpeg" | "png";
	resize?: string;
	quality?: string;
}

const createConvertFormData = (
	files: File[],
	options: ConvertOptions
): FormData => {
	const formData: FormData = new FormData();

	// add files to formdata
	for (const name in files) {
		const file = files[name] as File;
		formData.append("file", file, file.name);
	}

	// apply options to formdata
	for (const optKey in options) {
		const optVal = options[optKey as keyof ConvertOptions];
		formData.append(optKey, optVal as string);
	}

	return formData;
};

// Adds files & convert options to formdata, then fires request
const convertImages = async (
	files: File[],
	options: ConvertOptions
): Promise<Response | unknown> => {
	const url = currentEnv.base + convertEndpoints.format;

	const formData = createConvertFormData(files, options);

	try {
		const request = (await fetchWithAuth(url, {
			method: "POST",
			body: formData,
		})) as Response;
		return request;
	} catch (error) {
		return error;
	}
};

export { convertImages, createConvertFormData };
