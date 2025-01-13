(() => {
  const DURATION = 1000 * 60 * 2; // 检查间隔时间 2 分钟
  let lastSrcs = [];

  // 获取最新页面的 script src
  async function extractNewScripts() {
    try {
      const res = await fetch("/?t=" + Date.now());
      const html = await res.text();
      const srcs = Array.from(
        html.matchAll(/<script.*?src=['"](.*?)['"].*?>/g)
      ).map((match) => match[1]);
      return srcs;
    } catch (error) {
      return [];
    }
  }

  // 检查 script src 是否有更新
  async function needUpdate() {
    const srcs = await extractNewScripts();
    // 第一次获取到的 srcs 为空，不刷新
    if (lastSrcs.length === 0) {
      lastSrcs = srcs;
      return false;
    }
    return srcs.some((src) => !lastSrcs.includes(src));
  }

  function autoRefresh() {
    needUpdate();
    setTimeout(async () => {
      const willUpdate = await needUpdate();
      if (willUpdate) {
        alert("检测到页面有更新，请刷新页面！");
        window.location.reload();
      } else {
        autoRefresh();
      }
    }, DURATION);
  }

  autoRefresh();
})();
