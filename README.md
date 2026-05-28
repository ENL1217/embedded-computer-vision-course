# 嵌入式電腦視覺系統｜課程資料庫

> 把視覺大腦放入手機。從 OpenCV 影像處理基礎、Android Chaquopy 嵌入式整合,到 AI 五範式做 RPS。

本 repo 採用「同一門課、多學期」的整理方式。根目錄是跨學期入口；每一學期的實際教材、作業、教師備課與課程檔案放在 `semesters/學期代碼/`。

## 課程網站

部署於 GitHub Pages：

🌐 **<https://enl1217.github.io/embedded-computer-vision-course/>**

## 目前學期

- `semesters/114-2/`：114 學年度第 2 學期(2026 春季)
  - **Part I 影像處理基礎** (W1-W5)：純 Colab 階段
  - **Part II Android 電腦視覺開發** (W6-W8)：Android Studio + Chaquopy
  - **Part III AI 電腦視覺技術** (W9-W15)：五範式做 RPS + 研究地圖 + 期末

## 課程設計

- **同問題、不同方法**：W9-W13 都做猜拳辨識,學生親身體會「工具選擇」的工程判斷
- **Colab 驗算法 → Android 部署**：演算法穩了才搬,搬過去只確認資料進出與格式轉換
- **真實部署**:不只在 Colab 跑通,W9 後每講都到 Android 上實測
- **嵌入式對位**：每個方法都討論「在資源約束下的取捨」(記憶體、延遲、模型大小)

## 適合對象

- 資工 / 電子 / 機電 / AI 相關研究生
- 先備知識:Python 基礎、線性代數、機率統計、基礎 Android(最後可現學)

## 主要工具棧

- Python + OpenCV
- Google Colab + Local Runtime
- Android Studio + Chaquopy + CameraX
- TensorFlow Lite / YOLO / MediaPipe / ML Kit

## repo 結構

```
embedded-computer-vision-course/
├── README.md                      ← 本檔
├── index.html                     ← 跨學期入口
└── semesters/
    └── 114-2/
        ├── 嵌入式電腦視覺_教學指引.html  ← 學期主頁
        ├── PART I 影像處理基礎/        ← W1-W5
        ├── PART II Android電腦視覺開發/ ← W6-W8
        ├── PART III AI電腦視覺技術/     ← W9-W15
        ├── shared/                    ← 共用 CSS/JS/PDF.js/notebooks/models
        ├── 作業與評量/                  ← 各週作業說明 + 期末專題
        └── 歷年資料/                    ← 預留
```

## 部署方式

GitHub Pages 直接服務 `main` branch 根目錄。每次 push 後約 1-2 分鐘自動部署。

## 維護者

謝昇憲(George Hsieh)
雲林科技大學 ｜ Email: <georgeh@yuntech.edu.tw>

## 授權

本教材的文字內容採用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh_TW) 授權(姓名標示-非商業性)。
程式碼採用 MIT License。
版權書籍類教材不上傳本 repo,請依教學手冊提供的官方連結取得。
