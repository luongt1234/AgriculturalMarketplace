import axiosInstance from '../../../lip/axiosInstance';

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // axiosInstance adds the multipart/form-data header automatically when formData is passed
    const response = await axiosInstance.post('/api/File/upload', formData);
    
    // axiosInstance interceptor returns response.data directly
    const data = response as any;
    if (data && data.url) {
        return data.url;
    }
    
    throw new Error('Upload failed: no url returned');
};
