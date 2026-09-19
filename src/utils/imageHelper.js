import { STORAGE_BASE_URL } from './apiConfig'

export const getImageUrl = (path) => {
    if (!path) return null

    // Already an absolute URL or a base64 data URI - return as is.
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path
    }

    // Normalize away any leading "storage/" or "/storage/" the caller may
    // have included, since STORAGE_BASE_URL already ends in /storage.
    const clean = path.replace(/^\/?storage\//, '').replace(/^\//, '')

    return `${STORAGE_BASE_URL}/${clean}`
}

export const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    const maxSize = 2 * 1024 * 1024 // 2MB

    if (!validTypes.includes(file.type)) {
        return 'Only JPG, PNG, and GIF images are allowed'
    }

    if (file.size > maxSize) {
        return 'Image size should be less than 2MB'
    }

    return null
}
