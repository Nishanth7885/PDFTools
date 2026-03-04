'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ToolGrid({ tools }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Grouping tools by categories
    const categoryConfigs = [
        {
            name: 'PDF Essentials',
            icon: '📄',
            keywords: ['PDF Compressor', 'Split PDF', 'PDF Merger', 'Organize PDF', 'Print-Ready PDF']
        },
        {
            name: 'Convert from PDF',
            icon: '📤',
            keywords: ['PDF to JPG', 'PDF to Word', 'PDF to Excel', 'PDF to PPT']
        },
        {
            name: 'Convert to PDF',
            icon: '📥',
            keywords: ['JPG to PDF', 'Word to PDF', 'Text to PDF']
        },
        {
            name: 'PDF Security & Editing',
            icon: '🔐',
            keywords: ['PDF Password', 'Unlock PDF', 'Rotate PDF', 'Watermark PDF', 'Page Numbers']
        },
        {
            name: 'Image & Media Tools',
            icon: '🖼️',
            keywords: ['Image Converter', 'Image Resizer', 'JPG Compressor', 'HEIC to JPG Batch', 'Metadata Stripper', 'Video to Audio', 'Audio Converter']
        }
    ];

    const categories = categoryConfigs.map(config => {
        return {
            ...config,
            tools: filteredTools.filter(t => config.keywords.includes(t.name))
        };
    }).filter(category => category.tools.length > 0);

    return (
        <div className="tools-grid-container">
            <div className="tool-search-wrapper" style={{ marginBottom: '2.5rem', marginTop: '-1rem' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>🔍</div>
                    <input
                        type="text"
                        className="tool-search-input"
                        placeholder="Search for a tool (e.g. 'Print-Ready PDF', 'Compress')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '18px 20px 18px 48px',
                            fontSize: '1.1rem',
                            borderRadius: 16,
                            border: '2px solid rgba(99, 102, 241, 0.2)',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = 'var(--shadow-md)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
                    />
                </div>
            </div>

            {searchQuery && filteredTools.length === 0 && (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕵️</div>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No tools found</h3>
                    <p>We couldn't find any tool matching "{searchQuery}"</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        style={{ marginTop: '1rem', padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >Clear Search</button>
                </div>
            )}

            {searchQuery && filteredTools.length > 0 && (
                <div className="tools-grid">
                    {filteredTools.map((tool) => (
                        <Link key={tool.href} href={tool.href} className="tool-card">
                            <div className="tool-card-icon" style={{ background: tool.iconBg }}>
                                {tool.icon}
                            </div>
                            <h3>{tool.name}</h3>
                            <p>{tool.description}</p>
                        </Link>
                    ))}
                </div>
            )}

            {!searchQuery && categories.map((category) => (
                <div key={category.name} className="tool-category-section" style={{ marginBottom: '3rem' }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span style={{
                            background: 'var(--bg-surface-secondary)',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-primary)'
                        }}>{category.icon}</span>
                        {category.name}
                    </h3>
                    <div className="tools-grid">
                        {category.tools.map((tool) => (
                            <Link key={tool.href} href={tool.href} className="tool-card">
                                <div className="tool-card-icon" style={{ background: tool.iconBg }}>
                                    {tool.icon}
                                </div>
                                <h3>{tool.name}</h3>
                                <p>{tool.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
