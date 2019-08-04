import Layout from '#index/views/layout/Index.vue';

const route = {
    path: '/clause',
    component: Layout,
    redirect: { path: '/clause/index' },
    meta: {
        title: '隐私条款',
        icon: 'el-icon-document',
    },
    children: [
        {
            path: 'index',
            component: () => import('#index/views/clause/Index.vue'),
            meta: {
                title: '隐私条款',
                hidden: true,
            },
        },
    ],
};

export default [route];
