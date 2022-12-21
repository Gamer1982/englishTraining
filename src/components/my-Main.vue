<template>
	<div class="wrapper">
		<MySelect class="select" v-model="selectLibrary" :my_options="libraryNames" :my_define="'biblioteca >>>'">
		</MySelect>

		<MySelect class="select" v-model="selectLang" :my_options="['ru', 'en']"></MySelect>

		<MySelect class="select" v-model="selectOption" :my_options="['Start', 'Input', 'Rename', 'Del']"></MySelect>

		<div class="lang">
			<div class="inputRu divInput" v-show="selectOption !== 'Start' || selectLang === 'ru'">
				<input class="input" type="text" placeholder="ru" v-model="word[randomIndex].ru" />
				<input class="input" type="text" placeholder="ru_understanding"
					v-model="word[randomIndex].ru_understanding" />
				<h1 v-show="leftTime < 10" :style="`color: rgba(255, 179, 65, ${1 - leftTime / 10})`">{{
						word[randomIndex].en
				}}</h1>
			</div>
			<div class="inputEn divInput" v-show="selectOption !== 'Start' || selectLang === 'en'">
				<input class="input" type="text" placeholder="en" v-model="word[randomIndex].en" />
				<input class="input" type="text" placeholder="en_understanding"
					v-model="word[randomIndex].en_understanding" />
				<h1 v-show="leftTime < 10" :style="`color: rgba(255, 179, 65, ${1 - leftTime / 10})`">{{
						word[randomIndex].ru
				}}</h1>
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

		<button class="btn btnNum" type="button" @click="
	timer++;
leftTime++;
		">
			+
		</button>

		<span> {{ timer }} </span>

		<button class="btn btnNum" type="button" @click="
	timer--;
leftTime--;
		">
			−
		</button>
		<div class="myCssexperiments">
			<div class="kvadrat"></div>
			<div class="krug"></div>
			<div class="treugolnbr"></div>
			<div class="trapeciya"></div>
			<div class="wrapperStar">
				<div class="zvezda1"></div>
				<div class="zvezda2"></div>
				<div class="zvezda3"></div>
				<div class="zvezda4"></div>
				<div class="zvezda5"></div>
			</div>
			<div class="shestygran"></div>
		</div>

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
if (!window.localStorage.dictionary) {
	window.localStorage.setItem("dictionary", JSON.stringify(rootDictionary));
}

const dictionary = ref(JSON.parse(window.localStorage.dictionary));


// if (window.localStorage.dictionary) {
// 	dictionary.value = JSON.parse(window.localStorage.getItem("dictionary"));
// }
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
		if (selectLang.value === "ru" && response.value.trim() === word.value[randomIndex.value].en) {
			word.value[randomIndex.value].ru_understanding++;
			console.log("ru");
			response.value = "";
			leftTime.value = timer.value;
			randomIndex.value = random(dictionary.value[indexLibrary.value].data);
		}
		if (selectLang.value === "en" && response.value.trim() === word.value[randomIndex.value].ru) {
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


onBeforeUnmount(() => {
	localStorage.removeItem("dictionary");
	localStorage.setItem("dictionary", JSON.stringify(dictionary.value));
	console.log("onBeforeUnmount");
	alert("сработал onBefoUnmount")
});
</script>

<style lang="scss" scoped>
.wrapper {}

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

.text {}

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

.myCssexperiments {
	// display: flex;
	// gap: 10px;
	// justify-content: center;

}

.kvadrat {
	height: 100px;
	width: 100px;
	border: red 1px solid;
}

.krug {
	height: 100px;
	width: 100px;
	border: aqua 1px solid;
	border-radius: 50%;
	background-color: aqua;

}

.treugolnbr {
	height: 30px;
	width: 120px;
	border-radius: 50%;

	border-left: 50px red solid;
	border-right: 50px red solid;
	border-top: 50px green solid;
	border-bottom: 50px solid green;



}

.trapeciya {
	height: 100px;
	width: 200px;
	border-radius: 66%;
	border: red 1px solid;

}

.wrapperStar {
	width: 200px;
	height: 200px;
	display: flex;
	border: 1px green solid;
	justify-content: center;
	align-items: center;
	gap: 30px;



}

.zvezda1 {
	height: 0px;
	width: 0px;
	border-left: 10px transparent solid;
	border-right: 10px transparent solid;
	border-top: 60px rgb(17, 195, 226) solid;
	border-bottom: 10px rgb(245, 14, 226) solid;
	position: absolute;
	left: 100px;
	bottom: -330px;



}

.zvezda2 {
	height: 0px;
	width: 0px;
	border-left: 10px transparent solid;
	border-right: 10px transparent solid;
	border-top: 60px rgb(219, 190, 21) solid;
	rotate: 72deg;
	position: absolute;
	left: 58px;
	bottom: -299px;

}

.zvezda3 {
	height: 0px;
	width: 0px;
	border-left: 10px transparent solid;
	border-right: 10px transparent solid;
	border-top: 60px rgb(0, 255, 42) solid;
	rotate: 144deg;
	position: absolute;
	left: 75px;
	bottom: -248px;
}

.zvezda4 {
	height: 0px;
	width: 0px;
	border-left: 10px transparent solid;
	border-right: 10px transparent solid;
	border-top: 60px rgb(25, 0, 255) solid;
	rotate: 216deg;
	position: absolute;
	left: 128px;
	bottom: -248px;
}

.zvezda5 {
	height: 0px;
	width: 0px;
	border-left: 10px transparent solid;
	border-right: 10px transparent solid;
	border-top: 60px red solid;
	rotate: 288deg;
	position: absolute;
	left: 144px;
	bottom: -299px;

}

.shestygran {}
</style>
