import Layout from '#index/views/layout/Index.vue';

const route = {
    path: '/course',
    component: Layout,
    redirect: { path: '/course/index' },
    meta: {
        title: '课程',
        icon: 'el-icon-document',
    },
    children: [
        {
            path: 'index',
            component: () => import('#index/views/course/Index.vue'),
            meta: {
                title: '课程',
                hidden: true,
            },
        },
    ],
};

export default [route];
