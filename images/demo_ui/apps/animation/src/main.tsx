import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {KMPaint} from "./canvas/KMPaint.ts";

let kmPaint = new KMPaint();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App kmPaint={kmPaint}/>
  </StrictMode>,
)
