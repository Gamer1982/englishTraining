<template>
	<div>
		<div>
			<p>{{ inCount }}</p>
		</div>
		<button
			type="button"
			@click="
				inCount++;
				currentTime++;
			"
		>
			+
		</button>
		<span>{{ currentTime }}</span>
		<button
			type="button"
			@click="
				inCount--;
				currentTime--;
			"
		>
			-
		</button>
	</div>
</template>

<script setup>
import { ref, defineProps } from "vue";
let inCount = ref(20);

const props = defineProps({
	currentTime: {
		require: true,
		default: 20,
		type: Number,
	},
});
</script>

<style lang="scss" scoped></style>
