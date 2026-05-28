"use client";

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/utils/imageHelper';
import { FiUpload } from 'react-icons/fi';

export default function ProductImage({ path, alt, className = "w-12 h-12 object-cover rounded-lg" }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (path) {
            const url = getImageUrl(path);
            console.log('Loading image:', url);
            setImageUrl(url);
            setError(false);
        } else {
            setError(true);
        }
    }, [path]);

    if (error || !imageUrl) {
        return (
            <div className={`${className} bg-gray-100 flex items-center justify-center`}>
                <FiUpload className="text-gray-400 w-6 h-6" />
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                setError(true);
                e.target.style.display = 'none';
            }}
        />
    );
}