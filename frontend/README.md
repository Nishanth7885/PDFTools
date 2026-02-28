# 🛠️ PDFTools

A full-stack web application for PDF manipulation, image processing, and media conversion. Built with **Next.js** (frontend) and **Express.js** (backend).

---

## 📦 Dependencies

### Prerequisites

| Dependency | Version | Description |
|---|---|---|
| [Node.js](https://nodejs.org/) | >= 18.x | JavaScript runtime environment |
| [npm](https://www.npmjs.com/) | >= 9.x | Node package manager (comes with Node.js) |

---

### Frontend Dependencies

| Package | Version | Description |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.1.6 | React framework for server-side rendering & routing |
| [React](https://react.dev/) | 19.2.3 | UI component library |
| [React DOM](https://react.dev/) | 19.2.3 | React rendering for the browser |
| [pdfjs-dist](https://github.com/niclasp/pdfjs-dist) | ^5.4.624 | PDF rendering & parsing in the browser |

---

### Backend Dependencies

| Package | Version | Description |
|---|---|---|
| [Express](https://expressjs.com/) | ^5.2.1 | Web server framework for Node.js |
| [cors](https://github.com/expressjs/cors) | ^2.8.6 | Cross-Origin Resource Sharing middleware |
| [Multer](https://github.com/expressjs/multer) | ^2.0.2 | Middleware for handling file uploads (`multipart/form-data`) |
| [pdf-lib](https://pdf-lib.js.org/) | ^1.17.1 | Create & modify PDF documents (merge, split, rotate, watermark, etc.) |
| [PDFKit](https://pdfkit.org/) | ^0.17.2 | PDF generation library (used for creating PDFs from scratch) |
| [pdf-parse](https://www.npmjs.com/package/pdf-parse) | ^2.4.5 | Extract text content from PDF files |
| [sharp](https://sharp.pixelplumbing.com/) | ^0.34.5 | High-performance image processing (resize, compress, convert) |
| [Mammoth](https://github.com/mwilliamson/mammoth.js) | ^1.11.0 | Convert Word documents (`.docx`) to HTML |
| [docx](https://docx.js.org/) | ^9.6.0 | Generate Word documents (`.docx`) programmatically |
| [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) | ^2.1.3 | FFmpeg wrapper for audio/video processing |
| [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static) | ^5.3.0 | Static FFmpeg binaries (no system install needed) |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd PDFtools
```

### 2. Install dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Run the development servers

**Backend** (runs on default port):

```bash
cd backend
npm run dev
```

**Frontend** (runs on [http://localhost:3000](http://localhost:3000)):

```bash
cd frontend
npm run dev
```

---

## 📁 Project Structure

```
PDFtools/
├── backend/
│   ├── controllers/     # Route handler logic
│   ├── routes/          # API route definitions
│   ├── uploads/         # Temporary file upload storage
│   ├── output/          # Processed file output
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/app/         # Next.js App Router pages
│   │   ├── pdf-merger/
│   │   ├── split-pdf/
│   │   ├── rotate-pdf/
│   │   ├── pdf-compressor/
│   │   ├── jpg-to-pdf/
│   │   ├── pdf-to-jpg/
│   │   ├── pdf-to-word/
│   │   ├── word-to-pdf/
│   │   ├── html-to-pdf/
│   │   ├── watermark-pdf/
│   │   ├── unlock-pdf/
│   │   ├── pdf-password/
│   │   ├── page-numbers/
│   │   ├── organize-pdf/
│   │   ├── image-converter/
│   │   ├── image-resizer/
│   │   ├── jpg-compressor/
│   │   ├── audio-converter/
│   │   ├── video-to-audio/
│   │   ├── metadata-stripper/
│   │   └── privacy-policy/
│   └── package.json
└── README.md
```

---

## ✨ Features

- **PDF Tools** — Merge, Split, Rotate, Compress, Watermark, Add Page Numbers, Organize, Lock/Unlock
- **Conversion** — PDF ↔ JPG, PDF ↔ Word, HTML → PDF
- **Image Tools** — Convert formats, Resize, Compress JPG, Strip Metadata
- **Media Tools** — Audio conversion, Video to Audio extraction

---

## 📄 License

ISC
