<template>
	<div>
		<div class="btn" v-if="isBtn">
			<button type="button" @click.prevent="btnRename">{{ status.btn }}</button>
		</div>
		<div class="btn" v-else>
			<button type="button" @click.prevent="stopTimer">STOP</button>
		</div>
	</div>
</template>

<script setup>
const startTimer = () => {
	timer.value = setInterval(() => {
		currentTime.value--;
	}, 1000);
};
</script>

<style lang="scss" scoped></style>
