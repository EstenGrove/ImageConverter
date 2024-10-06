import { currentEnv, users } from "./utils_env";
import { fetchWithAuth } from "./utils_http";

const getUser = async (userID: string) => {
	let url = currentEnv.base + users.getUser;
	url += "?" + new URLSearchParams({ uid: userID });

	try {
		const request = (await fetchWithAuth(url)) as Response;
		const response = await request.json();
		console.log("response", response);
		return response;
	} catch (error) {
		return error;
	}
};
const clearUser = async (userID: string) => {
	let url = currentEnv.base + users.clearUser;
	url += "?" + new URLSearchParams({ uid: userID });

	try {
		const request = (await fetchWithAuth(url)) as Response;
		const response = await request.json();
		return response;
	} catch (error) {
		return error;
	}
};

export { getUser, clearUser };
