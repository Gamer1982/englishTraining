<template>
	<div class="wrapper">
		<MySelect v-model="selectLibrary" :my_options="libraryNames" :my_define="'biblioteca >>>'"></MySelect>

		<MySelect v-model="selectLang" :my_options="['ru', 'en']"></MySelect>

		<MySelect v-model="selectOption" :my_options="['Start', 'Input', 'Rename', 'Del']"></MySelect>

		<div class="lang">
			<div class="inputRu" v-show="selectOption !== 'Start' || selectLang === 'ru'">
				<input type="text" placeholder="ru" v-model="word[randomIndex].ru" />
				<input type="text" placeholder="ru_understanding" v-model="word[randomIndex].ru_understanding" />
				<h1 v-show="leftTime < 10">{{ word[randomIndex].en }}</h1>
			</div>
			<div class="inputEn" v-show="selectOption !== 'Start' || selectLang === 'en'">
				<input type="text" placeholder="en" v-model="word[randomIndex].en" />
				<input type="text" placeholder="en_understanding" v-model="word[randomIndex].en_understanding" />
				<h1 v-show="leftTime < 10">{{ word[randomIndex].ru }}</h1>
			</div>

			<div class="text" v-show="isText"><input type="text" x-webkit-speech v-model="response" /></div>

			<div class="btn" v-if="isBtn">
				<button type="button" @click.prevent="btnRename">{{ selectOption }}</button>
			</div>

			<div class="btn" v-else>
				<button type="button" @click.prevent="stopTimer">STOP</button>
			</div>
			<p>{{ word[randomIndex] }}</p>
		</div>
		<div>
			<p>{{ leftTime }}</p>
		</div>

		<button
			type="button"
			@click="
				timer++;
				leftTime++;
			"
		>
			+
		</button>

		<span> {{ timer }} </span>

		<button
			type="button"
			@click="
				timer--;
				leftTime--;
			"
		>
			-
		</button>
	</div>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount } from "vue";
import rootDictionary from "../js/dictionary";
import random from "../js/random";
import toSortDictionary from "../js/sort";
import MySelect from "./my-select.vue";

const selectLibrary = ref("top500");
const selectLang = ref("ru");
const selectOption = ref("Start");
const response = ref("");
const randomIndex = ref(0);
const leftTime = ref(25);
const timer = ref(25);
const timeout = ref({});

const isText = ref(true);
const isBtn = ref(true);
const indexLibrary = ref(0);

const dictionary = ref(rootDictionary);
if (!window.localStorage.dictionary) {
	localStorage.setItem("dictionary", JSON.stringify(rootDictionary));
}

if (window.localStorage.dictionary) {
	dictionary.value = JSON.parse(window.localStorage.getItem("dictionary"));
}
const word = computed(() => {
	return toSortDictionary(dictionary.value[indexLibrary.value].data);
});

const libraryNames = computed(() => {
	const words = dictionary.value.map((elem) => elem.libraryName);
	indexLibrary.value = words.indexOf(selectLibrary.value);
	randomIndex.value = random(dictionary.value[indexLibrary.value].data);
	return words;
});

const btnRename = (e) => {
	if (selectOption.value === "Start") {
		isBtn.value = false;
		startTimer();
	}

	if (selectOption.value === "Input") {
		console.log("INPUT");
		word.value.push({ en: word.value[randomIndex.value].en, ru: word.value[randomIndex.value].ru, ru_understanding: 0, en_understanding: 0 });
	}
	if (selectOption.value === "Rename") {
		console.log("RENAME");
		word.value.push(word.value[randomIndex.value]);
	}
	if (selectOption.value === "Del") {
		console.log("DELETE");
		word.value.splice(randomIndex.value, 1);
	}
};
const startTimer = () => {
	timeout.value = setInterval(() => {
		leftTime.value--;
	}, 1000);
};
const stopTimer = () => {
	clearInterval(timeout.value);
	console.log("stopTimer");
	isBtn.value = true;
};
watch(
	() => response.value,
	(newValue, oldValue) => {
		if (selectLang.value === "ru" && response.value === word.value[randomIndex.value].en) {
			word.value[randomIndex.value].ru_understanding++;
			console.log("ru");
			response.value = "";
			leftTime.value = timer.value;
			randomIndex.value = random(dictionary.value[indexLibrary.value].data);
		}
		if (selectLang.value === "en" && response.value === word.value[randomIndex.value].ru) {
			word.value[randomIndex.value].en_understanding++;
			console.log("en");
			response.value = "";
			leftTime.value = timer.value;
			randomIndex.value = random(dictionary.value[indexLibrary.value].data);
		}
	}
);
watch(
	() => leftTime.value,
	(newValue) => {
		if (newValue === 0) {
			word.value[randomIndex.value][selectLang.value + "_understanding"]--;
			console.log(word.value[randomIndex.value][selectLang.value + "_understanding"]);
		} else if (newValue < 0) {
			leftTime.value = timer.value;
			//stopTimer();
		}
	}
);
console.log(this);
</script>

<style lang="scss" scoped></style>
