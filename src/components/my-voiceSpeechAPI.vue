<template>

	

	<input class="input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text" />


	<button class="mic" @click="ToggleMic"> &#127908 {{ sr.lang }}</button>



	<div class="transcript" v-text="modelValue"></div>

</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const isRecording = ref(false);
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const sr = new Recognition();

const props = defineProps({
	voiceLang: {
		require: false,
		default: 'en',
		type: String,
	},
	modelValue: {
		require: false,
		default: '',
		type: String,
	},
});

const emits = defineEmits(["update:modelValue"])





sr.lang = props.voiceLang === "ru" ? "en" : "ru";
console.log(sr)

onMounted(() => {
	sr.continuous = true;
	sr.interimResults = true;
	sr.lang = props.voiceLang === "ru" ? "en" : "ru";
	sr.onstart = () => {
		console.log("SR Started");
		isRecording.value = true;
	};
	sr.onend = () => {
		console.log("SR Stopped");
		isRecording.value = false;
	};
	sr.onresult = (evt) => {
		for (let i = 0; i < evt.results.length; i++) {
			const result = evt.results[i];
			if (result.isFinal) CheckForCommand(result);
		}
		console.log(sr.onresult);
		const t = Array.from(evt.results)
			.map((result) => result[0])
			.map((result) => result.transcript)
			.join("");
		console.log("tttttt",t);
		props.modelValue = t;
	};
});

const CheckForCommand = (result) => {
	const t = result[0].transcript;
	if (t.includes("stop record")) {
		sr.stop();
	}
	if (t.includes("what is the time") || t.includes("what's the time")) {
		sr.stop();
		alert(new Date().toLocaleTimeString());
		setTimeout(() => sr.start(), 100);
	}
};

const ToggleMic = () => {
	if (isRecording.value) {

		sr.stop();
	} else {
	sr.continuous = true;
	sr.interimResults = true;
	sr.lang = props.voiceLang === "ru" ? "en" : "ru";
	sr.onstart = () => {
		console.log("SR Started");
		isRecording.value = true;
	};
		sr.start();
	}
};


watch(
	() => props.voiceLang,
	(newValue) => {
		sr.lang = newValue === "ru" ? "en" : "ru";
	}
);


</script>

<style lang="scss" scoped>
.input {
	border: 2px rgb(99, 20, 63) solid;
	box-shadow: 3px 3px 2px 1px;
	border-radius: 10px;
	padding: 5px;
	font-weight: bold;
	font-size: 16px;
}

.mic {
	border-radius: 40%;
	border: 2px rgb(99, 20, 63) solid;
	box-shadow: 3px 3px 2px 1px;
}
</style>


