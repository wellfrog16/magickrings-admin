import instance from '@/helper/axios';

const axios = instance({
    notification: false,
});

const base = '/member';

const login = params => axios.post(`${base}/login`, params).then(res => res);
const logout = params => axios.get(`${base}/logout`, params).then(res => res);
const me = () => axios.get(`${base}`).then(res => res.data);

export default {
    login,
    logout,
    me,
};
