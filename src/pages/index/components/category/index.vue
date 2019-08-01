<template>
    <el-card shadow="never" :class="$style.main">
        <div slot="header" :class="$style.header">
            <span>{{ name }}</span>
            <el-button type="text" @click="handleCreate">添加分类</el-button>
        </div>
        <ul :class="$style.list">
            <li v-for="item in children" :key="item.id">
                <span>{{ item.name }}</span>
                <div :class="$style.handle">
                    <el-link :underline="false" @click="handleEdit(item)"><i class="el-icon-edit" /></el-link>
                    <el-link :underline="false" @click="handleDelete(item)"><i class="el-icon-delete" /></el-link>
                </div>
            </li>
        </ul>
    </el-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import api from '@/api/usr/category';

const { mapState, mapMutations } = createNamespacedHelpers('category');

export default {
    props: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        children: { type: Array, required: true },
    },
    computed: {
        ...mapState(['filters', 'overdue']),
    },
    methods: {
        ...mapMutations(['setState']),

        // 新建
        handleCreate() {
            this.setState({ activeRow: null });
            this.setState({ activeId: this.id, activeRow: {}, editChildrenVisible: true });
        },

        // 编辑
        handleEdit(activeRow) {
            this.setState({ activeId: this.id, activeRow, editChildrenVisible: true });
        },

        // 删除确认
        handleDelete(activeRow) {
            this.$confirm('确认要删除这条数据吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.removeChildren(activeRow);
            }).catch(() => {});
        },

        // 删除
        async removeChildren(activeRow) {
            this.setState({ loading: true });

            // 远程删除
            await api.removeChildren(this.id, activeRow.id);

            this.$nextTick(() => this.setState({ loading: false, overdue: true }));
        },
    },
};
</script>

<style lang="less" module>
.main {
    height: 300px;
    display: flex;
    flex-direction: column;

    :global(.el-card__header) {
        flex: 0 0 69px;
    }

    :global(.el-card__body) {
        flex-grow: 1;
        box-sizing: border-box;
        overflow-y: auto;
    }
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.list {
    margin: 0;
    padding: 0;

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 30px;
    }
}

.handle {
    i {
        margin-left: 10px;
    }
}
</style>
