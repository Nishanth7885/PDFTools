import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-brand-name">
                            <div className="navbar-brand-icon">⚡</div>
                            PDFtools
                        </div>
                        <p>
                            Free, fast, and private file processing tools.
                            We show ads to cover server costs — all 20+ tools are
                            100% free forever with no signup required.
                        </p>
                    </div>
                    <div className="footer-links-group">
                        <div className="footer-col">
                            <h4>PDF Tools</h4>
                            <Link href="/pdf-compressor">Compressor</Link>
                            <Link href="/pdf-merger">Merger</Link>
                            <Link href="/split-pdf">Split PDF</Link>
                            <Link href="/pdf-to-jpg">PDF to JPG</Link>
                            <Link href="/jpg-to-pdf">JPG to PDF</Link>
                            <Link href="/pdf-to-word">PDF to Word</Link>
                            <Link href="/pdf-to-excel">PDF to Excel</Link>
                            <Link href="/pdf-to-ppt">PDF to PPT</Link>
                            <Link href="/word-to-pdf">Word to PDF</Link>
                            <Link href="/rotate-pdf">Rotate PDF</Link>
                            <Link href="/watermark-pdf">Watermark</Link>
                            <Link href="/pdf-password">Protect PDF</Link>
                            <Link href="/unlock-pdf">Unlock PDF</Link>
                            <Link href="/page-numbers">Page Numbers</Link>
                            <Link href="/organize-pdf">Organize PDF</Link>
                            <Link href="/html-to-pdf">Text to PDF</Link>
                            <Link href="/print-ready-pdf">Print-Ready PDF</Link>
                        </div>
                        <div className="footer-col">
                            <h4>Image &amp; Media</h4>
                            <Link href="/heic-to-jpg-batch">HEIC to JPG Batch</Link>
                            <Link href="/jpg-compressor">JPG Compressor</Link>
                            <Link href="/image-resizer">Image Resizer</Link>
                            <Link href="/image-converter">Image Converter</Link>
                            <Link href="/metadata-stripper">Metadata Stripper</Link>
                            <Link href="/video-to-audio">Video to Audio</Link>
                            <Link href="/audio-converter">Audio Converter</Link>
                        </div>
                        <div className="footer-col">
                            <h4>Company</h4>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                            <a href="#privacy">Zero Data Storage</a>
                            <a href="#privacy">How We&apos;re Free</a>
                            <a href="mailto:ganeshmuthvel303@gmail.com">Contact Us</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} <strong>PDFtools</strong> — All rights reserved. We use ads to keep everything free.</p>
                    <div className="footer-privacy-badge">🛡️ Zero Data Retention · 💚 Free Forever</div>
                </div>
            </div>
        </footer>
    );
}
