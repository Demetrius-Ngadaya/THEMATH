export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('data:')) return path;
    return `https://backendapi.emcc-lab.com${path}`;
};