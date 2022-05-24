<template>
	<div>
		<select name="option" class="select-lang" v-model="option" id="sel">
			<option value="output">output</option>
			<option value="input">input</option>
			<option value="rename">rename</option>
			<option value="delete">delete</option>
		</select>
	</div>
</template>

<script setup>
import { defineEmits, watch, ref } from "vue";
const emit = defineEmits(["option"]);
const props = defineProps({
	option: {
		require: true,
		default: "output",
		type: String,
	},
});
</script>

<style lang="scss" scoped></style>
