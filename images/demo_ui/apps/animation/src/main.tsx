import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {KMSpreadsheet} from "./canvas/KMSpreadsheet.ts";
import {DataSource} from "./dataSource.ts";

const dataSource = new DataSource(100, 200);
let kmSpreadSheet = new KMSpreadsheet(dataSource);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App kmSpreadSheet={kmSpreadSheet}/>
  </StrictMode>,
)
