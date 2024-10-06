import { Context } from "hono";
import { join } from "node:path";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { mkdir } from "node:fs/promises";
import { userUploadsMap } from "../modules/users/users";
import { LocalFileStorage } from "../modules/files/files";
import { __FILES__ } from "../utils/utils_env";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { addDays } from "date-fns";

const createUserDir = async (userID: string) => {
	const userDir: string = join(__FILES__, userID);
	try {
		await mkdir(userDir);
		return userDir;
	} catch (error) {
		throw error;
	}
};

const writeFilesToDisk = async (userDir: string, files: File[]) => {
	const promises = files.map(async (file) => {
		const filePath = join(userDir, file.name);
		try {
			const readable = file.stream();
			const writable = createWriteStream(filePath);
			await pipeline(readable, writable);
		} catch (error) {
			return error;
		}
	});
	return await Promise.all(promises);
};

// Clones a 'body' that's a naked object into an object that's iterable
const getFilesList = (body: { [x: string]: string | File }) => {
	const obj = { ...body };
	return obj;
};

const testUpload = async (ctx: Context) => {
	const body = await ctx.req.parseBody();
	// const body = await ctx.req.formData();
	const allCookies = getCookie(ctx, "userID");
	// const { files } = body;
	const files = getFilesList(body);

	console.log("[FILES]", files);
	console.log("[BODY]", body);
	console.log("[USER-COOKIE]", allCookies);

	deleteCookie(ctx, "userID");
	const userID = crypto.randomUUID();
	setCookie(ctx, "userID", userID, {
		path: "/",
		expires: addDays(new Date(), 2),
		sameSite: "none",
	});
	return ctx.json({
		Cookie: "No cookie found.",
	});
};

const uploadFiles = async (ctx: Context) => {
	const body = await ctx.req.parseBody({ all: true });
	const userCookie = getCookie(ctx, "userID") as string;
	const files = body["file[]"] as File[];

	if (!userCookie) {
		const userID: string = crypto.randomUUID();
		const userDir = await createUserDir(userID);
		await writeFilesToDisk(userDir, files).catch((err: unknown) => {
			if (err) {
				return ctx.text(err as string);
			}
		});

		setCookie(ctx, "userID", userID);

		return ctx.json({
			UserID: userID,
			UserDirectory: userDir,
			Message: `${files.length} files uploaded successfully!`,
		});
	} else {
		// write files to disk
		const userDir = join(__FILES__, userCookie);
		setCookie(ctx, "userID", userCookie);
		return ctx.json({
			UserID: userCookie,
			UserDirectory: userDir,
			Message: `${files.length} files uploaded successfully!`,
		});
	}
};

export { getFilesList, createUserDir, writeFilesToDisk };
