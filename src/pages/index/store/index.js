import Vue from 'vue';
import Vuex from 'vuex';

// 站点模块
import baseForm from './modules/base-form';
import taobaoComment from './modules/taobao-comment';
import student from './modules/student';
import teacher from './modules/teacher';
import course from './modules/course';
import member from './modules/member';
import permission from './modules/permission';
import category from './modules/category';
import product from './modules/product';

Vue.use(Vuex);

const state = {};
const mutations = {};
const getters = {
    roles(statex, gettersx, root) {
        return root.member.roles;
    },
    routes(statex, gettersx, root) {
        return root.permission.routes;
    },
};
const actions = {};

// 返回 store 实例
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules: {
        baseForm,
        taobaoComment,
        student,
        course,
        member,
        permission,
        category,
        product,
        teacher,
    },
});
