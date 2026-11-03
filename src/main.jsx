import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/manrope'
import '@fontsource/ibm-plex-mono/500.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
