<script setup>
import MyDatePicker from './components/ThaiDatePicker.vue'
import { ref } from 'vue'
const thaiDate = ref('')
</script>

<template>
  <MyDatePicker v-model="thaiDate" />
  <input type="hidden" v-model="thaiDate" name="thaiDate">
</template>

<style scoped>
</style>
