import { join } from "path";
import { __FILES__ } from "./utils_env";
import { LocalFileStorage } from "../modules/files/files";
import { userUploadsMap } from "../modules/users/users";

const createUserEntry = () => {
	const userID: string = crypto.randomUUID();
	userUploadsMap.set(userID);

	const userDir = join(__FILES__, userID);
	const userFilesCache = new LocalFileStorage(userDir);
	const userEntry = userUploadsMap.get(userID);

	return {
		userFiles: userFilesCache,
		userEntry: userEntry,
	};
};

export { createUserEntry };
