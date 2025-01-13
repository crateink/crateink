import { createChunk } from "./createChunk.js";

self.onmessage = async (e) => {
  const { file, chunkSize, start, end } = e.data;
  let proms = [];
  for (let i = start; i < end; i++) {
    proms.push(createChunk(file, i, chunkSize));
  }

  const chunks = await Promise.all(proms);
  self.postMessage(chunks);
};
