import { ref, onUnmounted } from "vue";

/**
 * 延迟执行
 * @param {number} maxFrameCount 最大帧数
 * @returns {Function} 返回一个函数，接收一个参数 n，当帧数大于等于 n 时返回 true
 */
export function useDefer(maxFrameCount = 1000) {
  let frameCount = ref(0);
  let rafId = null;

  function updateFrameCount() {
    requestAnimationFrame(() => {
      rafId = frameCount.value++;
      if (frameCount.value >= maxFrameCount) {
        return;
      }
      updateFrameCount();
    });
  }

  updateFrameCount();

  onUnmounted(() => {
    cancelAnimationFrame(rafId);
  });

  return function (n) {
    return frameCount.value >= n;
  };
}
