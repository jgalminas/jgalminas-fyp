export const videoUrl = (id: string, type: 'recording' | 'highlight') => `http://localhost:${window.api.getVideoPort()}/${type}/${id}`;
