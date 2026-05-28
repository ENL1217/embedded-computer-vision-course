/* =============================================================
 * Google Analytics 4 + 課程特定事件追蹤
 * 嵌入式電腦視覺系統 ｜ 114-2
 *
 * 設定步驟:
 *   1. 到 https://analytics.google.com 建一個 GA4 屬性
 *   2. 拿到「Measurement ID」(格式: G-XXXXXXXXXX)
 *   3. 把下面的 GA_ID 改成你的 ID
 *   4. 部署後 24 小時內 GA 後台會有資料
 *
 * 事件清單 (除了 page_view 自動觸發,其他需手動呼叫):
 *   - page_view           ← 內建,每頁進入自動觸發
 *   - pdf_page_view       ← PDF.js 翻頁觸發 (pdf-viewer.html 內呼叫)
 *   - assignment_click    ← 點作業連結 (自動委派,本檔處理)
 *   - external_link_click ← 點外部連結 (Colab/YouTube 等,自動委派)
 *
 * 呼叫方式:
 *   window.courseTrack('pdf_page_view', { pdf_file: 'W1.pdf', page_number: 5 });
 * ========================================================== */

(function () {
  // === 設定 (GA4 Measurement ID) ===
  const GA_ID = 'G-PXDNKPJ53Q';

  // 偵測是否還是預設值
  if (GA_ID === 'G-XXXXXXXXXX') {
    console.warn('⚠️ GA Analytics 未設定 — 請改 shared/js/analytics.js 的 GA_ID');
    // 仍然提供 stub,讓其他 script 不會出錯
    window.courseTrack = function () { /* no-op */ };
    return;
  }

  // === 載入 GA4 gtag.js ===
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID, {
    // 隱私:不蒐集 IP 完整位數 (符合 GDPR)
    anonymize_ip: true
  });

  // === 統一的事件追蹤介面 ===
  window.courseTrack = function (event, params) {
    if (typeof gtag !== 'undefined') {
      gtag('event', event, params || {});
    }
  };

  // === 自動追蹤:點作業連結 ===
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    // 點到作業頁
    if (href.includes('作業與評量')) {
      window.courseTrack('assignment_click', {
        target: link.textContent.trim().slice(0, 50),
        href: href
      });
      return;
    }

    // 點到 Colab / YouTube / GitHub 等外連
    if (href.startsWith('http') && !href.includes(location.hostname)) {
      let category = 'external';
      if (href.includes('colab.research.google.com')) category = 'colab';
      else if (href.includes('youtube.com') || href.includes('youtu.be')) category = 'youtube';
      else if (href.includes('github.com')) category = 'github';

      window.courseTrack('external_link_click', {
        category: category,
        url: href,
        text: link.textContent.trim().slice(0, 50)
      });
    }
  });
})();
