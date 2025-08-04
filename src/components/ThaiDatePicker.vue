<template>
  <div class="datepicker" ref="datepickerRef">
    <div class="input-wrapper">
      <input
        type="text"
        :value="displayValue"
        @click="toggleCalendar"
        readonly
        :placeholder="placeholder"
        class="datepicker-input"
      />
      <svg 
        class="calendar-icon" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        @click="toggleCalendar"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    </div>

    <Transition name="calendar">
      <div v-if="isCalendarOpen" class="calendar-popup">
        <div class="calendar-header">
          <div class="date-selectors">
            <select 
              v-model="currentMonth" 
              class="date-select month-select"
              aria-label="เลือกเดือน"
            >
              <option 
                v-for="(name, index) in MONTH_NAMES" 
                :key="index" 
                :value="index"
              >
                {{ name }}
              </option>
            </select>

            <select 
              v-model="currentYear" 
              class="date-select year-select"
              aria-label="เลือกปี"
            >
              <option 
                v-for="year in availableYears" 
                :key="year" 
                :value="year"
              >
                {{ toBuddhistYear(year) }}
              </option>
            </select>
          </div>
        </div>

        <div class="calendar-weekdays">
          <div 
            v-for="day in WEEKDAY_NAMES" 
            :key="day" 
            class="weekday"
          >
            {{ day }}
          </div>
        </div>

        <div class="calendar-grid">
          <!-- Empty cells for days before the first day of the month -->
          <div 
            v-for="n in firstDayOfMonth" 
            :key="`empty-${n}`" 
            class="calendar-cell empty"
          ></div>

          <!-- Days of the month -->
          <button
            v-for="day in daysInCurrentMonth"
            :key="day"
            type="button"
            class="calendar-cell day"
            :class="{
              'selected': isSelectedDay(day),
              'today': isTodayDay(day),
              'other-month': false
            }"
            @click="selectDay(day)"
            :aria-label="`เลือกวันที่ ${day}`"
          >
            {{ day }}
          </button>
        </div>

        <div class="calendar-footer">
          <button 
            type="button" 
            class="today-button" 
            @click="selectToday"
          >
            วันนี้
          </button>
          <button 
            type="button" 
            class="clear-button" 
            @click="clearSelection"
          >
            ล้าง
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'เลือกวันที่'
  },
  minYear: {
    type: Number,
    default: () => new Date().getFullYear() - 50
  },
  maxYear: {
    type: Number,
    default: () => new Date().getFullYear() + 10
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// Template refs
const datepickerRef = ref(null)

// Reactive state
const selectedDate = ref(null)
const isCalendarOpen = ref(false)
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

// Constants
const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

const WEEKDAY_NAMES = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

// Computed properties
const availableYears = computed(() => {
  const years = []
  for (let year = props.minYear; year <= props.maxYear; year++) {
    years.push(year)
  }
  return years
})

const daysInCurrentMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const dayOfWeek = firstDay.getDay()
  // Convert Sunday=0 to Monday=0 system for Thai calendar
  return (dayOfWeek + 6) % 7
})

const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  
  const { year, month, day } = selectedDate.value
  const buddhistYear = toBuddhistYear(year)
  const monthStr = String(month + 1).padStart(2, '0')
  const dayStr = String(day).padStart(2, '0')
  
  return `${dayStr}/${monthStr}/${buddhistYear}`
})

const gregorianValue = computed(() => {
  if (!selectedDate.value) return ''
  
  const { year, month, day } = selectedDate.value
  const monthStr = String(month + 1).padStart(2, '0')
  const dayStr = String(day).padStart(2, '0')
  
  return `${dayStr}/${monthStr}/${year}`
})

// Utility functions
function toBuddhistYear(gregorianYear) {
  return gregorianYear + 543
}

function parseThaiDate(dateString) {
  if (!dateString) return null
  
  const parts = dateString.split('/')
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1 // Convert to 0-based month
  const year = parseInt(parts[2], 10)
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  
  return { year, month, day }
}

function isSelectedDay(day) {
  return selectedDate.value &&
         selectedDate.value.year === currentYear.value &&
         selectedDate.value.month === currentMonth.value &&
         selectedDate.value.day === day
}

function isTodayDay(day) {
  return today.getFullYear() === currentYear.value &&
         today.getMonth() === currentMonth.value &&
         today.getDate() === day
}

// Methods
function toggleCalendar() {
  isCalendarOpen.value = !isCalendarOpen.value
}

function selectDay(day) {
  selectedDate.value = {
    year: currentYear.value,
    month: currentMonth.value,
    day
  }
  
  const formattedDate = gregorianValue.value
  emit('update:modelValue', formattedDate)
  emit('change', formattedDate)
  
  isCalendarOpen.value = false
}

function selectToday() {
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  selectDay(today.getDate())
}

function clearSelection() {
  selectedDate.value = null
  emit('update:modelValue', '')
  emit('change', '')
  isCalendarOpen.value = false
}

function handleClickOutside(event) {
  if (datepickerRef.value && !datepickerRef.value.contains(event.target)) {
    isCalendarOpen.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  selectedDate.value = parseThaiDate(newValue)
  
  if (selectedDate.value) {
    currentYear.value = selectedDate.value.year
    currentMonth.value = selectedDate.value.month
  }
}, { immediate: true })

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.datepicker {
  position: relative;
  display: inline-block;
  width: 280px;
  font-family: 'Sarabun', sans-serif;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.datepicker-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 16px;
  border: 2px solid #facc15;
  border-radius: 8px;
  background-color: #fffbea;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.datepicker-input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.calendar-icon {
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  color: #d97706;
  cursor: pointer;
  transition: color 0.2s ease;
}

.calendar-icon:hover {
  color: #b45309;
}

.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #facc15;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 16px;
  margin-top: 4px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}



.date-selectors {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.date-select {
  padding: 8px 12px;
  border: 1px solid #facc15;
  border-radius: 6px;
  background: #fffbea;
  color: #d97706;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
}

.month-select {
  min-width: 140px;
}

.year-select {
  min-width: 80px;
}

.date-select:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.date-select:hover {
  background: #facc15;
  color: #ffffff;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: #d97706;
  padding: 8px 4px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 16px;
}

.calendar-cell {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.calendar-cell.empty {
  background: transparent;
}

.calendar-cell.day {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #d97706;
}

.calendar-cell.day:hover {
  background: #fef3c7;
  color: #d97706;
}

.calendar-cell.day.today {
  background: #fff5c7;
  color: #d97706;
  font-weight: 600;
}

.calendar-cell.day.selected {
  background: #facc15;
  color: #ffffff;
  font-weight: 600;
}

.calendar-cell.day.selected:hover {
  background: #f59e0b;
}

.calendar-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.today-button,
.clear-button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #facc15;
  border-radius: 6px;
  background: #fffbea;
  color: #d97706;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.today-button:hover {
  background: #facc15;
  color: #ffffff;
}

.clear-button:hover {
  background: #fca5a5;
  border-color: #f87171;
  color: #ffffff;
}

/* Transition animations */
.calendar-enter-active,
.calendar-leave-active {
  transition: all 0.2s ease;
}

.calendar-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.calendar-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

</style>