const fs = require('fs');
const path = require('path');

const seoData = {
    'split-pdf': {
        h1: 'Split PDF Online \u2014 Free PDF Page Extractor',
        seo: '<SeoContent>\n                    <h2>How to Split PDF Files for Free</h2>\n                    <p>Our PDF splitter lets you extract specific pages from any PDF document. Simply enter the page numbers or ranges you want (e.g., 1-3, 5, 8-10) and download only the pages you need as a new, smaller PDF.</p>\n                    <p><strong>Supported formats:</strong> Any standard PDF file up to 50MB. Works with reports, contracts, ebooks, manuals, and any multi-page PDF document.</p>\n                    <p><strong>Common use cases:</strong> Extracting chapters from textbooks, separating individual pages from scanned documents, pulling specific pages from legal contracts, and trimming large PDF files to share only relevant content.</p>\n                    <p>Safe File Converter processes your file securely and deletes it immediately after download. No signup, no watermarks, no daily limits \u2014 completely free forever.</p>\n                </SeoContent>'
    },
    'pdf-merger': {
        h1: 'Merge PDF Online \u2014 Free PDF Combiner',
        seo: '<SeoContent>\n                    <h2>How to Merge PDF Files for Free</h2>\n                    <p>Upload multiple PDF files and combine them into a single document in seconds. Drag and drop to reorder pages before merging. The output preserves all original formatting, images, and text perfectly.</p>\n                    <p><strong>Supported formats:</strong> Upload up to 20 PDF files at once, each up to 50MB. Works with any standard PDF \u2014 reports, invoices, certificates, scanned pages, and more.</p>\n                    <p>Unlike iLovePDF or SmallPDF which limit free merges, Safe File Converter offers unlimited merges with no watermarks, no signup, and zero data retention.</p>\n                </SeoContent>'
    },
    'pdf-to-jpg': {
        h1: 'Convert PDF to JPG Online \u2014 Free PDF to Image',
        seo: '<SeoContent>\n                    <h2>How to Convert PDF to JPG for Free</h2>\n                    <p>This tool renders each page of your PDF as a high-resolution JPG image directly in your browser. No server upload required \u2014 your files stay completely private on your device.</p>\n                    <p><strong>Common use cases:</strong> Creating image previews of PDF documents, extracting graphics from PDFs, converting PDF presentations to images for social media, and preparing document images for websites.</p>\n                    <p>100% free, no signup required, no daily limits, and no watermarks. Safe File Converter processes everything client-side for maximum privacy.</p>\n                </SeoContent>'
    },
    'jpg-to-pdf': {
        h1: 'Convert JPG to PDF Online \u2014 Free Image to PDF',
        seo: '<SeoContent>\n                    <h2>How to Convert Images to PDF for Free</h2>\n                    <p>Upload multiple JPG or PNG images and instantly combine them into a single, professional PDF document. Each image becomes its own page, maintaining original quality and aspect ratio.</p>\n                    <p><strong>Common use cases:</strong> Converting scanned documents into a single PDF, creating photo portfolios, combining receipt images for expense reports, and preparing image-based presentations.</p>\n                    <p>Completely free with no signup, no file limits, and instant processing. Your images are processed securely on our server and deleted immediately.</p>\n                </SeoContent>'
    },
    'pdf-to-word': {
        h1: 'Convert PDF to Word Online \u2014 Free PDF to DOCX',
        seo: '<SeoContent>\n                    <h2>How to Convert PDF to Word for Free</h2>\n                    <p>Our converter extracts text content from your PDF and generates an editable Microsoft Word (.docx) document. The output preserves headings, paragraphs, and basic formatting for easy editing.</p>\n                    <p><strong>Common use cases:</strong> Editing text in a PDF without Adobe Acrobat, updating old documents, repurposing PDF content for new reports, and making changes to received contracts.</p>\n                    <p>Safe File Converter is 100% free with no signup and no watermarks. Files are processed and deleted instantly \u2014 we never store your data.</p>\n                </SeoContent>'
    },
    'pdf-to-ppt': {
        h1: 'Convert PDF to PowerPoint \u2014 Free PDF to PPTX',
        seo: '<SeoContent>\n                    <h2>How to Convert PDF to PowerPoint for Free</h2>\n                    <p>This tool converts each page of your PDF into a high-fidelity PowerPoint slide. Each page is rendered as an image and embedded into the PPTX file, preserving fonts, layouts, charts, and visual elements exactly as they appear.</p>\n                    <p><strong>Common use cases:</strong> Converting lecture slides from PDF to editable presentations, repurposing PDF reports as slide decks, and editing company presentations distributed as PDFs.</p>\n                    <p>100% free, no signup, browser-based conversion. Your files never leave your device \u2014 complete privacy guaranteed.</p>\n                </SeoContent>'
    },
    'word-to-pdf': {
        h1: 'Convert Word to PDF Online \u2014 Free DOCX to PDF',
        seo: '<SeoContent>\n                    <h2>How to Convert Word to PDF for Free</h2>\n                    <p>Upload your Microsoft Word document and convert it to a professional, universally compatible PDF file in seconds. The PDF preserves your formatting, fonts, images, and layout exactly as intended.</p>\n                    <p><strong>Common use cases:</strong> Finalizing resumes for job applications, submitting assignments in PDF format, sharing contracts that shouldn\'t be easily edited, and preparing documents for print.</p>\n                    <p>Free forever with no watermarks, no signup, and immediate file deletion. Safe File Converter ensures your documents remain private.</p>\n                </SeoContent>'
    },
    'rotate-pdf': {
        h1: 'Rotate PDF Pages Online \u2014 Free PDF Rotator',
        seo: '<SeoContent>\n                    <h2>How to Rotate PDF Pages for Free</h2>\n                    <p>Fix sideways or upside-down PDF pages instantly. Choose 90\u00b0, 180\u00b0, or 270\u00b0 rotation and apply it to every page. The rotated PDF downloads immediately with all content preserved.</p>\n                    <p><strong>Common use cases:</strong> Fixing scanned documents that were fed sideways, correcting landscape vs portrait orientation, and preparing PDFs for proper viewing on different devices.</p>\n                    <p>100% free, no signup, no watermarks. Processed securely with instant deletion.</p>\n                </SeoContent>'
    },
    'watermark-pdf': {
        h1: 'Add Watermark to PDF Online \u2014 Free PDF Watermark Tool',
        seo: '<SeoContent>\n                    <h2>How to Add Watermarks to PDFs for Free</h2>\n                    <p>Protect your PDF documents by adding a custom text watermark across every page. Fully customize the watermark text, font size, opacity, color, and rotation angle. Perfect for branding and copyright protection.</p>\n                    <p><strong>Common use cases:</strong> Adding "CONFIDENTIAL" or "DRAFT" labels, branding client deliverables, protecting intellectual property, and marking preview copies of ebooks or reports.</p>\n                    <p>Free with no signup, no limits, and zero data retention. Safe File Converter never stores your documents.</p>\n                </SeoContent>'
    },
    'pdf-password': {
        h1: 'Protect PDF with Password \u2014 Free PDF Encryption',
        seo: '<SeoContent>\n                    <h2>How to Password Protect a PDF for Free</h2>\n                    <p>Encrypt your PDF with a strong password using AES encryption. Once protected, the PDF cannot be opened without entering the correct password. This tool uses industry-standard encryption for maximum security.</p>\n                    <p><strong>Common use cases:</strong> Protecting financial documents, securing legal contracts before email, encrypting medical records, and adding passwords to tax returns shared with accountants.</p>\n                    <p>100% free, no signup needed. Your file is encrypted and deleted from our server immediately after download.</p>\n                </SeoContent>'
    },
    'unlock-pdf': {
        h1: 'Unlock PDF Online \u2014 Free PDF Password Remover',
        seo: '<SeoContent>\n                    <h2>How to Remove PDF Passwords for Free</h2>\n                    <p>Unlock password-protected PDF files so you can open, print, and edit them freely. Upload your locked PDF, enter the correct password, and download the unlocked version without any restrictions.</p>\n                    <p><strong>Common use cases:</strong> Unlocking old documents where you know the password but want restriction-free access, removing editing restrictions from your own files, and preparing PDFs for easy sharing.</p>\n                    <p>Free, fast, and private. No signup required. Files are processed and deleted instantly.</p>\n                </SeoContent>'
    },
    'page-numbers': {
        h1: 'Add Page Numbers to PDF \u2014 Free Online Tool',
        seo: '<SeoContent>\n                    <h2>How to Add Page Numbers to a PDF for Free</h2>\n                    <p>Automatically add sequential page numbers to every page of your PDF document. Choose from six positions: top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right.</p>\n                    <p><strong>Common use cases:</strong> Adding page numbers to reports before printing, numbering thesis or dissertation pages, organizing multi-page contracts, and preparing documents for professional binding.</p>\n                    <p>Completely free with no signup or watermarks. Powered by Safe File Converter.</p>\n                </SeoContent>'
    },
    'organize-pdf': {
        h1: 'Organize PDF Pages \u2014 Free PDF Page Manager',
        seo: '<SeoContent>\n                    <h2>How to Reorganize PDF Pages for Free</h2>\n                    <p>Take full control of your PDF page order. Enter the exact page sequence you want \u2014 reorder pages, duplicate specific pages, or remove unwanted ones. Example: "3,1,2,5-8" creates a new PDF with page 3 first, then 1, 2, then pages 5 through 8.</p>\n                    <p><strong>Common use cases:</strong> Rearranging presentation slides, removing blank or irrelevant pages, duplicating important pages, and creating custom excerpts from large documents.</p>\n                    <p>Free forever with no limits. Files processed securely and deleted immediately.</p>\n                </SeoContent>'
    },
    'html-to-pdf': {
        h1: 'Convert Text to PDF Online \u2014 Free Text to PDF Creator',
        seo: '<SeoContent>\n                    <h2>How to Create a PDF from Text for Free</h2>\n                    <p>Type or paste your text and instantly convert it to a professional, formatted PDF document. Our tool supports basic formatting including headings (#, ##, ###), bullet points (- or *), and paragraph spacing.</p>\n                    <p><strong>Common use cases:</strong> Converting meeting notes to shareable PDFs, creating quick letters or memos, turning README text into documents, and generating formatted reports from plain text.</p>\n                    <p>100% free, no signup, instant PDF generation. Powered by Safe File Converter.</p>\n                </SeoContent>'
    },
    'print-ready-pdf': {
        h1: 'Print-Ready PDF Converter \u2014 Free CMYK, 300 DPI, Bleed',
        seo: '<SeoContent>\n                    <h2>How to Make a Print-Ready PDF for Free</h2>\n                    <p>Our prepress tool prepares your PDF for professional printing by converting RGB to CMYK, ensuring all images meet the 300 DPI minimum, and optionally adding bleed margins around the document edges.</p>\n                    <p><strong>Common use cases:</strong> Preparing designs for Vistaprint, MOO, or local print shops, ensuring Etsy printable files meet quality standards, preflighting business card and flyer designs, and converting Canva exports to print-ready format.</p>\n                    <p>This tool replaces the $240/year Adobe Acrobat prepress workflow entirely. Free forever with no signup and no limits.</p>\n                </SeoContent>'
    },
    'jpg-compressor': {
        h1: 'Compress JPG Online \u2014 Free Image Compressor',
        seo: '<SeoContent>\n                    <h2>How to Compress Images for Free</h2>\n                    <p>Reduce your image file sizes by up to 90% without noticeable quality loss. Our compressor uses MozJPEG optimization, the same engine used by tech companies to serve billions of images efficiently.</p>\n                    <p><strong>Common use cases:</strong> Optimizing images for websites and blogs, reducing photo sizes for email attachments, compressing product images for online stores, and preparing images for social media.</p>\n                    <p>100% free with no signup, no limits, and no watermarks. Processed securely by Safe File Converter.</p>\n                </SeoContent>'
    },
    'image-resizer': {
        h1: 'Resize Image Online \u2014 Free Image Resizer',
        seo: '<SeoContent>\n                    <h2>How to Resize Images for Free Online</h2>\n                    <p>Resize any image to exact pixel dimensions or a target file size. Set custom width and height, maintain aspect ratio, or let our tool automatically determine the best dimensions for your target size.</p>\n                    <p><strong>Common use cases:</strong> Resizing photos for passport/visa applications, creating properly sized social media images, meeting upload requirements for job portals, and batch-preparing product images.</p>\n                    <p>Completely free with instant results. No signup, no daily limits. Powered by Safe File Converter.</p>\n                </SeoContent>'
    },
    'image-converter': {
        h1: 'Convert Image Format Online \u2014 Free Image Converter',
        seo: '<SeoContent>\n                    <h2>How to Convert Image Formats for Free</h2>\n                    <p>Convert images between all major formats including JPG, PNG, WebP, AVIF, TIFF, and GIF. Our converter handles format-specific features like transparency (PNG), animation (GIF), and next-gen compression (WebP, AVIF).</p>\n                    <p><strong>Common use cases:</strong> Converting HEIC/HEIF photos from iPhone, preparing WebP images for websites, converting PNG screenshots to JPG for smaller sizes, and creating AVIF images for optimal web performance.</p>\n                    <p>Free forever, no signup, instant conversion. Safe File Converter processes and deletes your files immediately.</p>\n                </SeoContent>'
    },
    'metadata-stripper': {
        h1: 'Remove Image Metadata \u2014 Free EXIF Data Stripper',
        seo: '<SeoContent>\n                    <h2>Why You Should Remove Image Metadata</h2>\n                    <p>Every photo contains hidden EXIF metadata including GPS coordinates, camera model, date/time, and lens settings. Sharing photos online exposes your exact location and personal details to anyone who downloads the image.</p>\n                    <p><strong>What we strip:</strong> GPS coordinates, camera make/model, lens info, date stamps, software used, copyright info, thumbnail previews, and all other EXIF/IPTC/XMP metadata fields.</p>\n                    <p>100% free with instant results. No signup, no limits. Your photos stay private with Safe File Converter.</p>\n                </SeoContent>'
    },
    'video-to-audio': {
        h1: 'Extract Audio from Video \u2014 Free Video to Audio Converter',
        seo: '<SeoContent>\n                    <h2>How to Extract Audio from Video for Free</h2>\n                    <p>Upload any video file and extract just the audio track as a separate audio file. Choose your preferred output format and bitrate. Our FFmpeg-powered engine handles all major video formats.</p>\n                    <p><strong>Supported:</strong> Input: MP4, MKV, AVI, MOV, WebM. Output: MP3, WAV, AAC, OGG, FLAC, OPUS, M4A. Adjustable bitrate from 64kbps to 320kbps.</p>\n                    <p>Free forever with no signup and no limits. Safe File Converter processes and deletes your video immediately.</p>\n                </SeoContent>'
    },
    'audio-converter': {
        h1: 'Convert Audio Online \u2014 Free Audio Format Converter',
        seo: '<SeoContent>\n                    <h2>How to Convert Audio Files for Free</h2>\n                    <p>Convert audio files between all major formats with adjustable quality settings. Our FFmpeg-powered engine handles lossless (FLAC, WAV) and lossy (MP3, AAC, OGG) formats with configurable bitrate.</p>\n                    <p><strong>Supported:</strong> MP3, WAV, AAC, OGG, FLAC, OPUS, M4A, WMA. Convert in any direction. Adjustable bitrate from 64kbps to 320kbps.</p>\n                    <p>100% free with no signup, no daily limits, and no watermarks. Processed securely by Safe File Converter.</p>\n                </SeoContent>'
    },
    'heic-to-jpg-batch': {
        h1: 'Convert HEIC to JPG \u2014 Free Batch HEIC Converter',
        seo: '<SeoContent>\n                    <h2>How to Convert HEIC to JPG for Free</h2>\n                    <p>Convert Apple HEIC/HEIF image format to universally compatible JPG in batch. HEIC is the default photo format on iPhones and iPads, but most websites, printers, and Windows PCs don\'t support it natively.</p>\n                    <p><strong>Common use cases:</strong> Making iPhone photos compatible with Windows, preparing HEIC photos for online forms, converting photos for printing services that only accept JPG, and sharing iPhone photos with Android users.</p>\n                    <p>100% free, browser-based conversion. No signup, no limits. Your photos never leave your device.</p>\n                </SeoContent>'
    }
};

