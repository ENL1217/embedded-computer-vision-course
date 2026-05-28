# W9 傳統 CV 規則法 RPS（CameraX 即時串流）

> **本週定位**：Part 3「五範式做 RPS」系列**第一棒**。用 W6/W7 學過的古典工具（HSV 膚色 / 形態學 / 輪廓 / 凸缺陷）做出「指縫數法」的猜拳辨識。**先在 Colab 把演算法驗證好，再搬到 Android CameraX**。本週是給 W10-W13 鋪墊「規則法的天花板」。

---

## 整門課的工作流原則 ⭐

```
階段一：Colab 驗算法              階段二：搬上 Android 嵌入式系統
─────────────────              ─────────────────────────
餵靜態圖 / 本地 webcam              CameraX ImageAnalysis 真實串流
Python pipeline 完整跑通       →   Chaquopy 把 Python 嵌入 App
可即時 print / 改 cell debug       Java 處理 frame 抓取 + UI 顯示
專注「演算法是否會贏」              專注「資料進出格式對不對」
```

**為什麼這樣做?** Android 上的 Python 不好除錯——沒有 REPL、log 隔層、改一行要重 build。**演算法穩了才搬，搬過去不重新驗算法，只確認資料進出與格式轉換**。這個原則整門課 Part 2/Part 3 都會用到。

---

## 本週要做的事

| 順序 | 內容 | 預估時間 |
|---|---|---|
| 1 | 課程定位：W9-W13 是「同一題、五種方法」 | 10 min |
| 2 | 本週限制：只能用 W6/W7 工具，**禁用** CNN/YOLO/MediaPipe | 10 min |
| 3 | **Colab 驗算法**：HSV 膚色 + 形態學 + 輪廓 + 凸缺陷 → 指縫數 | 60 min |
| 4 | Colab 端用靜態圖跑通 3 種手勢的分類 | 30 min |
| 5 | **搬到 Android**：把 `rps_classical.py` 放進 `app/src/main/python/` | 20 min |
| 6 | 處理介面格式：NV21 byte[] → BGR ndarray | 20 min |
| 7 | 從 Chaquopy 講義 Ch.13 ImageAnalysis 空殼接續 | 20 min |
| 8 | Java 端 `analyzer` callAttr 呼叫 Python + UI 顯示 | 30 min |

---

## 教材檔案

- **`W9_CameraX_古典RPS.pptx`** (48 張) — 核心投影片
- **`W9_講義_CameraX即時串流_古典RPS.pdf`** (講義文字版)
- **`W9_講義_CameraX即時串流_古典RPS.docx`** (講義可編輯版)
- 共用素材：
  - `shared/assets/images/rock.jpg paper.jpg scissors.jpg` — Ch.7 ORB 樣板比對選做用
  - W6 已部署的 Chaquopy 講義 Ch.10-13（CameraX + ImageAnalysis 基礎）

---

## 完整 Pipeline（最終長相）

```
Android 手機相機
    ↓ CameraX ImageAnalysis（即時串流）
ImageProxy (YUV_420_888)
    ↓ Java imageProxyToNv21()
NV21 byte[]
    ↓ Chaquopy 呼叫 Python（callAttr）
rps_classical.process_frame(nv21_bytes, w, h)
    ↓
NV21 → BGR → HSV 膚色 → 形態學清雜訊
    → 最大輪廓 → 凸包 → 凸缺陷 → 指縫數
    → 分類 (rock / scissors / paper)
    ↓
回傳 (label, n_gaps, debug_jpeg_bytes) 給 Java
    ↓
ImageView 顯示處理結果 + TextView 顯示判斷文字
```

**檔案分工**：
- Python 端：所有 CV 邏輯集中在 `app/src/main/python/rps_classical.py`
- Java 端：CameraX 抓 frame + 呼叫 Python + UI 更新

---

## 本週限制（這是設計重點，不是限制學生）

