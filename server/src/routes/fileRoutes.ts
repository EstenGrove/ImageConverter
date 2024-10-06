import zlib from "node:zlib";
import archiver from "archiver";
import { IncomingMessage } from "node:http";
import { join } from "node:path";
import { Context, Hono } from "hono";
import { getCookie } from "hono/cookie";
import { Readable } from "node:stream";
import { readdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { __FILES__ } from "../utils/utils_env";
import { getFilesList } from "../controllers/uploads";
import { createZipArchive } from "../modules/files/zipFiles";
import { pipeline as pipelineAsync } from "node:stream/promises";
import { getSmartFileSize } from "../utils/utils_files";

const app: Hono = new Hono();

interface FileBody {
	[name: string]: File;
}

app.get("/getFiles", async (ctx: Context) => {
	const cookieID = getCookie(ctx, "uid") as string;
	const uid = ctx.req.query("uid");
	const userID: string = uid || cookieID;

	const userPath: string = join(__FILES__, userID);
	const dirContents = await readdir(userPath, { withFileTypes: true });
	const files =
		dirContents &&
		dirContents.map((item) => ({
			name: item.name,
			path: item.parentPath,
		}));

	return ctx.json({
		UserID: userID,
		Message: `${files?.length ?? 0} files were found`,
		Files: files,
	});
});

app.post("/uploadFiles", async (ctx: Context) => {
	const body = await ctx.req.parseBody();
	const uid = ctx.req.query("uid");
	const cookieID = getCookie(ctx, "uid") as string;
	const userID: string = uid || cookieID;
	const files = getFilesList(body) as FileBody;

	if (!userID) {
		return ctx.json({
			UserID: null,
			Message: `User not found. Failed to save file(s)`,
		});
	}

	// write files
	for (const name in files) {
		const file = files[name] as File;
		const filePath: string = join(__FILES__, userID, name);
		const readable = file.stream();
		const writable = createWriteStream(filePath);
		await pipelineAsync(readable, writable).catch((err) => {
			if (err) {
				console.log("Error", err);
				return;
			}
		});
	}

	return ctx.json({
		UserID: userID,
		Message: `Files writted & saved!`,
	});
});
// Create a zip file from X files
app.post("/archiveFiles", async (ctx: Context) => {
	const body = await ctx.req.parseBody();
	const userID = getCookie(ctx, "uid") as string;
	const files = getFilesList(body) as FileBody;
	const fileCount: number = Object.keys(files).length;
	const contentLength = ctx.req.header("Content-Length");
	const smartSize = getSmartFileSize(Number(contentLength));

	console.log("Content-Length:", smartSize);

	// abort
	// ##TODOS:
	// - PASS server abort 'signal' to 'createZipArchive' fn

	// if no files given: BAD REQUEST
	if (!files || fileCount <= 0) {
		ctx.status(400);
		return ctx.json({
			UserID: userID,
			Message: "No files",
			Size: smartSize,
		});
	}

	const zip = archiver("zip", {
		zlib: { level: zlib.constants.Z_BEST_COMPRESSION },
	});

	const t0 = performance.now();
	await createZipArchive(files, zip).finally(() => {
		console.log(`✅ Zipped ${fileCount} files (${zip.pointer()}) bytes`);
	});
	const t1 = performance.now();
	console.log(`- Elapsed ${t1 - t0} ms`);

	ctx.set("Content-Type", "application/zip, application/octet-stream");
	const outputStream = Readable.toWeb(zip) as ReadableStream;

	return ctx.body(outputStream);
	// return new Response(outputStream);
});

app.post("/archiveFilesToDisk", async (ctx: Context) => {
	const body = await ctx.req.parseBody();
	const userID = getCookie(ctx, "uid") as string;
	const files = getFilesList(body) as FileBody;
	const fileCount: number = Object.keys(files).length;

	// if no files given: BAD REQUEST
	if (!files || fileCount <= 0) {
		ctx.status(400);
		return ctx.json({
			UserID: userID,
			Message: "No files",
		});
	}
	const zip = archiver("zip", {
		zlib: { level: 9 },
	});
	const writePath: string = join(__FILES__, userID, "Archive.zip");
	const writable = createWriteStream(writePath);

	zip.pipe(writable);
	await zip.finalize();

	return ctx.json({
		UserID: userID,
		Message: `Archive.zip was save to: ${writePath}`,
		Directory: writePath,
	});
});

export default app;
