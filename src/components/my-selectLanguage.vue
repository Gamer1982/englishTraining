<template>
	<div>
		<select name="language" v-model="language" class="select-lang" id="sel">
			<option value="ru">ru</option>
			<option value="en">en</option>
		</select>
	</div>
</template>

<script setup>
import { ref } from "vue";

let language = ref("ru");

const props = defineProps({
	language: {
		require: true,
		default: "ru",
		type: String,
	},
});
</script>

<style lang="scss" scoped></style>
