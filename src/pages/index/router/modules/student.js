import Layout from '#index/views/layout/Index.vue';

const route = {
    path: '/student',
    component: Layout,
    redirect: { path: '/student/index' },
    meta: {
        title: '学员资质',
        icon: 'el-icon-document',
    },
    children: [
        {
            path: 'index',
            component: () => import('#index/views/student/Index.vue'),
            meta: {
                title: '学员资质',
                hidden: true,
            },
        },
    ],
};

export default [route];
