<template>
    <div>
        <el-dialog
            title="产品信息"
            :visible="true"
            v-if="editVisible"
            :before-close="handleClose"
            :close-on-click-modal="false"
            append-to-body
            width="820px"
        >
            <el-form ref="form" :model="form.fields" :rules="form.rules" label-width="80px" v-loading="saveBusy">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="基础信息" name="a">
                        <el-form-item prop="name" label="产品名称">
                            <el-input v-model="form.fields.name" minlength="1" maxlength="20" show-word-limit />
                        </el-form-item>
                        <el-form-item prop="child" label="产品分类">
                            <el-select v-model="form.fields.child" placeholder="请选择">
                                <el-option
                                    v-for="item in childOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="status" label="产品状态">
                            <el-radio-group v-model="form.fields.status">
                                <el-radio-button v-for="item in status" :label="item" :key="item" />
                            </el-radio-group>
                            -
                            <el-button type="primary" icon="el-icon-delete" @click="form.fields.status = ''"></el-button>
                        </el-form-item>
                        <el-form-item prop="price" label="价格">
                            <el-input v-model="form.fields.price" />
                        </el-form-item>
                        <el-form-item prop="url" label="淘宝地址">
                            <el-input v-model="form.fields.url">
                                <template slot="prepend">Http://</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="message" label="简述">
                            <el-input
                                v-model="form.fields.message"
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 8}"
                                maxlength="100"
                                show-word-limit
                            />
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="封面图片" name="b">
                        <el-form-item prop="photo" label-width="0">
                            <el-upload
                                name="avatar"
                                :class="$style['photo-uploader']"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleUploadSuccess2"
                            >
                                <img v-if="form.fields.cover" :src="photoUrl" class="avatar">
                                <i v-else :class="[$style['photo-uploader-icon'], 'el-icon-plus']"></i>
                            </el-upload>
                            设计大小：280px * 360px
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="图片组" name="c">
                        <el-form-item prop="photo" label-width="0">
                            <el-upload
                                name="avatar"
                                list-type="picture-card"
                                :action="uploadUrl"
                                :on-success="handleUploadSuccess"
                                :on-remove="handleUploadRemove"
                                :file-list="fileList"
                                accept=".jpg,.png,.jpeg"
                            >
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            设计大小：600px * 600px
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="详细描述" name="d">
                        <el-tabs v-model="activeContentName" type="border-card" editable @edit="handleTabsEdit">
                            <el-tab-pane
                                v-for="item in form.fields.contents"
                                :key="item.tabIndex"
                                :label="item.title"
                                :name="item.tabIndex"
                            >
                                <el-form-item label="标题">
                                    <el-input v-model="item.title" minlength="1" maxlength="10" show-word-limit placeholder="请输入标题" />
                                </el-form-item>
                                <el-form-item label="内容">
                                    <tinymce v-model="item.content" :height="400" config="simple" />
                                </el-form-item>
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                    <el-tab-pane label="设置关联" name="e">
                        <el-form-item prop="relate" label="关联id">
                            <el-input v-model="form.fields.relate" minlength="1" maxlength="20" placeholder="id用英文逗号分隔，最多4个" />
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <span slot="footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSave" :loading="saveBusy">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import config from '@/config';
import apiProduct from '@/api/usr/product';
import apiCategory from '@/api/usr/category';
import Tinymce from '@/components/tinymce/index.vue';
import { $ } from '@/utils/cdn';
import { rules } from '@/utils/rivers';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('product');

const fields = {
    id: '',
    child: '',
    name: '',
    status: '',
    price: '',
    url: '',
    message: '',
    cover: '',
    photos: [],
    contents: [
        { title: '标题', content: '', tabIndex: 'default' },
    ],
    relate: '',
};

