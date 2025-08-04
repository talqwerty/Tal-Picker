import ThaiDatePicker from './components/ThaiDatePicker.vue'

// Export เป็น plugin
export default {
  install(app) {
    app.component('ThaiDatePicker', ThaiDatePicker)
  }
}

// Export component แยก
export { ThaiDatePicker }

// Auto-install ถ้าใช้ script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.createApp({}).use(ThaiDatePicker)
}