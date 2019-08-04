import instance from '@/helper/axios';

const axios = instance();

const base = '/taobao-info';

const list = params => axios.get(base, { params }).then(res => res.data);
const detail = params => axios.get(base, { params }).then(res => res.data);
const insert = params => axios.post(base, params).then(res => res.data);
const update = params => axios.put(`${base}/${params.id}`, params).then(res => res.data);
const remove = id => axios.delete(`${base}/${id}`).then(res => res.data);
const batchRemove = params => axios.delete(base, { params }).then(res => res.data);

export default {
    list,
    detail,
    insert,
    update,
    remove,
    batchRemove,
};
