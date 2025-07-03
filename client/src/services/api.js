import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3032/api', // Sesuaikan dengan port backend Anda
    withCredentials: true, // WAJIB untuk mengirim cookie
});

export default apiClient;