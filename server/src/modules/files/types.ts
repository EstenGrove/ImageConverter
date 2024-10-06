export interface FileStorage {
	// Check if file exists in storage by 'key'
	has(key: string): boolean | Promise<boolean>;

	// Retrieve file by 'key' from storage
	get(
		key: string
	): File | Blob | Promise<File | Blob | unknown> | Promise<Blob>;

	// Set/store file in storage by 'key'
	set(key: string, file: File | Blob): void | Promise<void | unknown>;

	// Removes & deletes a file from storage by 'key'
	remove(key: string): void | Promise<void>;
}

export interface FileMetaData {
	path: string; // filepath
	name: string; // filename
	type: string; // file type
	size: number | null; // size in bytes
}

export type FilesMetaMap = Map<string, FileMetaData>;
