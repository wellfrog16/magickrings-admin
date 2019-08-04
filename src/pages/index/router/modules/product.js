import Layout from '#index/views/layout/Index.vue';

const route = {
    path: '/product',
    component: Layout,
    redirect: { path: '/product/category' },
    meta: {
        title: '产品',
        icon: 'el-icon-folder',
    },
    children: [
        {
            path: 'category',
            component: () => import('#index/views/category/Index.vue'),
            meta: {
                title: '分类',
                icon: 'el-icon-document',
            },
        },
        {
            path: 'love',
            redirect: { path: '/product/index/1' },
            meta: {
                title: '恋爱魔法',
                icon: 'el-icon-document',
            },
        },
        {
            path: 'money',
            redirect: { path: '/product/index/2' },
            meta: {
                title: '招财魔法',
                icon: 'el-icon-document',
            },
        },
        {
            path: 'beauty',
            redirect: { path: '/product/index/3' },
            meta: {
                title: '美容魔法',
                icon: 'el-icon-document',
            },
        },
        {
            path: 'luck',
            redirect: { path: '/product/index/4' },
            meta: {
                title: '驱邪转运',
                icon: 'el-icon-document',
            },
        },
        {
            path: 'divination',
            redirect: { path: '/product/index/5' },
            meta: {
                title: '仪式占卜',
                icon: 'el-icon-document',
            },
        },
        {
            path: 'index/:id',
            component: () => import('#index/views/product/Index.vue'),
            meta: {
                title: '产品页面',
                hidden: true,
                path: {
                    1: '/product/love',
                    2: '/product/money',
                    3: '/product/beauty',
                    4: '/product/luck',
                    5: '/product/divination',
                },
            },
        },
    ],
};

export default [route];
