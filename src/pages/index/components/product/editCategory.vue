<template>
    <el-dialog
        title="修改分类"
        :visible="editCategoryVisible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        append-to-body
        width="320px"
    >
        <el-form>
            <el-form-item label="大分类">
                <el-select v-model="category" placeholder="请选择" @change="change">
                    <el-option
                        v-for="item in list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="小分类">
                <el-select v-model="child" placeholder="请选择">
                    <el-option
                        v-for="item in listChild"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import apiProduct from '@/api/usr/product';
import apiCategory from '@/api/usr/category';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('product');

export default {
    data() {
        return {
            category: null,
            child: null,
            list: [],
        };
    },

    computed: {
        ...mapState(['editCategoryVisible', 'activeCategory', 'activeChild']),
        ...mapGetters(['activeRow']),

        listChild() {
            if (this.category && this.list.length > 0) {
                return this.list.find(item => item.id === this.category).children;
            }
            return [];
        },
    },

    watch: {
        editCategoryVisible(val) {
            val && this.update();
        },
    },

    methods: {
        ...mapMutations(['setState']),

        // 关闭，保存中禁止关闭
        handleClose() {
            !this.saveBusy && this.setState({ editCategoryVisible: false });
            return !this.saveBusy;
        },

        async loadList() {
            this.setState({ loading: true });

            const res = await apiCategory.list();
            this.list = [...res.list];

            this.$nextTick(() => this.setState({ loading: false, overdue: false }));
        },

        update() {
            this.loadList();
            this.category = this.activeCategory;
            this.child = this.activeChild;
        },

        change() {
            this.child = '';
        },

        async handleSave() {
            if (this.category && this.child) {
                this.activeRow.category = this.category;
                this.activeRow.child = this.child;
                await apiProduct.update(this.activeRow);
            }

            this.$nextTick(() => {
                this.handleClose();
                this.setState({ overdue: true });
            });
        },
    },
};
</script>
