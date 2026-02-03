import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true
});

let accessToken: string | null = null;

api.interceptors.request.use((config) => {
    if(accessToken) {
        config.headers = config.headers || {} ;
        config.headers.Authorization = `Bearer ${accessToken}`
    } return config;
}, (error) => Promise.reject(error))

api.interceptors.response.use(res => res,
    async (error) => {
        const originalRequest = error.config;
        
        if (originalRequest.url?.includes("/auth/refresh-token") && error.response?.status === 401) {
            throw new Error("Unauthorized")
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry  = true;

            const newtoken  = await refreshTokenAPI();
            if(newtoken) {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newtoken}`;
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    }
)

export const loginAPI = async(email: string, password: string) => {
    try {
        const res = await api.post('/auth/login', {
            email: email,
            password: password
        });
        
        accessToken = res.data.accessToken;
        
        if (res.status === 200) {
            return 'loginSuccess'; 
        }
    } catch (error) {
        return "Error Login"    
    }
}

export const logoutAPI = async() => {
    try {
        accessToken = null;
        const res = await api.post('/auth/logout');
        return res;
    } catch (error) {
        throw error;
    }
}

export const registerAPI = async(name:string, email: string, password: string) => {
    try {
        const res = await api.post('/auth/register', {
            name: name,
            email: email,
            password: password
        });
        
        return res.data;
    } catch (error) {
        throw new Error("Some error occoured")
    }
}

export const refreshTokenAPI = async() => {
    try {
        const res = await api.post('/auth/refresh-token');
        accessToken = res.data.accessToken;
        return accessToken;
    } catch (error) {
        accessToken = null;
        return null;
    }
}

export const getStudentJobs = async() => {
    try {
        const res = await api.get('/student/jobs')
        return res.data
    } catch (error) {
        throw error
    }
}

export const getStudentJob = async(id: string) => {
    try {
        const res = await api.get(`/student/jobs/${id}`)
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const submitApplication = async(id: string, cv: string) => {
    try {
        const res = await api.post(`/student/jobs/${id}`, {
            resume: cv
        })
        return res;
    } catch (error) {
        throw error;
    }
}

export const getStudentApplicationsAPI = async() => {
    try {
        const res = await api.get('/student/applications')
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const delApplicationAPI = async(id: string) => {
    try {
        const res = await api.delete(`/student/applications/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
}

export const getAdminJobs = async() => {
    try {
        const res = await api.get('/admin/jobs');
        return res
    } catch (error) {
        throw error;
    }
}

export const getAdminApplications = async(id: string) => {
    try {
        const res = await api.get(`/admin/applications/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}
