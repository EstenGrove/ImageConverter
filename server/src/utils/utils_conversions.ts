const arrayBufferToBuffer = (arrayBuffer: ArrayBuffer): Buffer => {
	const buf: Buffer = Buffer.from(new Uint8Array(arrayBuffer));

	return buf;
};

// Buffers are just Uint8Arrays (eg. byte arrays)
// - So you just need to slice the desired range, but we need the offset for smaller buffers where the pool size is half metadata.
const bufferToArrayBuffer = (buf: Buffer): ArrayBuffer => {
	const arrayBuf: ArrayBuffer = buf.buffer.slice(
		buf.byteOffset,
		buf.byteOffset + buf.byteLength
	);

	return arrayBuf;
};

export { arrayBufferToBuffer, bufferToArrayBuffer };
