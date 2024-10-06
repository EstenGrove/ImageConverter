import { currentEnv } from "./utils_env";

export type TStatus = "IDLE" | "PENDING" | "FULFILLED" | "REJECTED";

export type TResponseStatus = "SUCCESS" | "FAIL";
export type TResponse<T> = {
	Status: TStatus;
	Data: T | null;
	Message: string;
	ErrorMsg: string | null;
	StackTrace: string | null;
};

export interface IRequestOpts {
	method?: "GET" | "POST" | "DELETE" | "PUT";
	credentials?: "include";
	signal?: AbortSignal | null;
	headers?: {
		[key: string]: unknown;
		Authorization: string;
	};
	body?: unknown;
}

const defaultGet: IRequestOpts = {
	method: "GET",
	credentials: "include",
	signal: null,
	headers: {
		Authorization: btoa(currentEnv.user + ":" + currentEnv.password) as string,
	},
};

const fetchWithAuth = async (
	url: URL | string,
	options: IRequestOpts = defaultGet
): Promise<Response | unknown> => {
	const {
		method = "GET",
		signal = AbortSignal.timeout(10000),
		headers = { ...defaultGet.headers },
		body,
	} = options as IRequestOpts;
	try {
		return (await fetch(url, {
			method,
			signal: signal,
			// credentials: "include",
			// mode: "cors",
			headers: {
				...headers,
				Authorization:
					"Basic " + btoa(currentEnv.user + ":" + currentEnv.password),
			},
			body: body as BodyInit,
		})) as Response;
	} catch (error: unknown) {
		return error;
	}
};

export { fetchWithAuth };
