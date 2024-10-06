import { format } from "date-fns";

export type TDateFormats = {
	long: string;
	short: string;
	extraShort: string;
	longDashes: string;
	shortDashes: string;
};
export type TTimeFormats = {
	short: string;
	long: string;
	alt: string;
};
export type TDateTimeFormats = {
	long: string;
	short: string;
	extraShortAndLong: string;
	longAndShort: string;
	shortAndLong: string;
};

// DATE-ONLY FORMAT TOKENS
const DATE_FORMATS: TDateFormats = {
	long: "MM/dd/yyyy",
	short: "MM/dd/yy",
	extraShort: "M/d/yyyy",
	// w/ dashes instead of slashes
	longDashes: "MM-dd-yyyy",
	shortDashes: "MM-dd-yy",
};
// TIME-ONLY FORMAT TOKENS
const TIME_FORMATS: TTimeFormats = {
	short: "h:mm",
	long: "hh:mm a",
	alt: "HH:mm",
};
// DATETIME FORMAT TOKENS (both date & time merged)
const DATETIME_TOKENS: TDateTimeFormats = {
	long: `${DATE_FORMATS.long} ${TIME_FORMATS.long}`,
	short: `${DATE_FORMATS.short} ${TIME_FORMATS.short}`,
	extraShortAndLong: `${DATE_FORMATS.extraShort} ${TIME_FORMATS.long}`,
	longAndShort: `${DATE_FORMATS.long} ${TIME_FORMATS.short}`,
	shortAndLong: `${DATE_FORMATS.short} ${TIME_FORMATS.long}`,
};

// formats a single date excludes time
const formatDate = (date: Date | string, formatToken: string = "long") => {
	const base: Date = new Date(date);
	const target: string = DATE_FORMATS[formatToken as keyof TDateFormats];
	const result = format(base, target);

	return result;
};
// formats a single time excludes date
const formatTime = (time: Date | string, formatToken: string = "long") => {
	const base: Date = new Date(time);
	const target: string = TIME_FORMATS[formatToken as keyof TTimeFormats];
	const result = format(base, target);

	return result;
};
// formats both date & time
const formatDateTime = (
	datetime: Date | string,
	formatToken: keyof TDateTimeFormats = "long"
) => {
	const base: Date = new Date(datetime);
	const target: string = DATETIME_TOKENS[formatToken as keyof TDateTimeFormats];
	const result = format(base, target);

	return result;
};

export { formatDate, formatTime, formatDateTime };
