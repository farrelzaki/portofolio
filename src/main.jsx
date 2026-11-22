import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/manrope'
import '@fontsource/ibm-plex-mono/500.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App.jsx'

// Tunggu font utama siap (maks. 1,5 detik) sebelum render, supaya judul tidak sempat tampil
// dengan font cadangan lalu berganti (kedipan "Software Engineer" di awal).
const fonts = document.fonts
  ? Promise.all([
    document.fonts.load('800 100px "Archivo Variable"'),
    document.fonts.load('400 16px "Manrope Variable"'),
  ]).catch(() => {})
  : Promise.resolve()
const timeout = new Promise((r) => setTimeout(r, 1500))

Promise.race([fonts, timeout]).then(() => {
  createRoot(document.getElementById('root')).render(<App />)
})
