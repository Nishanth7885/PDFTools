import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Contact Us | SafeFileConverter',
    description: 'Have a question? Reach out to the Safe File Converter team for support, feature requests, or business inquiries.',
};

export default function ContactUs() {
    return (
        <>
            <Navbar />
            <div className="seo-page animate-in">
                <div className="seo-header">
                    <h1>Contact Us</h1>
                    <p>We're here to help. Reach out to our team with any questions or requests.</p>
                </div>

                <section className="seo-content" style={{ marginTop: '2rem' }}>
                    <h2>Get in Touch</h2>
                    <p>
                        Whether you have a technical question, a bug report, or a suggestion for a new tool, we'd love to hear from you. We strive to respond to all inquiries as quickly as possible, usually within 24-48 hours.
                    </p>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-surface-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📧</span> Direct Email
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>
                            The fastest way to reach the main developer and support team is via email:
                        </p>
                        <p style={{ marginTop: '0.8rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            <a href="mailto:ganeshmuthvel303@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>ganeshmuthvel303@gmail.com</a>
                        </p>
                    </div>

                    <h2 style={{ marginTop: '3rem' }}>Common Inquiries</h2>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <strong>Bugs and Errors:</strong> If a conversion fails or a tool isn't working correctly, please include the type of file (PDF, JPG, MP4, etc.), the approximate file size, and any error message you received.
                        </li>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <strong>Feature Requests:</strong> Looking for a specific layout option, output format, or entirely new tool? Let us know! We prioritize development based on user demand.
                        </li>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <strong>Partnerships and Ads:</strong> For business inquiries, sponsorship opportunities, or AdSense-related communications, please use the email above with the subject line "Business Inquiry."
                        </li>
                        <li style={{ marginBottom: '1.5rem' }}>
                            <strong>Data Privacy:</strong> Curious about how your files are handled? Read our <a href="/privacy-policy" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Privacy Policy</a> to learn more about our strict zero-retention architecture.
                        </li>
                    </ul>
                </section>
            </div>
            <Footer />
        </>
    );
}
