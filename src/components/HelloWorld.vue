<template>
	<MySelect @sub="submit2" :my_define="'biblioteca >>>'" :my_options="diction.map((elem) => elem.name)"></MySelect>

	<MySelect @sub="submit1" :my_define="'lang >>>'" :my_options="['ru', 'en']"></MySelect>

	<!-- <div>
		<select name="language" v-model="status.lang" class="select-lang" id="sel">
			<option value="ru">ru</option>
			<option value="en">en</option>
		</select>
	</div> -->

	<MySelect @sub="submit" :my_options="['output', 'input', 'rename', 'delete']"></MySelect>

	<!-- <select name="language" class="select-lang" v-model="status.sel" id="sel">
		<option value="output">output</option>
		<option value="input">input</option>
		<option value="rename">rename</option>
		<option value="delete">delete</option>
	</select> -->

	<div class="lang">
		<div class="first" v-show="status.isRu">
			<input type="text" placeholder="ru" v-model="word.ru" />
			<input type="text" placeholder="ru_result" v-model="word.ru_result" />
			<h1 v-show="currentTime < 5">{{ word.en }}</h1>
		</div>

		<div class="second" v-show="status.isEn">
			<input type="text" placeholder="en" v-model="library[index].en" />
			<input type="text" placeholder="en_result" v-model="library[index].en_result" />
			<h1 v-show="currentTime < 5">{{ library[index].ru }}</h1>
		</div>
		<p>{{ word }}</p>

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

	<button
		type="button"
		@click="
			inCount++;
			currentTime++;
		"
	>
		+
	</button>

	<span>{{ inCount }}</span>

	<button
		type="button"
		@click="
			inCount--;
			currentTime--;
		"
	>
		-
	</button>
	<!-- <p>{{ library[index] }}</p> -->
	<!-- <MyTimer :currentTime="currentTime.value"></MyTimer> -->
	<!-- 
	<p>{{ diction[index].name }}</p>

	<input type="button" value="IMPORT" /> -->
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

const diction = reactive(JSON.parse(localStorage.dictionary) || dictionary);
const books = ref("top500");
const arrWords = reactive(diction.filter((item) => item.name === books.value)[0].data);
const status = reactive({ isRu: true, isEn: false, isText: true, sel: "output", btn: "START", lang: "ru" });
const biblioteca = reactive(localStorage.biblioteca || dictionary[0]);

const inCount = ref(6);
const deCount = ref(0);
const index = ref(0);
const currentTime = ref(6);
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
	clearTimeout(timer.value);
	isBtn.value = true;
};

//______________________computed_______________________________

const word = computed(() => {
	return vue_sort(diction[0].data, status.lang)[index.value];
});

const library = computed(() => {
	return diction.filter((item) => item.name === books.value)[0].data;
});

//_____________________endComputed_____________________________

//console.log(localStorage.dictionary || dictionary);
//console.log(vue_sort(diction, "en"));

//________________________W A T C H_____________________________
watch(diction, (newValue, oldValue) => {
	vue_sort(diction, status.lang);
	localStorage.setItem("dictionary", JSON.stringify(diction));
	console.log(diction[diction.length - 1]);
});
watch(status, (newValue, oldValue) => {
	vue_sort(diction, status.lang);
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
			library.value[index.value][`${status.lang}+_result`]--;
		} else if (newValue < 0) {
			//stopTimer();
			console.log(books.value);
			console.log(diction.filter((item) => item.name === books.value)[0].data);
			index.value = random(library);

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
// watch(
// 	() => books.value,
// 	(newValue) => {
// 		diction = localStorage.biblioteca[newValue];
// 	}
// );
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
		diction.push({ en: diction[index.value].en, ru: diction[index.value].ru, ru_result: 0, en_result: 0 });
	}
	if (status.btn === "ENTER" && status.sel === "rename") {
		console.log("RENAME");
		diction.push(diction[index]);
	}
	if (status.btn === "DELETE") {
		console.log("DELETE");
		diction.splice(index.value, 1);
	}
};
const submit = (value) => {
	console.log(value);
	timer.value = value;
	console.log("submit");
};
const submit1 = (value) => {
	console.log(value);
	status.lang = value;
	console.log("submit1");
};
const submit2 = (value) => {
	console.log(value);
	books.value = value;
	console.log(library.value[index.value]);
};
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
	height: 60px;
}
.second {
	height: 60px;
}
</style>
