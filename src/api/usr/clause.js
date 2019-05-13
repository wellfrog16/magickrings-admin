import instance from '@/helper/axios';

const axios = instance();

const base = '/clause';

const detail = () => axios.get(base).then(res => res.data);
const update = params => axios.put(base, params).then(res => res.data);

export default {
    detail,
    update,
};
