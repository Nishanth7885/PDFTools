import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  alternates: {
    canonical: '/terms-of-service',
  },
    title: 'Terms of Service | SafeFileConverter',
    description: 'Read the Terms of Service for Safe File Converter. Understand the rules, guidelines, and policies for using our free file conversion tools.',
};

export default function TermsOfService() {
    return (
        <>
            <Navbar />
            <div className="seo-page animate-in">
                <div className="seo-header">
                    <h1>Terms of Service</h1>
                    <p>Please refer to the following terms regarding your use of Safe File Converter.</p>
                </div>

                <section className="seo-content" style={{ marginTop: '2rem' }}>
                    <p><em>Last Updated: March 2026</em></p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using Safe File Converter (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you must discontinue your use of the Service immediately.
                    </p>

                    <h2>2. Description of Service</h2>
                    <p>
                        Safe File Converter provides online file processing utilities, including but not limited to PDF manipulation, image conversion, and audio/video extraction. All services are provided entirely free of charge and without requiring user registration.
                    </p>

                    <h2>3. Intellectual Property Rights</h2>
                    <p>
                        You retain all full ownership and copyright of any files, documents, or media you upload to the Service for processing. Safe File Converter does not claim any intellectual property rights over your processed files.
                    </p>
                    <p>
                        The website's original content, features, design, and functionality are the exclusive property of Safe File Converter. You may not copy, reproduce, or distribute our source code or website layout without express written permission.
                    </p>

                    <h2>4. Acceptable Use Policy</h2>
                    <p>When using the Service, you agree NOT to:</p>
                    <ul>
                        <li>Upload any files that contain malicious code, malware, viruses, or any other software designed to disrupt the operation of the Service.</li>
                        <li>Use the Service to process illegal, highly inappropriate, or legally restricted content.</li>
                        <li>Automate access to the Service using bots, scripts, or scrapers without authorization.</li>
                        <li>Attempt to bypass or overload the maximum file size limits and server processing capacities.</li>
                        <li>Use the Service for activities that infringe upon the intellectual property rights of others.</li>
                        <li>Attempt to reverse-engineer any component of the Service.</li>
                    </ul>

                    <h2>5. Data Privacy and File Deletion</h2>
                    <p>
                        The Service operates on a strict zero data retention policy. Files uploaded for conversion or processing are held in temporary server memory solely for the duration of the process.
                        Once the output file is generated and downloaded, all associated files (both input and output) are permanently deleted from our servers.
                        We do not maintain backups, logs, or archives of your processed files. By using the Service, you acknowledge that we cannot retrieve files after they have been processed and deleted.
                    </p>

                    <h2>6. Disclaimer of Warranties</h2>
                    <p>
                        The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Safe File Converter makes no warranties, expressed or implied, regarding the accuracy, completeness, reliability, or availability of the Service.
                        While we strive for high-quality file conversion, we do not guarantee that the converted output will be perfectly identical to the original file in terms of formatting, layout, or quality, especially for highly complex files.
                    </p>

                    <h2>7. Limitation of Liability</h2>
                    <p>
                        In no event shall Safe File Converter, its developers, or its affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Service.
                        This includes, without limitation, any loss of data, loss of business, or loss of profits resulting from the use of our file processing tools. Users are solely responsible for keeping backups of their original files.
                    </p>

                    <h2>8. Service Modifications and Availability</h2>
                    <p>
                        We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) temporarily or permanently, with or without notice, at any time. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
                    </p>
                    <p>
                        We may occasionally update file size limits or usage limitations to ensure fair server availability for all users.
                    </p>

                    <h2>9. Third-Party Links and Advertisements</h2>
                    <p>
                        The Service may display advertisements or contain links to third-party websites that are not owned or controlled by Safe File Converter. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                    </p>

                    <h2>10. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with standard international internet laws, without regard to conflict of law provisions.
                    </p>

                    <h2>11. Contact Us</h2>
                    <p>
                        If you have any questions or concerns about these Terms of Service, please contact us at: <a href="mailto:ganeshmuthvel303@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>ganeshmuthvel303@gmail.com</a>.
                    </p>
                </section>
            </div>
            <Footer />
        </>
    );
}
