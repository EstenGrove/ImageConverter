export type OptKey = "resize" | "quality" | "width" | "height" | "format";

export type ConvertOpts = Record<OptKey, string>;

const getConvertOptions = (formData: FormData) => {
	const options = {} as ConvertOpts;

	for (const pair of formData.entries()) {
		const key: string = pair[0];
		const val: string = pair[1] as string;
		options[key as OptKey] = val as string;
	}

	return options as ConvertOpts;
};

export { getConvertOptions };
