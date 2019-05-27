import instance from '@/helper/axios';

const axios = instance();

const base = '/category';

const list = params => axios.get(base, { params }).then(res => res.data);
const detail = params => axios.get(base, { params }).then(res => res.data);
const insert = params => axios.post(base, params).then(res => res.data);
const update = params => axios.put(`${base}/${params.id}`, params).then(res => res.data);
const appendChildren = (id, params) => axios.post(`${base}/${id}/children`, params).then(res => res.data);
const removeChildren = (id, childrenId) => axios.delete(`${base}/${id}/children/${childrenId}`).then(res => res.data);

export default {
    list,
    detail,
    insert,
    update,
    appendChildren,
    removeChildren,
};
