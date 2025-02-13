import { StrictMode, createContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import './index.css'

import RootLayout from "./pages/RootLayout";
import Home from "./pages/Home";
import FileLayout from "./pages/FileLayout";
import BPView from "./pages/BPView";
import TableView from "./pages/TableView";
import MetricView from "./pages/MetricView";
import NoPage from "./pages/NoPage";


const ThemeContext = createContext('light');

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />} >
          <Route index element={<Home />} />
          <Route path="file/:id" element={<FileLayout />} >
            <Route path="blueprint" element={<BPView/>}/>
            <Route path="table" element={<TableView/>}/>
            <Route path="metrics" element={<MetricView/>}/>
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(

    <ThemeContext.Provider value="dark">
        <App />
    </ThemeContext.Provider>

)
