import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'About Us | SafeFileConverter',
    description: 'Learn about Safe File Converter, our mission to provide free, fast, and secure file tools with zero data retention, and the team behind the platform.',
};

export default function AboutUs() {
    return (
        <>
            <Navbar />
            <div className="seo-page animate-in">
                <div className="seo-header">
                    <h1>About Safe File Converter</h1>
                    <p>Building the world's most private and accessible file utility platform.</p>
                </div>

                <section className="seo-content" style={{ marginTop: '2rem' }}>
                    <h2>Our Mission</h2>
                    <p>
                        At Safe File Converter, our mission is simple: <strong>make everyday file tools completely free, totally private, and incredibly easy to use.</strong>
                    </p>
                    <p>
                        We realized that most online file converters either hide their best features behind expensive monthly subscriptions, bombard users with intrusive popups, or worse, secretly harvest and sell user data. We decided to build an alternative—a platform that respects your privacy and your wallet.
                    </p>

                    <h2>The "Zero Data Retention" Promise</h2>
                    <p>
                        Privacy isn't just a buzzword for us; it's the core of our architecture.
                        When you upload a file to Safe File Converter, it exists in temporary memory on our servers just long enough to process your request.
                        <strong>Once your file is converted and downloaded, it is permanently and instantly deleted.</strong>
                    </p>
                    <ul>
                        <li>No persistent storage of user files.</li>
                        <li>No databases cataloging what you upload.</li>
                        <li>No third-party data selling or sharing.</li>
                        <li>No accounts or personal information required.</li>
                    </ul>

                    <h2>Why Are We Free?</h2>
                    <p>
                        We believe that basic digital utilities—like compressing a heavy PDF for a job application or converting an image format—should not be a luxury. By serving a few minimal, non-intrusive ads on the platform, we are able to fully fund the high-performance servers required to run our complex processing engines (like FFmpeg and Ghostscript) without passing those costs to our users. There are no premium tiers and no hidden paywalls.
                    </p>

                    <h2>Our Story</h2>
                    <p>
                        Safe File Converter was born out of frustration with existing tools. Whether attempting to prepare documents for professional printing, merging scanned pages, or simply trying to convert an iPhone HEIC photo to share with Windows users, the existing free tools were always lacking. They had watermarks, aggressive 5MB file limits, or required email registration.
                    </p>
                    <p>
                        We set out to build exactly what we wished existed: a clean, fast, reliable suite of 20+ file tools that handles large files (up to 50MB) quickly and securely directly from the browser.
                    </p>

                    <h2>Get in Touch</h2>
                    <p>
                        We are constantly improving our algorithms and adding new tools based on user feedback. If you have an idea for a new tool, or simply want to say hello, we'd love to hear from you.
                        You can reach the primary developer and maintainer directly at <a href="mailto:ganeshmuthvel303@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>ganeshmuthvel303@gmail.com</a>.
                    </p>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-surface-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Commitment to Quality</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            We continuously optimize our compression algorithms and formatting engines to ensure that when you use Safe File Converter, the output quality matches or beats the most expensive premium software alternatives on the market.
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
