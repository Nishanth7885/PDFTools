import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Privacy Policy — Safe File Converter',
    description: 'Our privacy policy explains how we handle your files and data. TL;DR: We don\'t store anything.',
};

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar />
            <div className="tool-page animate-in" style={{ maxWidth: 760 }}>
                <div className="tool-page-header">
                    <div className="tool-page-icon" style={{ background: 'rgba(16,185,129,0.08)' }}>🛡️</div>
                    <h1>Privacy Policy</h1>
                    <p>Last updated: February 2026</p>
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: 28 }}>

                    <section>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>TL;DR</h2>
                        <div style={{ padding: '16px 20px', borderRadius: 14, background: 'var(--shield-bg)', border: '1px solid var(--shield-border)' }}>
                            <p style={{ color: 'var(--shield-text)', fontWeight: 500 }}>
                                We don&apos;t store your files. We don&apos;t track you. We don&apos;t sell data.
                                Files are processed and <strong>immediately deleted</strong>. The only thing we use is non-intrusive ads to cover our server costs — so every tool stays <strong>100% free forever</strong>.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>1. File Processing</h2>
                        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <li>Files you upload are processed on our server and <strong>deleted immediately</strong> after the result is sent to your browser.</li>
                            <li>A background cleanup process also runs every 30 minutes to remove any residual files.</li>
                            <li>We <strong>never view, copy, share, or store</strong> your files beyond the processing duration.</li>
                            <li>We do not log file names, contents, or any metadata about your uploads.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>2. Personal Information</h2>
                        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <li>We do <strong>not</strong> require account registration, email, or any personal information.</li>
                            <li>We do <strong>not</strong> use analytics trackers, user profiling, or behavioural tracking.</li>
                            <li>No cookies are set by our application (third-party ad services may set cookies — see below).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>3. Advertising</h2>
                        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <li>We display ads through <strong>Google AdSense</strong> to cover server and bandwidth costs.</li>
                            <li>Google may use cookies to serve ads based on your browsing history. You can opt out at <a href="https://adssettings.google.com" target="_blank" rel="noopener" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Google Ad Settings</a>.</li>
                            <li>We do <strong>not</strong> share any of your file data with advertisers.</li>
                            <li>Ads are the <strong>only</strong> way we monetize — there are no paywalls, no premium tiers, no data selling.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>4. Why Ads?</h2>
                        <p>
                            Running servers that process files (especially video/audio conversion) costs real money.
                            Instead of charging you or limiting features behind a paywall, we chose to show small, non-intrusive advertisements.
                            This lets us offer <strong>every single tool for free</strong> — no sign-up, no limits, no catches — forever.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>5. Third-Party Services</h2>
                        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <li><strong>Google AdSense</strong> — for displaying advertisements (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Google Privacy Policy</a>)</li>
                            <li>We do not use any other third-party services, analytics, or tracking tools.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>6. Your Rights</h2>
                        <p>
                            Since we don&apos;t collect or store any personal data, there is nothing to request, modify, or delete.
                            If you have questions about this policy, you can reach us via the contact information on our website.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>7. Changes to This Policy</h2>
                        <p>
                            We may update this policy from time to time. Any changes will be posted on this page with an updated date. Our core commitment — no file storage, no tracking, free forever — will never change.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}
