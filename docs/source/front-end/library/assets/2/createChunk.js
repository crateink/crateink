import "./spark-md5.min.js";

export function createChunk(file, index, chunkSize) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const spark = new SparkMD5.ArrayBuffer();
    const blob = file.slice(start, end);
    fileReader.onload = () => {
      spark.append(fileReader.result);
      resolve({ index, start, end, hash: spark.end(), blob });
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file.slice(start, end));
  });
}
