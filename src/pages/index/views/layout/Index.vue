<template>
    <el-container :class="$style.container">
        <el-aside :class="$style.aside" :width="width">
            <h1 :class="$style.logo"><span>管理系统</span></h1>
            <aside-menu
                class="aside-menu"
                :data="menuData"
                :collapse="collapse"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                :default-active="defaultActive"
            />
        </el-aside>
        <el-container>
            <el-header :class="$style.header">
                <div :class="$style.left">
                    <i :class="[$style.switch, 'el-icon-s-unfold']" @click="toggle" id="asideToggle" />
                    <el-breadcrumb separator="/" :class="$style.breadcrumb" id="breadcrumb">
                        <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
                        <el-breadcrumb-item
                            v-for="item in routeMatched"
                            :to="{ path: item.path }"
                            :key="item.path"
                        >{{ item.meta && item.meta.title }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <functions />
            </el-header>
            <el-main :class="$style.main" id="elMain">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import AsideMenu from '#index/components/common/menu/index.vue';
import Functions from '#index/components/layout/functions/index.vue';
// import menu from '@/helper/menu';
import { $ } from '@/utils/cdn';
import { storage } from '@/utils/rivers';

export default {
    components: { AsideMenu, Functions },
    data() {
        return {
            width: 'auto',
            collapse: false,
            menuData: this.$store.state.permission.routes,
        };
    },
    computed: {
        routeMatched() {
            return this.$route.matched.filter(item => !(item.meta && item.meta.hidden) && (item.meta && item.meta.title !== '首页'));
        },
        defaultActive() {
            let path = '';

            // 如果是路由带params跳转过来，找到原始的path
            // 菜单独占params参数路径，其他带参数必须使用query才能保证此处活动路由判断正确
            // 此功能用于左侧菜单带参数重定向
            const {
                params,
                redirectedFrom,
                meta,
            } = this.$route;

            const keys = Object.keys(params);
            if (keys.length > 0) {
                if (redirectedFrom) {
                    path = redirectedFrom;
                } else {
                    const param = params[keys[0]];
                    path = meta.path[param];
                }
            } else {
                const matched = [...this.$route.matched];
                ({ path } = matched.reverse().find(item => !(item.meta && item.meta.hidden)));
            }

            // console.log(this.$route);
            // console.log(path);
            return path;
        },
    },
    mounted() {
        this.setCollapse(this.getStatus());
    },
    methods: {
        toggle() {
            this.setCollapse(!this.getStatus());
        },
        setCollapse(status) {
            const swit = $(`.${this.$style.switch}`);
            const target = $(`.${this.$style.logo} span`);
            if (!status) {
                setTimeout(() => target.show(), 100);
                swit.removeClass(this.$style['switch-tran']);
                storage.set('sys-collapse', 0);
            } else {
                target.hide();
                swit.addClass(this.$style['switch-tran']);
                storage.set('sys-collapse', 1);
            }
            this.collapse = status;
        },
        getStatus() {
            return !!(storage.get('sys-collapse') || 0);
        },
    },
};
</script>

<style lang="less" module>
@import '../../../../assets/style/config.less';

@height: 60px;

.logo {
    height: @height;
    line-height: @height;
    margin: 0;
    color: #fff;
    text-align: center;
    font-size: 20px;
}

.container {
    height: 100vh;

    :global(.aside-menu:not(.el-menu--collapse)) {
        width: 250px;
    }
}

.aside {
    width: 200px;
    background-color: @g-color-primary;

    > ul {
        border-right: 0;
    }
}

.header {
    height: @height;
    line-height: @height;
    border-bottom: 1px solid @g-color-border4;
    display: flex;
    justify-content: space-between;

    .left {
        display: flex;
        align-items: center;
    }
}

.switch {
    cursor: pointer;
    transition: all 0.2s;
}

.switch-tran {
    transform: rotate(90deg);
    transition: all 0.2s;
}

.main {
    background-color: #f0f2f5;
    // min-width: 1000px;
    box-sizing: border-box;
}

.breadcrumb {
    display: inline-block;
    margin-left: 20px;
}
</style>
