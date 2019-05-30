<template>
    <div v-loading="loading">
        <x-list />

        <edit-children />
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import XList from '#index/components/category/list.vue';
import EditChildren from '#index/components/category/edit-children.vue';

const { mapState } = createNamespacedHelpers('category');

export default {
    components: {
        XList,
        EditChildren,
    },
    computed: {
        ...mapState(['loading']),
    },
};
</script>
