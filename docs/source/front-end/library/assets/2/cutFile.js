export async function cutFile(
  file,
  {
    chunkSize = 1024 * 1024 * 5, // 5MB
    threadCount = navigator.hardwareConcurrency || 4, // 线程数
  } = {}
) {
  return new Promise((resolve, reject) => {
    const chunkCount = Math.ceil(file.size / chunkSize);
    const threadChunkCount = Math.ceil(chunkCount / threadCount);
    const result = [];
    let finishCount = 0;
    for (let i = 0; i < threadCount; i++) {
      // 创建线程，并分配任务
      const worker = new Worker("./worker.js", { type: "module" });
      const start = i * threadChunkCount;
      const end = Math.min((i + 1) * threadChunkCount, chunkCount);

      // 传递分片参数
      worker.postMessage({ file, chunkSize, start, end });

      // 获得分片结果
      worker.onmessage = (e) => {
        for (let i = start; i < end; i++) {
          result[i] = e.data[i - start];
        }
        worker.terminate();
        finishCount++;
        if (finishCount === threadCount) {
          resolve(result);
        }
      };

      worker.onerror = (e) => {
        worker.terminate();
        reject(e);
      };
    }
  });
}