### ✓ 可以用
- W6 工具：邊緣偵測、形態學、輪廓、形狀特徵
- W7 工具：Harris/FAST、SIFT、ORB、ratio test、RANSAC
- HSV 色彩轉換 / `cv2.findContours` / `cv2.convexHull` / `cv2.convexityDefects`

### ✗ 不可以用
- CNN（MobileNet、ResNet 等）
- YOLO
- MediaPipe / OpenPose
- 任何 deep learning model
- sklearn 含「訓練資料」的方法

### 為什麼要這樣限制?
本週目的不是做出最高正確率，而是讓學生親手體驗「古典 CV 在語意辨識任務上的天花板」。預期正確率 60-80%，下週 W10 ML/DL 把這個數字往上拉到 90%+ —— 那個對比才是學生的學習關鍵。

---

## 指縫數法的核心觀念

```
   石頭 Rock     →  凸缺陷 0 個   → 拳頭近圓形
   剪刀 Scissors →  凸缺陷 1-2 個 → 2 指伸出,中間 1 個指縫
   布   Paper    →  凸缺陷 3-4 個 → 5 指全張,4 個指縫
```

**「有意義的凸缺陷」要過兩個條件**：
1. **深度** > 30 像素（防止手腕誤判、雜訊小凹陷）
2. **兩側手指夾角** < 90°（用餘弦定理算，排除手掌外圍凹陷）

完整 `count_fingers()` 程式碼見 PPT Slide 27。

---

## 從 Chaquopy 講義 Ch.13 接續（學生必須先確認的）

W9 不重新講 Chaquopy 基礎，**直接建立在 W6 已經跑完的 Ch.0-13 上**。開始前學生要確認：

- [ ] 能用 CameraX Preview 看到相機畫面（Ch.10）
- [ ] 能呼叫 Python 函式並接到 byte[] 回傳（Ch.0-9）
- [ ] 理解 NV21 → BGR 轉換（Ch.11）
- [ ] `ImageAnalysis` 的 `analyzer` 流程可以接到 Python 端（Ch.13）

任一項不行就回 W6 Chaquopy 講義對應章節複習。

W9 的核心工作就是把 Ch.13 的這個空殼填滿：
```java
imageAnalysis.setAnalyzer(cameraExecutor, image -> {
    if (frameCount++ % 5 != 0) { image.close(); return; }
    // === 在此處呼叫 Python 處理 ===
    // Ch.13 只用 Canny 做示範
    // W9 要把這裡換成「真正的偵測 pipeline」
    image.close();
});
```

---

## W9 作業｜古典 CV 規則法 RPS

### 一、作業目標

讓你親手實作「規則法 RPS」，**體驗古典 CV 在語意辨識任務上的天花板**。完成後下週 W10 換 ML/DL 時，你會看到正確率從 70% 跳到 90%+，並理解這個跳躍的代價（模型大小、推論成本）來自哪裡。

### 二、作業內容

**Step 1｜Colab 驗算法**
1. 在 Colab 開新 notebook
2. 寫出 `rps_classical.py` 的核心函式：`detect_hand_mask` / `find_largest_contour` / `count_fingers` / `classify_rps`
3. 用三張靜態圖（自拍石頭、剪刀、布）跑通分類
4. 確認三種手勢分類正確才往下一步

**Step 2｜搬到 Android**
1. 把 `rps_classical.py` 放進 Android 專案 `app/src/main/python/`
2. 加上 `process_frame(nv21_bytes, w, h)` 作為 Chaquopy 入口
3. 在 Python 端處理 NV21 → BGR 的格式轉換（PPT Slide 31）
4. **這步驟不用重新驗算法，只確認資料進出格式正確**

