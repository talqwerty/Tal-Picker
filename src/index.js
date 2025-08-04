import ThaiDatePicker from './components/ThaiDatePicker.vue'

const ThaiDatePickerPlugin = {
  install(app) {
    app.component('ThaiDatePicker', ThaiDatePicker)
    app.component('thai-date-picker', ThaiDatePicker) // kebab-case สำหรับ HTML
  },
  ThaiDatePicker
}

export default ThaiDatePickerPlugin

// Export the component separately for individual import
export { ThaiDatePicker }