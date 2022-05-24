<template>
	<div>
		<select name="language" class="biblioteca" v-bind:value="books" id="biblioteca">
			<option selected disabled value="biblioteca">biblioteca</option>
			<option v-for="book in biblioteca" v-bind:key="book.name" value="biblioteca">{{ book }}</option>
		</select>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
