function vue_sort(arr = [], lang = "ru") {
	if (lang === "ru") {
		return arr.sort((a, b) => a.ru_understanding - b.ru_understanding);
	}
	if (lang === "en") {
		return arr.sort((a, b) => a.en_understanding - b.en_understanding);
	} else {
		return [];
	}
}
export default vue_sort;
