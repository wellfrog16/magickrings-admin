import Layout from '#index/views/layout/Index.vue';

const route = {
    path: '/story',
    component: Layout,
    redirect: { path: '/story/index' },
    meta: {
        title: '品牌故事',
        icon: 'el-icon-document',
    },
    children: [
        {
            path: 'index',
            component: () => import('#index/views/story/Index.vue'),
            meta: {
                title: '品牌故事',
                hidden: true,
            },
        },
    ],
};

export default [route];
