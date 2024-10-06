import { addDays } from "date-fns";
import { CookieOptions } from "hono/utils/cookie";

const getCookieOpts = (expiry?: Date): CookieOptions => {
	const defaultExpiry: Date = addDays(new Date(), 1);
	const expires: Date = !expiry ? defaultExpiry : expiry;

	const options = {
		path: "/",
		expires: expires,
		sameSite: "none",
		secure: true,
		httpOnly: false,
	};

	return options as CookieOptions;
};

export { getCookieOpts };
