import { join, resolve } from "node:path";
import { unlink, rmdir } from "node:fs/promises";
import { LocalFileStorage } from "../files/files";
import { __FILES__ } from "../../utils/utils_env";

// User's Directory:
// - '__FILES__/f70aaf95-3c2a-4e00-9b0c-feb91439501e/user-files-go-here'
class UserUploads {
	#baseDirname: string;
	#usersMap: Map<string, LocalFileStorage>;

	constructor(baseDir: string = "./__FILES__") {
		this.#baseDirname = baseDir;
		this.#usersMap = new Map();
	}

	has(key: string): boolean {
		return this.#usersMap.has(key);
	}
	get(key: string) {
		return this.#usersMap.get(key);
	}
	set(key: string) {
		// key: crypto.randomUUID()
		const dirname: string = join(this.#baseDirname, key);
		const localFileCache = new LocalFileStorage(dirname);
		this.#usersMap.set(key, localFileCache);
	}
	// Removes all files on disk & it's folder
	async remove(key: string): Promise<void> {
		if (!this.has(key)) throw new Error("User not found!");

		try {
			const dirname: string = join(this.#baseDirname, key);
			return await rmdir(dirname);
		} catch (error) {
			throw error;
		} finally {
			this.#usersMap.delete(key);
		}
	}
}

const userUploadsMap: UserUploads = new UserUploads(__FILES__);

export { UserUploads, userUploadsMap };
