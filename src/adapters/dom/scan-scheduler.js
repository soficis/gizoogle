(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const adapters = gizoogle.adapters || (gizoogle.adapters = {});
  const domAdapters = adapters.dom || (adapters.dom = {});

  function createScanScheduler(options = {}) {
    const processingBudgetMs = Number.isFinite(options.processingBudgetMs)
      ? options.processingBudgetMs
      : 12;

    const idleTimeoutMs = Number.isFinite(options.idleTimeoutMs) ? options.idleTimeoutMs : 500;

    const metrics = {
      chunks: 0,
      processedNodes: 0,
      totalRuntimeMs: 0
    };

    function scheduleIdleWork(work) {
      if (typeof root.requestIdleCallback === "function") {
        root.requestIdleCallback(work, { timeout: idleTimeoutMs });
        return;
      }

      root.setTimeout(() => {
        work({
          timeRemaining() {
            return 0;
          }
        });
      }, 0);
    }

    function shouldYield(deadline, startTime) {
      const hasIdleTime =
        deadline && typeof deadline.timeRemaining === "function" && deadline.timeRemaining() > 0;

      if (!hasIdleTime) {
        return true;
      }

      const elapsed = root.performance.now() - startTime;
      return elapsed >= processingBudgetMs;
    }

    function runNodes(nodes, processNode, onComplete) {
      if (!Array.isArray(nodes) || nodes.length === 0) {
        onComplete();
        return;
      }

      let currentIndex = 0;
      const startedAt = root.performance.now();

      function processChunk(deadline) {
        metrics.chunks += 1;
        const chunkStart = root.performance.now();

        while (currentIndex < nodes.length) {
          processNode(nodes[currentIndex]);
          currentIndex += 1;
          metrics.processedNodes += 1;

          if (currentIndex < nodes.length && shouldYield(deadline, chunkStart)) {
            scheduleIdleWork(processChunk);
            return;
          }
        }

        metrics.totalRuntimeMs += root.performance.now() - startedAt;
        onComplete();
      }

      scheduleIdleWork(processChunk);
    }

    return Object.freeze({
      runNodes,
      metrics
    });
  }

  domAdapters.scanScheduler = Object.freeze({
    createScanScheduler
  });

  if (typeof module === "object" && module.exports) {
    module.exports = domAdapters.scanScheduler;
  }
})();
