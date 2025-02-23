import { Routes, Route } from "react-router";

import RootLayout from "./pages/RootLayout";
import Home from "./pages/Home";
import FileLayout from "./pages/FileLayout";
import BPView from "./pages/BPView";
import TableView from "./pages/TableView";
import MetricView from "./pages/MetricView";
import NoPage from "./pages/NoPage";

export default function App() {
  return (
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
  );
}