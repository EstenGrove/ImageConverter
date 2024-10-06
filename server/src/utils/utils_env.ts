import dotenv from "dotenv";
dotenv.config();

interface IApiUser {
	username: string;
	password: string;
}

const API_USER: IApiUser = {
	username: process.env.API_USER as string,
	password: process.env.API_USER_PWD as string,
};

/**
 * '__FILES__': base/root directory for uploaded files
 */
const __FILES__ = process.env.FILE_DIR as string;

export { __FILES__, API_USER };
