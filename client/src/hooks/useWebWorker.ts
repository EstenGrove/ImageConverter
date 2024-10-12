import { useEffect } from "react";

// Takes the filepath to the worker (eg './worker.ts')
// - Grabs our environment variables 'src' path & merges it with our webworker's filepath
const prepareUrl = (path: string): URL => {
	const urlPath = new URL(path, import.meta.url);
	return urlPath;
};

const createWorker = (filePath: string, isModule: boolean = false) => {
	// For ertain bundlers (webpack/rollup/parcel) we need to apply some path resolution changes to our worker's filepath:
	// - eg "/src" directory for DEV builds & "/dist" directory for PROD builds
	// - We also want to apply the 'module' flag to the file when using certain bundlers
	if (isModule) {
		return new Worker(prepareUrl(filePath), {
			type: "module",
		});
	} else {
		return new Worker(filePath);
	}
};

type HookOpts<T> = {
	onMessage?: (msg: MessageEvent<T>) => void;
	onError?: (err: ErrorEvent) => void;
	isModule?: boolean;
};

let workerRef: Worker;

const setupWorker = <T>(filePath: string, options: HookOpts<T> = {}) => {
	const { onMessage, onError, isModule } = options;

	const worker = createWorker(filePath, isModule);

	worker.onmessage = (msg) => {
		if (onMessage) {
			onMessage(msg);
		}
	};
	worker.onerror = (err) => {
		if (onError) {
			onError(err);
		}
	};

	return worker;
};

const useWebWorker = <T>(filePath: string, options: HookOpts<T> = {}) => {
	const sendMessage = (msg: T) => {
		const worker = workerRef as Worker;
		worker.postMessage(msg);
	};

	const terminateWorker = () => {
		const worker = workerRef as Worker;
		worker.terminate();
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		if (workerRef) return;
		workerRef = setupWorker(filePath, options);

		return () => {
			isMounted = false;
		};
	}, [filePath, options]);

	return {
		worker: workerRef as Worker,
		sendMessage: sendMessage,
		terminateWorker: terminateWorker,
	};
};

export { useWebWorker };
