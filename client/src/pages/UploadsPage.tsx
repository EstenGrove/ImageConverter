import { useEffect, useMemo, useRef, useState } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import styles from "../css/pages/UploadsPage.module.scss";
import UploadsPanel from "../components/layout/UploadsPanel";
import UploadDropZone from "../components/uploads/UploadDropZone";
import NoUploads from "../components/uploads/NoUploads";
import FileList from "../components/uploads/FileList";
import {
	archiveFiles,
	createFileSrc,
	uploadFiles,
} from "../utils/utils_uploads";
import { FileItem } from "../components/uploads/types";
import { revokeFileUrl, saveFile } from "../utils/utils_files";
import { getUser } from "../utils/utils_users";
import { getCookieByName } from "../utils/utils_cookies";
import { convertImages, ConvertOptions } from "../utils/utils_convert";
import FullPageLoader from "../components/uploads/FullPageLoader";

const UploadsPage = () => {
	const userID = useRef<string>(getCookieByName("uid"));
	const [isLoading, setIsLoading] = useState(false);
	const abortController = useRef<AbortController>();

	const [filesList, setFilesList] = useState<FileItem[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
	const isAllSelected = useMemo(() => {
		const isEqual =
			filesList &&
			filesList.length > 0 &&
			filesList.length === selectedFiles.length;
		return isEqual;
	}, [filesList, selectedFiles.length]);
	const uploader = useFileUpload({
		onUpload: (files: File[]) => {
			const fileItems: FileItem[] = files.map((file) => ({
				file: file,
				src: createFileSrc(file),
			}));
			setFilesList([...fileItems, ...filesList]);
		},
	});
	const handlers = {
		onFile: uploader.onFile,
		onFileDrop: uploader.onFileDrop,
		onFileDragOver: uploader.onFileDragOver,
	};

	const selectAllFiles = () => {
		if (isAllSelected) {
			setSelectedFiles([]);
		} else {
			setSelectedFiles([...filesList]);
		}
	};

	const selectFile = (file: FileItem) => {
		const fileIdx: number = selectedFiles.findIndex(
			(x) => x.file.name === file.file.name
		);
		if (fileIdx > -1) {
			const updated = [
				...selectedFiles.filter((cur) => cur.file.name !== file.file.name),
			];
			setSelectedFiles(updated);
		} else {
			const updated = [...selectedFiles, file];

			setSelectedFiles(updated);
		}
	};

	const removeFiles = () => {
		if (!selectedFiles) {
			console.log("Condition1");
			return;
		}
		if (selectedFiles.length <= 0) {
			console.log("Condition2");
			return;
		}

		const toDeleteNames: string[] = selectedFiles.map((item) => {
			const { file } = item;
			revokeFileUrl(item.src);
			return file.name;
		});
		const newFiles: FileItem[] = filesList.filter((item) => {
			return !toDeleteNames.includes(item.file.name);
		});

		setSelectedFiles([]);
		setFilesList(newFiles);
	};

	// archive 1 or more files
	const zipSelectedFiles = async () => {
		const files: File[] = selectedFiles.map(({ file }) => file);
		const controller = new AbortController();
		abortController.current = controller;
		const signal = controller.signal;
		const resp = (await archiveFiles(files, signal)) as Response;

		if (resp) {
			const blob = await resp.blob();
			saveFile(blob, "Archive.zip");
			setIsLoading(false);
		}
	};

	// upload file(s) to server for later use
	const uploadSelectedFiles = async () => {
		const uid = userID.current as string;
		const files: File[] = selectedFiles.map(({ file }) => file);

		await uploadFiles(uid, files).finally(() => {
			setIsLoading(false);
		});
	};

	// converts a single file to a given format (eg. ".webp")
	const convertSelectedFiles = async () => {
		// const uid = userID.current as string;
		const files: File[] = selectedFiles.map(({ file }) => file);
		const convertOpts = { format: "webp" } as ConvertOptions;

		const resp = (await convertImages(files, convertOpts).finally(() => {
			setIsLoading(false);
		})) as Response;

		if (resp) {
			const blob = await resp.blob();
			saveFile(blob, "Converted.webp");
		}
	};

	const cancelAction = async () => {
		if (abortController.current) {
			const controller = abortController.current as AbortController;
			controller.abort();
			setIsLoading(false);
		}
	};

	// get/set userID for storage & peristences
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		if (userID.current) {
			const uid = userID.current;
			getUser(uid);
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className={styles.UploadsPage}>
			<section className={styles.UploadsPage_dropzone}>
				<UploadDropZone
					name="files"
					id="files"
					multiple={true}
					accept="image/*"
					hasFile={filesList && filesList.length !== 0}
					{...handlers}
				/>
			</section>
			<section className={styles.UploadsPage_panel}>
				<UploadsPanel
					filesList={filesList}
					isLoading={isLoading}
					isAllSelected={isAllSelected}
					removeFiles={removeFiles}
					selectAllFiles={selectAllFiles}
					zipSelectedFiles={() => {
						setIsLoading(true);
						zipSelectedFiles();
					}}
					uploadSelectedFiles={() => {
						setIsLoading(true);
						uploadSelectedFiles();
					}}
					selectMoreOptions={() => {
						setIsLoading(true);
						convertSelectedFiles();
					}}
				>
					{filesList.length === 0 && <NoUploads />}
					{filesList.length > 0 && (
						<FileList
							files={filesList}
							selectFile={selectFile}
							selectedFiles={selectedFiles}
						/>
					)}
				</UploadsPanel>
			</section>

			{isLoading && (
				<FullPageLoader>
					<button type="button" onClick={cancelAction}>
						Cancel Upload
					</button>
				</FullPageLoader>
			)}
		</div>
	);
};

export default UploadsPage;
