import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { addDays } from "date-fns";
import { Context, Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { __FILES__ } from "../utils/utils_env";
import { CookieOptions } from "hono/utils/cookie";
import { getCookieOpts } from "../modules/auth/cookies";

const app: Hono = new Hono();

const cookieOpts: CookieOptions = getCookieOpts();

// Get/set userID; if uid doesn't exist
app.get("/getUser", async (ctx: Context) => {
	const uid = ctx.req.query("uid");

	console.log("query", uid);
	const userID = uid || getCookie(ctx, "uid");
	const expiry: Date = addDays(new Date(), 1);

	console.log("[USER-ID]: ", userID);

	// IF userID doesn't exist, set a new one
	if (!userID) {
		const newID: string = crypto.randomUUID();

		setCookie(ctx, "uid", newID, cookieOpts);

		// write file to disk
		const userDir: string = join(__FILES__, newID);
		const resp = await mkdir(userDir).catch((err) => {
			if (err.code === "ENOENT") {
				return err;
			}
		});
		const msg = resp instanceof Error ? "Already exists" : "Directory created";
		return ctx.json({
			UserID: newID,
			Expiry: expiry,
			Message: msg,
			Directory: userDir,
		});
	} else {
		// update cookie
		setCookie(ctx, "uid", userID, cookieOpts);

		const userDir: string = join(__FILES__, userID);
		await mkdir(userDir).catch((err) => {
			if (err.code === "ENOENT") {
				return err;
			}
		});

		return ctx.json({
			UserID: userID,
			Expiry: expiry,
			Message: `User directory already exists!`,
			Directory: userDir,
		});
	}
});

// Clears/deletes a user's cookies
app.get("/clearUser", (ctx: Context) => {
	deleteCookie(ctx, "uid");

	return ctx.json({
		UserID: null,
		Expiry: null,
		WasDeleted: true,
		Message: "User's cookies were deleted!",
	});
});

export default app;
