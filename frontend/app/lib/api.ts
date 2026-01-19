import axios from "axios";

const api = axios.create({
    baseURL: 'http://127.0.0.1:3001/api',
    withCredentials: true
});

let accessToken: string | null = null;

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

export const registerAPI = async(name:string, email: string, password: string) => {
    try {
        const res = await api.post('/auth/register', {
            name: name,
            email: email,
            password: password
        });
        
        if (res.status === 201) {
            return 'User Registered Successfully'; 
        }
    } catch (error) {
        return "Error Registering User"
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
