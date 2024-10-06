import { access, mkdir } from "fs/promises";

const doesDirExist = async (dirPath: string): Promise<boolean> => {
	try {
		await access(dirPath);
		return true;
	} catch (error) {
		return false;
	}
};

const createDir = async (dirPath: string) => {
	try {
		// returns undefined if it exists

		return await mkdir(dirPath);
	} catch (error: unknown) {
		// throws an error if it doesn't exist
		throw error;
	}
};

export { createDir, doesDirExist };
