<template>
    <el-card shadow="never" :loading="saveBusy">
        <el-form ref="form" :model="form.fields" :rules="form.rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.fields.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="隐私条款" prop="content">
                <tinymce v-model="form.fields.content" :height="400" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSave">保 存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import api from '@/api/usr/clause';
import { rules } from '@/utils/rivers';
import Tinymce from '@/components/tinymce/index.vue';
// import { createNamespacedHelpers } from 'vuex';

// const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('baseForm');

export default {
    components: {
        Tinymce,
    },
    data() {
        return {
            saveBusy: false,
            form: {
                fields: {
                    guid: 'clause', // 数据库存储标识
                    title: '',
                    content: '',
                },
                rules: {
                    ...rules.check({ key: 'title', message: '标题不能为空' }),
                    ...rules.check({ key: 'content', message: '隐私内容不能为空' }),
                },
            },
        };
    },
    mounted() {
        this.loadDetail();
    },
    methods: {
        async loadDetail() {
            this.saveBusy = true;
            const res = await api.detail();
            if (res) {
                this.form.fields.title = res.title;
                this.form.fields.content = res.content;
            }
            this.$nextTick(() => {
                this.saveBusy = false;
            });
        },
        handleSave() {
            this.$refs.form.validate((valid) => {
                valid && this.save();
            });
        },
        async save() {
            this.saveBusy = true;

            if (this.form.fields.guid) {
                // 远程更新
                await api.update(this.form.fields);
            }

            this.$nextTick(() => {
                this.saveBusy = false;
            });
        },
    },
};
</script>
