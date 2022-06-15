<template>
	<select v-model="my_value">
		<option v-if="my_define" disabled>{{ my_define }}</option>
		<option :value="my_options[0]">{{ my_options[0] }}</option>
		<option v-for="option in my_options.slice(1)" :value="option" :key="option">{{ option }}</option>
	</select>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";

const my_value = ref(props.my_options[0]);
const props = defineProps({
	my_options: {
		require: false,
		default: [0, 1],
		type: Array,
	},

	my_define: {
		require: false,
		default: "",
		type: [String, Number],
	},
});
const emit = defineEmits(["sub"]);
watch(
	() => my_value.value,
	(newValue) => {
		emit("sub", newValue);
	}
);
// methods: {
//         onChange(event) {
//             console.log(event.target.value)
//         }
//     };
</script>

<style lang="scss" scoped></style>
