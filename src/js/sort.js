function vue_sort(arr = [], lang = "ru") {
	return arr.sort((a, b) => a[lang + "_understanding"] - b[lang + "_understanding"]);
}
export default vue_sort;
