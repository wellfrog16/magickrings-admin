import Layout from '#index/views/layout/Index.vue';

const route = {
    path: '/taobao-comment',
    component: Layout,
    redirect: { path: '/taobao-comment/index' },
    meta: {
        title: 'Blog买家秀',
        icon: 'el-icon-document',
    },
    children: [
        {
            path: 'index',
            component: () => import('#index/views/taobao-comment/Index.vue'),
            meta: {
                title: 'Blog买家秀',
                hidden: true,
            },
        },
    ],
};

export default [route];
