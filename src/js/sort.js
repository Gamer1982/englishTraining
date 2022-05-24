function vue_sort(arr = [], lang = "ru") {
	return arr.sort((a, b) => a[lang + "_result"] - b[lang + "_result"]);
}
export default vue_sort;