const appDir = path.join('d:', 'PDFtools', 'frontend', 'src', 'app');

for (const [folder, data] of Object.entries(seoData)) {
    const pageFile = path.join(appDir, folder, 'page.js');
    if (!fs.existsSync(pageFile)) {
        console.log('SKIP: ' + folder);
        continue;
    }

    let content = fs.readFileSync(pageFile, 'utf8');

    // Add SeoContent import if not present
    if (!content.includes('SeoContent')) {
        if (content.includes("import FileUploader from '@/components/FileUploader';")) {
            content = content.replace(
                "import FileUploader from '@/components/FileUploader';",
                "import FileUploader from '@/components/FileUploader';\nimport SeoContent from '@/components/SeoContent';"
            );
        }
    }

    // Update H1
    const h1Match = content.match(/<h1>([^<]+)<\/h1>/);
    if (h1Match && data.h1) {
        content = content.replace(h1Match[0], '<h1>' + data.h1 + '</h1>');
    }

    // Add SEO block before last </div> + Footer if not already there
    if (!content.includes('<SeoContent>')) {
        const lastAdSense = content.lastIndexOf('<AdSense />');
        if (lastAdSense !== -1) {
            const nextNewline = content.indexOf('\n', lastAdSense);
            if (nextNewline !== -1) {
                content = content.slice(0, nextNewline + 1) + '\n                ' + data.seo + '\n' + content.slice(nextNewline + 1);
            }
        }
    }

    fs.writeFileSync(pageFile, content, 'utf8');
    console.log('UPDATED: ' + folder);
}

console.log('Done!');
