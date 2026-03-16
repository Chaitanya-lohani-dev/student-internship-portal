import axios from "axios";


const api = axios.create({
    baseURL:  process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : 'http://localhost:3001/api',
    withCredentials: true
});

api.interceptors.response.use(res => res,
    async (error) => {
        const originalRequest = error.config;
        
        if (originalRequest.url?.includes("/auth/refresh-token") && error.response?.status === 401) {
            throw new Error("Unauthorized")
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry  = true;

            const newres  = await refreshTokenAPI();
            if(newres && newres.status === 200) {
                return api(originalRequest);
            }

            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

// login api's
export const loginAPI = async(email: string, password: string) => {
    try {
        const res = await api.post('/auth/login', {
            email: email,
            password: password
        });
        
        if (res.status === 200) {
            return 'loginSuccess'; 
        }
    } catch (error) {
        return "Error Login"    
    }
}

export const logoutAPI = async() => {
    try {
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
        return res;
    } catch (error) {
        return null;
    }
}

// student api's
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

// admin api's
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

export const adminUpdateApplicationStatus = async(id: string, update: string) => {
    try {
        const res = await api.patch(`/admin/applications/${id}`, {
            status: update
        });
        return res
    } catch (error) {
        throw error;
    }
}

export const adminCreateJob = async(title: string, description: string, closesAt: string) => {
    try {
        const res = await api.post('/admin/jobs', {
            title: title,
            description: description,
            closesAt: closesAt
        });
        return res;
    } catch (error) {
        throw error;
    }
}

export const updateAdminJob = async(id: string, title: string, description: string, closesAt: string) => {
    try {
        const res = await api.put(`/admin/jobs/${id}`, {
            title: title,
            description: description,
            closesAt: closesAt
        });
        return res;
    } catch (error) {
        throw error;
    }
}