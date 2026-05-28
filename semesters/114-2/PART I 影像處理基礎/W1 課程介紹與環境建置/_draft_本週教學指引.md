# W1 課程介紹與環境建置

> **本週定位**：整門課第一堂。建立對「電腦視覺是什麼」的認識，把 Colab + OpenCV 環境跑通。這套環境會一路用到 W5，且在 Part 2/3 也是「Colab 驗算法 → Android 部署」工作流的前半。

---

## 本週要做的事

| 順序 | 內容 | 預估時間 |
|---|---|---|
| 1 | 認識 CV 三層架構（Low / Mid / High Level）與 9 個經典挑戰 | 60 min |
| 2 | 看 CV 今天能做什麼（OCR / 生物辨識 / 自駕 / Vision Pro 等） | 30 min |
| 3 | 課程地圖 + 評分方式 + 加 Line 群組 | 20 min |
| 4 | **動手**：Colab + Google Drive 掛載 + 第一張 OpenCV 圖 | 60 min |
| 5 | 統計同學背景（Python / Colab / OpenCV 經驗） | 10 min |

---

## 教材檔案

- **`2026-03-06 Computer Vision系統課程介紹與環境建置.pdf`** (80 頁) — 核心投影片
- **W1 作業說明**：在「作業與評量 / W1_Colab讀圖 / W1作業.txt」

---

## 課程的三層架構（學生帶走的核心觀念）

```
   High Level Vision  → Category / Activity recognition / Deep understanding
        ↑
   Mid Level Vision   → 3D Reconstruction / Depth / Motion Estimation
        ↑
   Low Level Vision   → Measurements / Enhancement / Region / Features
        ↑
        影像本身（pixels）
```

整門課的弧線：
- **Part 1 (W1-W5)**：Low Level — 從像素到色彩，純 Colab
- **Part 2 (W6-W8)**：Mid Level — Android 上做古典特徵
- **Part 3 (W9-W15)**：High Level — AI 五範式做 RPS + 研究方向

---

## 整門課的工作流原則 ⭐

從 Part 2 開始，每週都會走「Colab 驗算法 → Android 部署」這條工作流。本週先讓學生把 Colab 那半邊跑熟：

```
Colab 驗算法              Android 嵌入式系統部署
────────────              ──────────────────────
靜態圖 / webcam            CameraX ImageAnalysis 真實串流
Python pipeline 跑通   →   Chaquopy 嵌入 Python
即時 print / 改 cell        Java 處理 frame + UI
專注「算法是否會贏」         專注「資料進出格式對不對」
```

**為什麼這樣切?** Android 上 Python 不好除錯——沒 REPL、log 隔層、改一行要重 build。**演算法穩了才搬，搬過去不重新驗算法，只確認資料進出與格式轉換**。這個原則整門課反覆使用。

W1-W5 是 Colab 階段的基礎訓練，W6 之後才開始搬。

---

## CV 為什麼難？9 個挑戰（投影片 p.30-38）

學生要在這節記住的東西：
1. **Viewpoint variation** 視角變
2. **Illumination** 光線變
3. **Occlusion** 遮擋
4. **Scale** 尺寸變
5. **Deformation** 變形
6. **Background clutter** 背景雜亂
7. **Intra-class variation** 同類差異大
8. **Local ambiguity** 局部歧義
9. **The world behind the image** 影像背後的世界

這 9 個挑戰會在 W6-W7 古典特徵被部分解決，但完整解決要等 W10 ML/DL 之後。

---

## 評分機制

| 項目 | 比重 |
|---|---|
| 出勤與課堂作業 | **60%** |
| 期中考 | **20%** |
| 期末專題 | **20%** |

期末專題在 W15 報告。

---

## W1 作業｜Colab + OpenCV 讀圖

### 一、作業目標

熟悉 Google Colab 環境，透過 OpenCV (cv2) 讀取、顯示、儲存影像，並學會將 Google Drive 與 Colab 連結。整門課所有 Colab 端的實作都從這裡開始。

### 二、作業內容

1. 使用 Google Colab 建立新的 Python Notebook
2. 將 Google Drive 掛載至 Colab
3. 切換到自訂資料夾（例如 `/content/drive/My Drive/Colab Notebooks/Image Process`）
4. 確認資料夾內容
5. 讀取自訂影像檔（例如 `Lenna.bmp`）
6. 檢查檔案是否存在
7. 以灰階模式讀取影像
8. 顯示影像尺寸
9. 顯示影像
10. 將影像儲存為 `resize.jpg`

### 三、參考程式碼

```python
import os
import cv2
from google.colab.patches import cv2_imshow
from google.colab import drive

# 掛載 Google Drive
drive.mount('/content/drive')

# 切換至指定資料夾
os.chdir('/content/drive/My Drive/Colab Notebooks/Image Process')
os.listdir()  # 確認目錄內容

# 設定影像路徑
image_path = "Lenna.bmp"

# 檢查檔案是否存在
if not os.path.exists(image_path):
    print(f"Error: Image file not found: {image_path}")
    exit()

# 讀取影像（灰階）
image = cv2.imread(image_path, 0)
print(image.shape)

# 顯示影像
cv2_imshow(image)

# 儲存影像
cv2.imwrite('resize.jpg', image)
```

### 四、繳交內容

執行成功的**截圖**（含影像、shape 輸出、儲存結果）。

### 五、注意事項

- 請確認測試圖片 `Lenna.bmp` 已放置於指定資料夾
- 若檔案不存在，程式應顯示錯誤訊息
- 請依照步驟執行並觀察執行結果
- 若有問題可先詢問 Colab 內建的 Gemini，再問老師

---

## 學生檢核表

下課前要打勾的：

- [ ] 我有 Google 帳號可以登入 Colab
- [ ] 我能在 Colab 開新 notebook
- [ ] 我能把 Google Drive 掛載到 Colab
- [ ] 我有跑出 Lenna.bmp 的灰階圖
- [ ] 我有把結果存成 `resize.jpg`
- [ ] 我已加入課程 Line 群組

---

## 講師資訊

- **授課教師**：謝昇憲
- **辦公室**：EN306
- **Office Hour**：每週三 13:00–14:00
- **Email**：`georgeh@yuntech.edu.tw`

---

## 下週預告（W2）

進入 **Camera Pipeline** — 從 Sensor → ISP → Raw → Color 的成像流程，並架起 **Colab + 本地 Webcam 即時串流**（這是後面所有「即時影像」實驗的基礎）。

W2 的串流架構講義已準備好：本資料夾的同階 `W2 Camera Pipeline 與 Colab Webcam/W2 colab+webcam.html`。

---

## 教師備課頁

學生頁只保留學習流程。授課者可另外查看本週課堂節奏、學生卡點與環境地雷。

→ [開啟 W1 教師備課指引](_draft_教師備課指引.md)
