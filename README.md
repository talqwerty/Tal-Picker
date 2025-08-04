# Thai DatePicker

Vue 3 DatePicker component with Thai Buddhist calendar support.
# Image Example
![Image](https://github.com/talqwerty/Tal-Picker/blob/main/src/assets/example.png)

## Features

- 🗓️ Thai Buddhist calendar (พ.ศ.)
- 🎨 Beautiful UI with yellow/gold theme
- 📱 Mobile responsive
- ♿ Accessible with ARIA labels
- 🔧 Customizable props
- 💪 TypeScript support
- 🌐 Returns Gregorian dates (ค.ศ.)

## Installation

```bash
npm install thai-datepicker
```

## Usage

### ES Module (Recommended)

```vue
<script setup>
import { ThaiDatePicker } from 'thai-datepicker'
import 'thai-datepicker/dist/thai-datepicker.css'
import { ref } from 'vue'

const selectedDate = ref('')
</script>

<template>
  <ThaiDatePicker 
    v-model="selectedDate" 
    placeholder="เลือกวันที่"
  />
</template>
```

### CDN Usage

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/thai-datepicker@latest/dist/thai-datepicker.iife.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/thai-datepicker@latest/dist/thai-datepicker.css">
</head>
<body>
  <div id="app">
    <thai-date-picker v-model="date"></thai-date-picker>
    <p>Selected: {{ date }}</p>
  </div>

  <script>
    const { createApp, ref } = Vue
    
    createApp({
      setup() {
        const date = ref('')
        return { date }
      }
    }).use(ThaiDatePicker).mount('#app')
  </script>
</body>
</html>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `String` | `''` | Selected date value (v-model) |
| `placeholder` | `String` | `'เลือกวันที่'` | Input placeholder text |
| `minYear` | `Number` | `currentYear - 50` | Minimum selectable year |
| `maxYear` | `Number` | `currentYear + 10` | Maximum selectable year |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `String` | Emitted when date is selected |
| `change` | `String` | Emitted when date changes |

## Date Format

- **Display**: Thai Buddhist year format (`DD/MM/YYYY` in พ.ศ.)
- **Output**: Gregorian year format (`DD/MM/YYYY` in ค.ศ.)

Example:
- User sees: `15/08/2568`
- v-model gets: `15/08/2025`

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build library
npm run build

# Preview build
npm run preview
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request