**Step 3｜整合 CameraX**
1. 用 CameraX `ImageAnalysis` 即時抓取相機畫面（Chaquopy 講義 Ch.13）
2. Java 端 `imageProxyToNv21()` 取得 byte[]，用 `callAttr` 傳給 Python
3. 接收 Python 回傳的 `(label, n_gaps, jpeg)`
4. UI 上即時顯示判斷結果（rock / scissors / paper）

**Step 4｜驗證效果**
- 在固定背景下，三種手勢的正確率達 **60% 以上**

### 三、加分項（任選）

- **(+1)** 整合 ORB 樣板比對作為「第二意見」，兩種方法投票（用 `shared/assets/images/rock.jpg` 等做樣板）
- **(+2)** 加入「畫面凍結 0.5 秒後才更新結果」減少抖動
- **(+3)** 整合 W6 學過的 contour 屬性（面積、緊密度）作為輔助特徵
- **(+4)** UI 上顯示 debug 視覺化（輪廓綠線、凸包紅線、指縫藍點）

### 四、繳交內容

- **30 秒測試影片**：自拍三種手勢，標記正確率
- **`.doc` 簡易報告**：說明做了什麼、遇到什麼問題

### 五、注意事項

- HSV 膚色範圍不同人差很多，**先用自己手調**，再測同學的會更準
- Step 2 搬到 Android 時若分類錯誤，先檢查**格式轉換**（NV21 → BGR）而非演算法
- `cv2.convexHull` 的 `returnPoints` 參數務必依用途設對（PPT Slide 23）
- Chaquopy 安裝 `opencv-python` 第一次 build 可能 5-10 分鐘
- 若有問題可先問 Colab Gemini，再問老師

---

## 常見錯誤排除

| 症狀 | 可能原因 | 處理 |
|---|---|---|
| Mask 整張白 | HSV 範圍太寬 | 從 `(0,30,60)-(20,150,255)` 開始調 |
| 凸缺陷數總是 0 | `cv2.convexHull` 沒用 `returnPoints=False` | 看 PPT Slide 23 參數差異 |
| 戴眼鏡 / 臉入鏡被當成手 | 沒過濾面積 | `cv2.contourArea(largest) < 5000` 時 return None |
| 五指張開但只算到 3 個指縫 | 深度閾值太大 | 把 `depth < 30` 改成 `depth < 20` |
| App OOM crash | 沒釋放 ImageProxy | 確認 `image.close()` 在每條路徑都有呼叫 |
| **Colab 跑對但 Android 跑錯** | NV21 → BGR 格式轉換錯 | 對照 PPT Slide 31 `process_frame()` |
| 推論很卡 | Frame 太多 | `frameCount % 5 == 0` + `STRATEGY_KEEP_ONLY_LATEST` |

---

## 學生檢核表

下課前要打勾的：

- [ ] Colab 端用靜態圖跑通三種手勢分類
- [ ] App 可以 build + install 到手機
- [ ] CameraX preview 看得到相機畫面
- [ ] Python `rps_classical.process_frame()` 在 Android 上被呼叫到（log 可見）
- [ ] 畫面上看到 `rock` / `scissors` / `paper` 文字會更新
- [ ] 自己對手勢測 5 次，至少 3 次對
- [ ] 30 秒測試影片錄好
- [ ] 簡易報告寫好

---

## 下週預告（W10）

**同一個 RPS 題目，換 ML/DL 做**：
- `sklearn` 的 **SVM + HoG 特徵** 訓練分類器 → `shared/assets/models/hog_svm_rps.pkl` 已準備好
- **TensorFlow Lite + MobileNetV2** → `shared/assets/models/rps_mobilenetv2.tflite` 已準備好

學生會看到正確率從 70% 跳到 90%+ —— 但代價是模型大小與推論成本。**這個對比就是這個系列的核心學習**。

---

## 教師備課頁

學生頁只保留學習流程。授課者可另外查看本週課堂節奏、學生卡點與環境地雷。

→ [開啟 W9 教師備課指引](_draft_教師備課指引.md)
