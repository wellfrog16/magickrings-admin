import Vue from 'vue';
import Router from 'vue-router';
import Layout from '../views/layout/Index.vue';
// import Root from '../../../components/Root.vue';
import Login from '../views/login/Index.vue';

Vue.use(Router);

// 一个空模板，方便子节点使用
// const Root = Vue.component('root', {
//     template: '<router-view></router-view>',
// });

// const icon = 'menu-fix-icon fas fa-pager fa-lg fa-fw';

// 静态路由，不参与权限验证
const staticRoutes = [
    {
        path: '',
        redirect: { path: '/login' },
        meta: {
            hidden: true,
        },
    },
    {
        path: '/login',
        component: Login,
        meta: {
            title: '登入界面',
            hidden: true,
        },
    },
    {
        path: '/401',
        component: () => import('../views/error/401.vue'),
        meta: {
            title: '401',
            hidden: true,
        },
    },
];

const asyncRoutes = [
    {
        path: '/home',
        component: Layout,
        redirect: { path: '/home/index' },
        meta: {
            icon: 'menu-fix-icon fas fa-home fa-lg fa-fw',
            title: '首页',
        },
        children: [
            {
                path: 'index',
                component: () => import('../views/home/Index.vue'),
                meta: {
                    hidden: true,
                    title: '首页详细',
                },
            },
        ],
    },
    {
        path: '/document',
        component: Layout,
        redirect: { path: '/document/index' },
        meta: {
            title: '说明文档',
            icon: 'el-icon-document',
        },
        children: [
            {
                path: 'index',
                component: () => import('../views/document/Index.vue'),
                meta: {
                    title: '说明文档首页',
                    hidden: true,
                },
            },
        ],
    },
    {
        path: '/ui',
        component: Layout,
        redirect: { path: '/ui/form' },
        meta: {
            title: '组件',
            icon: 'menu-fix-icon fas fa-puzzle-piece fa-lg fa-fw',
        },
        children: [
            {
                path: 'form',
                component: () => import('../views/ui/Form.vue'),
                meta: {
                    title: '基础表格和表单',
                    icon: 'menu-fix-icon fab fa-wpforms fa-lg fa-fw',
                },
            },
        ],
    },
    {
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
                component: () => import('../views/category/Index.vue'),
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
                component: () => import('../views/product/Index.vue'),
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
    },
    {
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
                component: () => import('../views/course/Index.vue'),
                meta: {
                    title: '课程页面',
                    hidden: true,
                },
            },
        ],
    },
    {
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
                component: () => import('../views/student/Index.vue'),
                meta: {
                    title: '学员资质页面',
                    hidden: true,
                },
            },
        ],
    },
    {
        path: '/taobao-info',
        component: Layout,
        redirect: { path: '/taobao-info/index' },
        meta: {
            title: 'Blog买家秀',
            icon: 'el-icon-document',
        },
        children: [
            {
                path: 'index',
                component: () => import('../views/taobao-info/Index.vue'),
                meta: {
                    title: 'Blog买家秀页面',
                    hidden: true,
                },
            },
        ],
    },
    {
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
                component: () => import('../views/clause/Index.vue'),
                meta: {
                    title: '隐私条款页面',
                    hidden: true,
                },
            },
        ],
    },
];

const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
    // savedPosition is only available for popstate navigations.
        return savedPosition;
    }
    const position = {};
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
        position.selector = to.hash;
    }
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => !m.meta.scrollToTop)) {
        // cords will be used if no selector is provided,
        // or if the selector didn't match any element.
        position.x = 0;
        position.y = 0;
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    return position;
};

// todo 按模块写入单独的文件引用
const router = new Router({
    // mode: 'history',
    scrollBehavior,
    routes: staticRoutes,
});

export {
    staticRoutes,
    asyncRoutes,
};

export default router;
