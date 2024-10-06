import { currentEnv, uploads } from "./utils_env";
import { fetchWithAuth } from "./utils_http";

const createFileSrc = (file: File): string => {
	return URL.createObjectURL(file);
};

const prepareFilesFormData = (files: File[]): FormData => {
	const formData = new FormData();
	for (const file of files) {
		formData.append(file.name, file);
	}

	return formData;
};

const getFiles = async (userID: string): Promise<Response | unknown> => {
	let url = currentEnv.base + uploads.getFiles;
	url += "?" + new URLSearchParams({ uid: userID });

	try {
		const request = (await fetchWithAuth(url)) as Response;
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

// Upload X File(s) to the server for later work!
const uploadFiles = async (userID: string, files: File[]) => {
	let url = currentEnv.base + uploads.uploadFiles;
	url += "?" + new URLSearchParams({ uid: userID });

	const formData = prepareFilesFormData(files);

	try {
		const request = (await fetchWithAuth(url, {
			method: "POST",
			body: formData,
		})) as Response;
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

const archiveFiles = async (files: File[], signal?: AbortSignal) => {
	const url = currentEnv.base + uploads.archiveFiles;

	const formData = prepareFilesFormData(files);

	try {
		const request = await fetchWithAuth(url, {
			method: "POST",
			body: formData,
			signal: signal,
		});
		return request as Response;
	} catch (error) {
		return error;
	}
};

export {
	createFileSrc,
	prepareFilesFormData,
	uploadFiles,
	archiveFiles,
	getFiles,
};
