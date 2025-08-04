import ThaiDatePicker from './components/ThaiDatePicker.vue'

const ThaiDatePickerPlugin = {
  install(app) {
    app.component('ThaiDatePicker', ThaiDatePicker)
    app.component('thai-date-picker', ThaiDatePicker) // kebab-case สำหรับ HTML
  }
}

export default ThaiDatePickerPlugin

export { ThaiDatePicker }

if (typeof window !== 'undefined' && window.Vue) {
  if (window.Vue.createApp) {
    window.ThaiDatePicker = ThaiDatePickerPlugin
  }
}