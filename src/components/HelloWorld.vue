<template>
	<MySelect v-model="words" :my_options="diction.map((elem) => elem.name)" :my_define="'biblioteca >>>'"></MySelect>

	<MySelect v-model="status.lang" :my_options="['ru', 'en']"></MySelect>

	<MySelect v-model="status.sel" :my_options="['output', 'input', 'rename', 'delete']"></MySelect>

	<p>{{ diction.map((elem) => elem.name) }}</p>

	<div class="lang">
		<div class="first" v-show="status.isRu">
			<input type="text" placeholder="ru" v-model="word.ru" />
			<input type="text" placeholder="ru_result" v-model="word.ru_result" />
			<h1 v-show="currentTime < 10">{{ word.en }}</h1>
		</div>

		<div class="second" v-show="status.isEn">
			<input type="text" placeholder="en" v-model="word.en" />
			<input type="text" placeholder="en_result" v-model="word.en_result" />
			<h1 v-show="currentTime < 10">{{ word.ru }}</h1>
		</div>
		<!-- <p>{{ library[index] }}</p> -->

		<div class="text" v-show="status.isText">
			<input type="text" x-webkit-speech v-model="response" />
		</div>

		<div class="btn" v-if="isBtn">
			<button type="button" @click.prevent="btnRename">{{ status.btn }}</button>
		</div>
		<div class="btn" v-else>
			<button type="button" @click.prevent="stopTimer">STOP</button>
		</div>
	</div>

	<div>
		<p>{{ currentTime }}</p>
	</div>

	<button type="button" @click="
	inCount++;
currentTime++;
	">
		+
	</button>

	<span>{{ inCount }}</span>

	<button type="button" @click="
	inCount--;
currentTime--;
	">
		-
	</button>

</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import dictionary from "../js/dictionary";
import vue_sort from "../js/sort";
import random from "../js/random";
import MyTimer from "./my-timer.vue";
import MySelectOption from "./my-selectOption.vue";
import MySelectLanguage from "./my-selectLanguage.vue";
import MySelect from "./my-select.vue";

defineProps({
	msg: String,
});

let diction = ref(dictionary);
if (window.localStorage.getItem("dictionary") !== null) {
	diction.value = JSON.parse(window.localStorage.getItem("dictionary"));
}
const words = ref("top500");
const status = reactive({ isRu: true, isEn: false, isText: true, sel: "output", btn: "START", lang: "ru" });

const inCount = ref(25);
const deCount = ref(0);
const index = ref(0);
const currentTime = ref(25);
const timer = ref(0);

const ruLang = ref("имя");
const enLang = ref("name");
const response = ref("");
const isBtn = ref(true);

const startTimer = () => {
	timer.value = setInterval(() => {
		currentTime.value--;
	}, 1000);
};
const stopTimer = () => {
	clearInterval(timer.value);
	console.log("stopTimer");
	isBtn.value = true;
};
console.log(diction);

//______________________computed_______________________________

const word = computed(() => {
	return vue_sort(library.value, status.lang)[index.value];
});

const library = computed(() => {
	console.log(diction.value);
	return diction.value.filter((item) => item.libraryName === words.value)[0].data;
});



//_____________________endComputed_____________________________

//console.log(localStorage.dictionary || dictionary);
//console.log(vue_sort(diction, "en"));

//________________________W A T C H____________________________
watch(diction, (newValue, oldValue) => {
	vue_sort(diction.value, status.lang);
	localStorage.setItem("dictionary", JSON.stringify(diction));
	console.log(diction[diction.value.length - 1]);
});
watch(status, (newValue, oldValue) => {
	vue_sort(diction.value, status.lang);
	switch (status.sel) {
		case "output":
			status.isRu = status.lang === "ru";
			status.isEn = status.lang === "en";
			status.isText = true;
			status.btn = "START";
			break;
		case "input":
			status.isRu = true;
			status.isEn = true;
			status.isText = false;
			status.btn = "ENTER";
			stopTimer();
			break;
		case "rename":
			status.isRu = true;
			status.isEn = true;
			status.isText = false;
			status.btn = "ENTER";
			stopTimer();
			break;
		case "delete":
			status.isRu = true;
			status.isEn = true;
			status.isText = false;
			status.btn = "DELETE";
			stopTimer();
			break;
	}
});

watch(
	() => currentTime.value,
	(newValue) => {
		if (newValue === 0) {
			console.log("error");
			library[`${status.lang}+_result`]--;
		} else if (newValue < 0) {
			//stopTimer();
			console.log(words.value);
			console.log(diction.value.filter((item) => item.name === words.value)[0].data);
			index.value = random(library.value);
			currentTime.value = inCount.value;
		}
	}
);
watch(
	() => response.value,
	(newValue, oldValue) => {
		console.log(library.value[index.value].en, index.value);
		console.log(library.value[index.value].ru, index.value);
		if (status.lang === "ru" && response.value === library.value[index.value].en) {
			console.log(library.value[index.value].en, index.value);
			library.value[index.value].ru_result++;
			console.log("ru");
			response.value = "";
			currentTime.value = inCount.value;
			index.value = random(library.value);
		}
		if (status.lang === "en" && response.value === library.value[index.value].ru) {
			console.log(library.value[index.value].ru, index.value);
			library.value[index.value].en_result++;
			console.log("en");
			response.value = "";
			currentTime.value = inCount.value;
			index.value = random(library.value);
		}
	}
);
watch(
	() => words.value,
	(newValue) => { }
);
//________________________E N D___W A T C H_____________________________

const btnRename = (e) => {
	console.log(e);
	if (status.btn === "START") {
		console.log("START");
		//status.btn = "STOP";
		isBtn.value = false;
		startTimer();
	}
	if (status.btn === "STOP") {
		stopTimer();
		status.btn = "START";
	}
	if (status.btn === "ENTER" && status.sel === "input") {
		console.log("INPUT");
		diction.value.push({ en: diction.value[index.value].en, ru: diction[index.value].ru, ru_result: 0, en_result: 0 });
	}
	if (status.btn === "ENTER" && status.sel === "rename") {
		console.log("RENAME");
		diction.value.push(diction.value[index]);
	}
	if (status.btn === "DELETE") {
		console.log("DELETE");
		diction.value.splice(index.value, 1);
	}
};

// const submit = (value) => {
// 	console.log(value);
// 	timer.value = value;
// 	console.log("submit");
// };

// const submit1 = (value) => {
// 	console.log(value);
// 	status.lang = value;
// 	console.log("submit1");
// };

// const submit2 = (value) => {
// 	stopTimer();
// 	words.value = value;
// 	diction.value.filter((item) => item.name === words.value)[0].data;
// };
</script>

<style scoped>
h4 {
	display: none;
}

.lang {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding-bottom: 50px;
}

.btn {
	/* border: 1px solid red; */
	width: 20%;
	margin: 20px auto;
}

.first {
	min-height: 90px;
}

.second {
	height: 60px;
}
</style>
