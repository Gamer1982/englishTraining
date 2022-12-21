<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from "./components/HelloWorld.vue";

import MyMain from "./components/my-Main.vue";
</script>

<template>
	<!-- <HelloWorld
		msg='Кошелёк на флешке не является "холодным" и для "чайника" слишком сложно. Лучше всего взять старый смарт (без снимки и отрубленым вайфаем) и поставить на него
	AirGap Vault, а на основной смарт AirGap Wallet. Это будет настоящий "холодный" кошелек. Не забывайте про надежный бекап сид-фразы, в бумажном виде в запечатанном конверте
	положите например в несгораемый сейф. Прежде чем закидывать первый раз деньги, потренеруйтесь восстановливать кошелёк по сид-фразе.' /> -->
	<MyMain></MyMain>
</template>

<style>
body {
	background-color: rgb(58, 55, 55);
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #d1be12;
	margin-top: 60px;
	line-height: 1.5;
}
</style>
