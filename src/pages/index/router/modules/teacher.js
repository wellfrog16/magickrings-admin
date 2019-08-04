import Layout from '#index/views/layout/Index.vue';

const route = {
    path: '/teacher',
    component: Layout,
    redirect: { path: '/teacher/index' },
    meta: {
        title: '导师信息',
        icon: 'el-icon-document',
    },
    children: [
        {
            path: 'index',
            component: () => import('#index/views/teacher/Index.vue'),
            meta: {
                title: '导师信息',
                hidden: true,
            },
        },
    ],
};

export default [route];
