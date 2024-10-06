export interface IEndpoints {
	uploads: {
		uploadFiles: string;
		archiveFiles: string;
		getFiles: string;
	};
	users: {
		getUser: string;
		clearUser: string;
	};
	convert: {
		resize: string;
		format: string;
	};
}
const BASE_URL: string = import.meta.env.VITE_API_BASE;

const API_AUTH = {
	development: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
	},
	production: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
	},
	testing: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
	},
	local: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
	},
};

const CURRENT_ENV_NAME = "local";
const CURRENT_ENV_AUTH = API_AUTH[CURRENT_ENV_NAME];

const API_ENDPOINTS: IEndpoints = {
	uploads: {
		uploadFiles: "/uploads/uploadFiles",
		archiveFiles: "/uploads/archiveFiles",
		getFiles: "/uploads/getFiles",
	},
	users: {
		getUser: "/users/getUser",
		clearUser: "/users/clearUser",
	},
	convert: {
		resize: "/convert/resizeImage",
		format: "/convert/formatImage",
	},
};

const { uploads, users, convert } = API_ENDPOINTS;

export {
	BASE_URL,
	API_AUTH,
	API_ENDPOINTS,
	CURRENT_ENV_AUTH as currentEnv,
	CURRENT_ENV_NAME as currentEnvName,
	convert,
	uploads,
	users,
};
