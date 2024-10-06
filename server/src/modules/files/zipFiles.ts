import { PassThrough, Readable } from "node:stream";
import archiver from "archiver";

interface FileBody {
	[name: string]: File;
}

// Takes an object of files & appends them to an archive instance & returns the archive instance
const prepareZipArchive = (files: FileBody): archiver.Archiver => {
	const archive: archiver.Archiver = archiver("zip", {
		zlib: { level: 9 }, // Sets the compression level.
	});

	for (const name in files) {
		const file = files[name] as File;
		const fileStream = file.stream() as ReadableStream<Uint8Array>;
		const readable = Readable.from(fileStream);
		// const fileStream = await file.arrayBuffer();
		archive.append(readable, { name: file.name });
	}
	const pass = new PassThrough();
	archive.pipe(pass);

	return archive;
};

// Appends X files to a zip 'archiver' instance
const createZipArchive = async (files: FileBody, zip: archiver.Archiver) => {
	try {
		for (const name in files) {
			const file = files[name] as File;
			const readable = Readable.from(file.stream(), {
				highWaterMark: 64,
				signal: AbortSignal.timeout(50000),
			});
			zip.append(readable, { name: name });
		}
		zip.finalize();
	} catch (error) {
		return error;
	}
};

const createZipArchive2 = async (
	files: FileBody,
	zip: archiver.Archiver,
	signal: AbortSignal
) => {
	try {
		for (const name in files) {
			const file = files[name] as File;
			const readable = Readable.from(file.stream(), {
				signal: signal,
			});
			zip.append(readable, { name });
		}
		zip.finalize();
	} catch (err) {
		return err;
	}
};

export { prepareZipArchive, createZipArchive };
