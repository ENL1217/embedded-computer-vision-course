/* =============================================================
 * Layer 1 教材保護腳本
 * 嵌入式電腦視覺系統 114-2
 *
 * 功能:
 * - 禁右鍵 (避免「另存圖片/另存連結」)
 * - 程式碼區塊保留選取功能 (學生要抄程式)
 *
 * 注意: F12 / view-source 仍可繞過,這只是降低隨手下載的門檻
 * ========================================================== */

(function () {
  // 等 DOM 載入完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // 加上 protected class (觸發 CSS 禁選取)
    document.body.classList.add('protected');

    // 禁右鍵 (例外: pre/code 區塊允許,讓學生複製程式)
    document.addEventListener('contextmenu', function (e) {
      const target = e.target;
      const isCode = target.closest('pre, code');
      if (!isCode) {
        e.preventDefault();
      }
    });

    // 禁拖拉圖片
    document.addEventListener('dragstart', function (e) {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    });
  }
})();
