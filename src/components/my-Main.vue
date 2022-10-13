<template>
	<div class="wrapper">
		<MySelect class="select" v-model="selectLibrary" :my_options="libraryNames" :my_define="'biblioteca >>>'"></MySelect>

		<MySelect class="select" v-model="selectLang" :my_options="['ru', 'en']"></MySelect>

		<MySelect class="select" v-model="selectOption" :my_options="['Start', 'Input', 'Rename', 'Del']"></MySelect>

		<div class="lang">
			<div class="inputRu divInput" v-show="selectOption !== 'Start' || selectLang === 'ru'">
				<input class="input" type="text" placeholder="ru" v-model="word[randomIndex].ru" />
				<input class="input" type="text" placeholder="ru_understanding" v-model="word[randomIndex].ru_understanding" />
				<h1 v-show="leftTime < 10" :style="`color: rgba(255, 179, 65, ${1 - leftTime / 10})`">{{ word[randomIndex].en }}</h1>
			</div>
			<div class="inputEn divInput" v-show="selectOption !== 'Start' || selectLang === 'en'">
				<input class="input" type="text" placeholder="en" v-model="word[randomIndex].en" />
				<input class="input" type="text" placeholder="en_understanding" v-model="word[randomIndex].en_understanding" />
				<h1 v-show="leftTime < 10" :style="`color: rgba(255, 179, 65, ${1 - leftTime / 10})`">{{ word[randomIndex].ru }}</h1>
			</div>

			<div class="text divInput" v-show="isText">
				<input class="input" type="text" x-webkit-speech v-model="response" />
			</div>

			<div class="divBtn" v-if="isBtn">
				<button class="btn" type="button" @click.prevent="btnRename">{{ selectOption }}</button>
			</div>

			<div class="divBtn" v-else>
				<button class="btn" type="button" @click.prevent="stopTimer">STOP</button>
			</div>
			<!-- <p>{{ word[randomIndex] }}</p> -->
		</div>
		<div class="divLeftTime">
			<p>{{ leftTime }}</p>
		</div>

		<button
			class="btn btnNum"
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
			class="btn btnNum"
			type="button"
			@click="
				timer--;
				leftTime--;
			"
		>
			−
		</button>
	</div>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount, onDeactivated } from "vue";
import rootDictionary from "../js/dictionary";
import random from "../js/random";
import toSortDictionary from "../js/sort";
import MySelect from "./my-select.vue";

const selectLibrary = ref("top500");
const selectLang = ref("ru");
const selectOption = ref("Start");
const response = ref("");
const randomIndex = ref(0);
const leftTime = ref(15);
const timer = ref(15);
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
		//______________________________________________ verification
		if (!word.value.map((el) => el.en).includes(word.value[randomIndex.value].en) && !word.value.map((el) => el.ru).includes(word.value[randomIndex.value].ru)) {
			console.log("includes");
			word.value.push({ en: word.value[randomIndex.value].en, ru: word.value[randomIndex.value].ru, ru_understanding: 0, en_understanding: 0 });
		}
	}
	if (selectOption.value === "Rename") {
		console.log("RENAME");
		//______________________________________________ verification
		word.value.push(word.value[randomIndex.value]);
	}
	if (selectOption.value === "Del") {
		console.log("DELETE");
		//______________________________________________ verification
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
			word.value[randomIndex.value][selectLang.value + "_understanding"]++;
			// _________________Настройки для разных режимов______________________________________________
			console.log(word.value[randomIndex.value][selectLang.value + "_understanding"]);
			leftTime.value = timer.value;
		} else if (newValue < 0) {
			leftTime.value = timer.value;
			stopTimer();
		}
	}
);

onDeactivated(() => {
	localStorage.removeItem("dictionary");
	localStorage.setItem("dictionary", JSON.stringify(dictionary.value));
	console.log("onBeforeUnmount", this);
});
</script>

<style lang="scss" scoped>
.wrapper {
}
.select {
	border-radius: 10px;
	padding: 1px 10px;
	margin: 0 3px;
}
.lang {
	font: 1.5em sans-serif;
}
.inputRu {
	min-height: 150px;
}
.inputEn {
	min-height: 150px;
}
.text {
}
.divLeftTime {
	font-weight: bold;
	font-size: 30px;
	color: rgb(255, 2, 255);
}
.btn {
	padding: 5px 25px;
	border-radius: 10px;
	margin: 15px;
	font-weight: bold;
	font-size: 16px;
}
.btnNum {
	font-size: 26px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
.input {
	border: 2px rgb(99, 20, 63) solid;
	box-shadow: 3px 3px 2px 1px;
	border-radius: 10px;
	padding: 5px;
	font-weight: bold;
	font-size: 16px;
}
</style>
