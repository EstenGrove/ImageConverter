const getCookieByName = (name: string): string => {
	const list: string[] = document.cookie.split("; ");
	const cName: string = `${name}=`;
	let value: string = "";

	for (let i = 0; i < list.length; i++) {
		const cur: string = list[i];
		// check for name matches
		if (cur.includes(cName)) {
			value = cur.split("=")[1];
			break;
		}
	}

	return value;
};

const deleteCookieByName = (name: string) => {
	const cName: string = `${name}=`;
	document.cookie = cName + ";";
};

export { getCookieByName, deleteCookieByName };
