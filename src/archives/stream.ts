/* export const createReadStream = (file: File) => {
  const reader = new FileReader();
  console.log(file.size)
  const chunkSize = 64 * 1024; // Taille des morceaux (64 Ko)

  let bytesRead = 0;

  return new ReadableStream({
    start(controller) {
      reader.onload = () => {
        const chunk = new Uint8Array(reader.result as ArrayBuffer);
        console.log(chunk)
        controller.enqueue(chunk);
        bytesRead += chunk.length;
        if (bytesRead < file.size) {
          readNextChunk();
        } else {
          controller.close();
        }
      };

      reader.onerror = () => {
        controller.error(new Error('Failed to read file'));
      };

      readNextChunk();
    },
    cancel() {
      reader.abort();
    },
  });

  function readNextChunk() {
    const start = bytesRead;
    const end = Math.min(start + chunkSize, file.size);
 
    const blobSlice = file.slice(start, end);

    reader.readAsArrayBuffer(blobSlice);
  }
}; */