export default {
    components: {
        Tinymce,
    },
    data() {
        const self = this;
        return {
            fileList: [],
            childOptions: [],
            uploadUrl: config.server.upload,
            saveBusy: false,
            status: ['hot', 'sale', 'new'],
            activeItem: {},
            activeName: 'a',
            activeContentName: 'default',
            form: {
                fields: self.createFields(),
                rules: {
                    ...rules.noEmpty({ key: 'name', message: '学员名称不能为空' }),
                },
            },
        };
    },
    watch: {
        editVisible(val) {
            val && this.update();
        },
    },
    computed: {
        ...mapState(['editVisible', 'activeIndex', 'courses']),
        ...mapGetters(['activeRow']),

        // 图片地址
        photoUrl() {
            return `${config.server.img}/${this.form.fields.cover}`;
        },

        category() {
            return +this.$route.params.id;
        },
    },
    methods: {
        ...mapMutations(['setState']),

        // 加载子分类
        async loadChildren() {
            const res = await apiCategory.listChildren(+this.$route.params.id);
            this.childOptions = res.list.map(item => ({ label: item.name, value: item.id }));
        },

        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                const tabIndex = `index${Math.ceil(Math.random() * 100000000)}`;
                const title = `新分类${Math.ceil(Math.random() * 1000)}`;
                this.form.fields.contents.push({
                    title,
                    content: '',
                    tabIndex,
                });
                this.activeContentName = tabIndex;
            }

            if (action === 'remove' && this.activeContentName !== 'default') {
                const tabs = [...this.form.fields.contents];
                if (this.activeContentName === targetName) {
                    tabs.forEach((tab, index) => {
                        // console.log(tab.tabIndex, targetName);
                        if (tab.tabIndex === targetName) {
                            const nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                this.activeContentName = nextTab.tabIndex;
                            }
                        }
                    });
                }

                this.form.fields.contents = tabs.filter(tab => tab.tabIndex !== targetName);
            }
        },

        // 创建一个空的fileds副本
        createFields() {
            const aa = $.extend(true, { category: this.category }, fields);
            // const aa = Object.assign({ category: this.category }, fields);
            console.log(aa);
            return aa;
        },

        // 关闭，保存中禁止关闭
        handleClose() {
            !this.saveBusy && this.setState({ editVisible: false });
            return !this.saveBusy;
        },

        handleUploadSuccess({ data }) {
            const path = `${data.path}/${data.filename}`;
            // this.form.fields.photos.push({ name: path, url: path });
            this.form.fields.photos.push(path);
            this.fileList.push({
                name: path,
                url: `${config.server.img}/${path}`,
            });
        },

        handleUploadSuccess2({ data }) {
            const path = `${data.path}/${data.filename}`;
            this.form.fields.cover = path;
        },

        handleUploadRemove(file) {
            const index = this.fileList.findIndex(item => item.name === file.name);
            this.form.fields.photos.splice(index, 1);
            this.fileList.splice(index, 1);
        },

        // 打卡dialog时，更新数据
        async update() {
            this.activeName = 'a';
            this.loadChildren();
            if (this.activeRow.id) {
                this.activeContentName = this.form.fields.contents[0].tabIndex;
                // 这里实际开发需要去请求数据并更新，现在用行数据临时更新
                // await api.detail(this.activeRow._id);
                const copy = $.extend(true, {}, fields);
                this.form.fields = $.extend(true, copy, this.activeRow);
                this.fileList = this.form.fields.photos.map(item => ({
                    name: item,
                    url: `${config.server.img}/${item}`,
                }));
            } else {
                this.activeContentName = 'default';
                this.fileList = [];
                this.form.fields = this.createFields();
            }
            this.$nextTick(() => this.$refs.form.clearValidate());
        },

        // formatData(data) {
        //     data.photos.forEach(item => ({ name: item.url, url: item }))
        // },

        // 保存信息
        handleSave() {
            this.$refs.form.validate((valid) => {
                valid && this.save();
            });
        },

        // 保存动作
        async save() {
            this.saveBusy = true;

            // 更新列表（非刷新获取，仅前端根据当前数据更新）
            if (this.form.fields.id) {
                // 远程更新
                await apiProduct.update(this.form.fields);
            } else {
                // 远程写入
                await apiProduct.insert(this.form.fields);
            }

            this.$nextTick(() => {
                this.saveBusy = false;
                this.handleClose();
                this.setState({ overdue: true });
            });
        },
    },
};
</script>

<style lang="less" module>
.level :global(.el-form-item__content) {
    margin-left: 0 !important;
}

.photo-uploader {
    :global(.el-upload) {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        line-height: 0;

        &:hover {
            border-color: #409eff;
        }
    }

    img {
        width: 178px;
        height: 178px;
    }
}

.photo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
</style>
