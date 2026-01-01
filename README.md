# 9n-excel-letter-cross-comparison

A web tool for comparing cell values between two Excel files. Upload two Excel files (A and B) and instantly see:

- **Only in A**: Values that exist only in File A
- **Common (A n B)**: Values that exist in both files
- **Only in B**: Values that exist only in File B

## Features

- Drag & drop file upload
- Supports `.xlsx`, `.xls`, and `.csv` files
- Reads all sheets in each Excel file
- Real-time comparison results
- Responsive design with dark theme
- Deployed on GitHub Pages

## Usage

1. Upload File A (drag & drop or click to browse)
2. Upload File B (drag & drop or click to browse)
3. Click "Compare Files"
4. View the comparison results in three categories

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for GitHub Pages deployment:

```bash
# Deploy to gh-pages branch
npm run deploy
```

After deploying, enable GitHub Pages in your repository settings:
1. Go to Settings > Pages
2. Set Source to "Deploy from a branch"
3. Select the `gh-pages` branch

## Tech Stack

- React 19
- TypeScript
- Vite
- SheetJS (xlsx) for Excel parsing
- gh-pages for deployment

## License

MIT
