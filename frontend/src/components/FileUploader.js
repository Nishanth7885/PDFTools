'use client';
import { useRef, useState, useCallback } from 'react';

export default function FileUploader({ accept, onFileSelect, file, onRemove, maxSizeMB = 50 }) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleFile = useCallback((selectedFile) => {
        if (!selectedFile) return;
        if (selectedFile.size > maxSizeMB * 1024 * 1024) {
            alert(`File size exceeds ${maxSizeMB}MB limit`);
            return;
        }
        onFileSelect(selectedFile);
    }, [onFileSelect, maxSizeMB]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile);
    };

    if (file) {
        return (
            <div className="uploader has-file">
                <div className="file-info">
                    <div className="file-info-icon">📄</div>
                    <div className="file-info-details">
                        <h4>{file.name}</h4>
                        <span>{formatFileSize(file.size)}</span>
                    </div>
                    <button
                        className="file-remove"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        title="Remove file"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`uploader ${dragOver ? 'drag-over' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="uploader-icon">📁</div>
            <h3>Drop your file here</h3>
            <p>
                or <span className="uploader-browse">browse</span> to choose a file
                <br />Max {maxSizeMB}MB
            </p>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={(e) => handleFile(e.target.files[0])}
            />
        </div>
    );
}
