<template>
	<div></div>
</template>

<script setup>
import { defineEmits, watch, ref } from "vue";

const emit = defineEmits(["showsidebar"]);
const showSidebar = ref(true);
const { breakpoints } = useBreakpoint();
watch(breakpoints, (val) => {
	showSidebar.value = !(val.is === "xs" || val.is === "sm");
	emit("showsidebar", showSidebar.value);
});

// const emit = defineEmits(['close'])

// const handleClose = () => {
//     emit('close')
// }
</script>

<style lang="scss" scoped></style>
