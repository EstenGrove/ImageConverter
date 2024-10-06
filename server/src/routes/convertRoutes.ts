import { Context, Hono } from "hono";
import { ConvertOpts, getConvertOptions } from "../modules/files/convertFiles";
import { Readable, Writable } from "node:stream";
import sharp from "sharp";
import { pipeline } from "node:stream/promises";

const app: Hono = new Hono();

app.post("/formatImage", async (ctx: Context) => {
	const formData = await ctx.req.formData();
	const convertOpts: ConvertOpts = getConvertOptions(formData);
	const file = formData.get("file") as File;
	const format = convertOpts.format as keyof sharp.FormatEnum;
	// create conversion stream pipeline
	const readable = Readable.from(file.stream());
	const converter = sharp().toFormat(format);

	readable.pipe(converter);
	const outputStream = Readable.toWeb(converter) as ReadableStream;

	readable.on("error", (err) => {
		console.log("[READABLE-ERROR]:", err);
	});
	converter.on("error", (err) => {
		console.log("[SHARP-ERROR]:", err);
	});
	readable.on("close", () => {
		readable.destroy();
	});
	converter.on("close", () => {
		converter.destroy();
	});
	ctx.set("Content-Type", "application/zip, application/octet-stream");

	// return new Response(outputStream);
	return ctx.body(outputStream);
});

app.post("/convertImages", async (ctx: Context) => {
	const formData = await ctx.req.formData();
	const convertOpts: ConvertOpts = getConvertOptions(formData);
	const file = formData.get("file") as File;
	const format = convertOpts.format as keyof sharp.FormatEnum;

	return ctx.text("Success");
	// const converter = sharp().toFormat(format);
	// const readable = Readable.from(file.stream());
	// const writable = new Writable();

	// return await pipeline(readable, converter);
	// return readable.pipe(converter).pipe(writable).write(ctx.body);
	// return readable.pipe(converter).pipe(writable).write(new Response())
});

app.post("/resizeImages", async (ctx: Context) => {
	return ctx.text("Resizing complete!");
});

export default app;
