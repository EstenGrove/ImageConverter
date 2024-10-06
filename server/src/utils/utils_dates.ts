import { format } from "date-fns";

export interface TimeTokens {
	short: string;
	mil: string;
	long: string;
}

export interface DateTokens {
	short: string;
	underscore: string;
}

export interface DateTimeTokens {
	short: string;
	long: string;
}

const TIME_TOKENS: TimeTokens = {
	short: "hhmm",
	long: "h:mm a",
	mil: "HHmm",
};

const DATE_TOKENS: DateTokens = {
	short: "M/d/yyyy",
	underscore: "M_d_yy",
};

const DATETIME_TOKENS: DateTimeTokens = {
	short: `${DATE_TOKENS.short} ${TIME_TOKENS.short}`,
	long: `${DATE_TOKENS.short} ${TIME_TOKENS.long}`,
};

const formatDate = (date: Date | string, token: keyof DateTokens) => {
	const formatted = format(date, token);

	return formatted;
};

export { DATE_TOKENS, TIME_TOKENS, DATETIME_TOKENS, formatDate };
