import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StudentReport from "./pages/StudentReport";
import CompanyAnalyzer from "./pages/CompanyAnalyzer";
import CompanyReport from "./pages/CompanyReport";
import CompanyManager from "./pages/CompanyManager";
import StudentManager from "./pages/StudentManager";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/student/:id" element={<StudentReport/>}/>
        <Route path="/companies" element={<CompanyAnalyzer/>}/>
        <Route path="/company/:id" element={<CompanyReport/>}/>
        <Route path="/manage-companies" element={<CompanyManager/>}/>
        <Route path="/manage-students" element={<StudentManager />} />
      </Routes>
    </BrowserRouter>
  );
}
