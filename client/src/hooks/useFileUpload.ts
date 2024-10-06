import { ChangeEvent, DragEvent, useState } from "react";

export interface FileUploadOpts {
	maxFileSize?: number;
	maxFileCount?: number;
	onUpload?: (files: File[]) => void;
}

interface HookReturn {
	files: File[];
	onFile: (e: ChangeEvent<HTMLInputElement>) => void;
	onFileDrop: (e: DragEvent<HTMLInputElement>) => void;
	onFileDragOver: (e: DragEvent<HTMLInputElement>) => void;
}

const defaultOpts: FileUploadOpts = {
	maxFileCount: Infinity,
	maxFileSize: Infinity,
};

const useFileUpload = (options: FileUploadOpts = defaultOpts): HookReturn => {
	const { onUpload } = options;
	const [filesList, setFilesList] = useState<File[]>([]);

	const onFile = (e: ChangeEvent<HTMLInputElement>) => {
		const evtFiles = e.target.files as FileList;
		const files = Array.from(evtFiles);
		console.log("files", files);

		setFilesList(files);

		return onUpload && onUpload(files);
	};
	const onFileDrop = (e: DragEvent<HTMLInputElement>) => {
		e.preventDefault();
		const evtFiles = e.dataTransfer.files as FileList;
		const files = Array.from(evtFiles);

		setFilesList(files);
		return onUpload && onUpload(files);
	};
	const onFileDragOver = (e: DragEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	return {
		onFile,
		onFileDrop,
		onFileDragOver,
		files: filesList as File[],
	};
};

export { useFileUpload };
