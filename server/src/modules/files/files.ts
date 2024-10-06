import { FileMetaData, FilesMetaMap, FileStorage } from "./types";
import { resolve, join, dirname, basename } from "node:path";
import {
	statSync,
	mkdirSync,
	openAsBlob,
	createWriteStream,
	WriteStream,
} from "node:fs";
import { doesNotExistError } from "../../utils/utils_files";
import { readFile, unlink } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

/**
 * 'MemoryFileStorage': an in-memory file cache for tempory storage
 * - Requires a unique 'key' & a corresponding 'File' object for storage.
 * - Key: 'crypto.randomUUID()'
 * - File: 'File' object of the global object formerly in node:buffer module
 */
class MemoryFileStorage implements FileStorage {
	#map: Map<string, File> = new Map();

	has(key: string): boolean {
		return this.#map.has(key);
	}
	get(key: string): File {
		return this.#map.get(key) as File;
	}
	set(key: string, file: File) {
		this.#map.set(key, file);
	}
	remove(key: string): void {
		this.#map.delete(key);
	}
}

/**
 * 'LocalFileStorage' Class
 * - Contains a 'FilesMetaMap' that maps a unique key to each file.
 * - Each meta object contains the file's metadata such as type, size etc.
 */
class LocalFileStorage implements FileStorage {
	#fileMap: FilesMetaMap;
	#dirname: string;

	constructor(dirname: string) {
		this.#fileMap = new Map();
		this.#dirname = resolve(dirname);

		try {
			const stats = statSync(this.#dirname);

			if (!stats.isDirectory()) {
				throw new Error(`${this.#dirname} is NOT a directory!`);
			}
		} catch (err) {
			if (!doesNotExistError(err)) {
				throw err;
			}

			// Create the directory, if we make it here
			mkdirSync(this.#dirname);
		}
	}

	entries() {
		return this.#fileMap.entries();
	}
	has(key: string): boolean {
		return this.#fileMap.has(key);
	}
	async get(key: string): Promise<File> {
		const fileMeta = this.#fileMap.get(key) as FileMetaData;
		const filepath: string = join(this.#dirname, fileMeta.name);

		try {
			const buffer: Buffer = await readFile(filepath);
			const blob: Blob = new Blob([buffer], { type: fileMeta.type });
			const file: File = new File([blob], fileMeta.name, {
				type: fileMeta.type,
			});
			return file;
		} catch (error) {
			throw error;
		}
	}
	async set(key: string, file: File) {
		await this.#storeFile(file);
		this.#fileMap.set(key, {
			name: file.name,
			type: file.type,
			size: file.size,
			path: join(this.#dirname, file.name),
		});
	}
	async remove(key: string) {
		const fileMeta = this.#fileMap.get(key) as FileMetaData;
		const filepath: string = join(this.#dirname, fileMeta.name);
		this.#fileMap.delete(key);

		try {
			await unlink(filepath);
		} catch (error) {
			throw error;
		}
	}
	async #storeFile(file: File) {
		const filepath: string = join(this.#dirname, file.name);

		try {
			const readable: ReadableStream = file.stream();
			const writable: WriteStream = createWriteStream(filepath);

			return await pipeline(readable, writable);
		} catch (error) {
			throw error;
		}
	}
}

export { MemoryFileStorage, LocalFileStorage };
