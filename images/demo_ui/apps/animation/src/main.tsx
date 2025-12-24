import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {KMSpreadsheet} from "./canvas/KMSpreadsheet.ts";

let kmSpreadSheet = new KMSpreadsheet();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App kmSpreadSheet={kmSpreadSheet}/>
  </StrictMode>,
)
