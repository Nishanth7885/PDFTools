import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata = {
  metadataBase: new URL('https://safefileconverter.online'),
  title: 'PDFtools — Free Online PDF, Image & Audio Tools',
  description: 'Compress, merge, split, rotate, watermark, protect & unlock PDFs. Convert images, extract audio from video — all free, fast, and private. No signup, no data stored.',
  keywords: 'PDF compressor, PDF merger, split PDF, rotate PDF, watermark PDF, unlock PDF, PDF to JPG, JPG to PDF, image compressor, image resizer, image converter, video to audio, audio converter, free online tools, no signup',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5025681441388003"
          crossOrigin="anonymous"
        />
        {/* Prevent FOUC - set theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('pdftools-theme');
                  if (t === 'dark' || t === 'light') {
                    document.documentElement.setAttribute('data-theme', t);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
