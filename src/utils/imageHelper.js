const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendapi.emcc-lab.com/'

export const getImageUrl = (path) => {
    if (!path) return null

    // If it's already an absolute URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    // If it starts with /storage, add base URL
    if (path.startsWith('/storage')) {
        return `${API_BASE_URL}${path}`
    }

    // If it starts with storage/ (no leading slash)
    if (path.startsWith('storage/')) {
        return `${API_BASE_URL}/${path}`
    }

    // If it's a products/ path
    if (path.startsWith('products/')) {
        return `${API_BASE_URL}/storage/${path}`
    }

    // Default: assume it's a storage path
    return `${API_BASE_URL}/storage/${path}`
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