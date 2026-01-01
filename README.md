# 9n-excel-letter-cross-comparison

Excel 格子內容交叉比對工具。上傳 A、B 兩個 Excel 檔案，快速找出兩邊的差異與共同內容。

**Demo:** https://marshal604.github.io/9n-excel-letter-cross-comparison/

## Purpose

比對兩個 Excel 檔案中所有格子的內容，顯示：

- **Only in A** - A 獨有的值
- **Common (A ∩ B)** - AB 兩邊共同有的值
- **Only in B** - B 獨有的值

適用於：
- 比對兩份名單的差異
- 找出重複或缺漏的資料
- 資料合併前的檢查

## Features

- 拖放或點擊上傳檔案
- 支援 `.xlsx`、`.xls`、`.csv` 格式
- 自動讀取所有 sheets
- 即時顯示比對結果
- 深色主題 + 動畫效果

## Usage

1. 上傳 File A
2. 上傳 File B
3. 點擊 "Compare Files"
4. 查看三種比對結果

## Development

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run deploy
```

## Tech Stack

- React 19 + TypeScript + Vite
- SheetJS (xlsx)
- gh-pages

## License

MIT
