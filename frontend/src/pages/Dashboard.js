import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const API = "http://localhost:5000";

export default function Dashboard() {

  const [students, setStudents] = useState([]);
  const [skillsChart, setSkillsChart] = useState([]);
  const [companyChart, setCompanyChart] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${API}/students`).then(r => setStudents(r.data));
    axios.get(`${API}/dashboard/summary`).then(r => {
      setSkillsChart(r.data.skills);
      setCompanyChart(r.data.companies);
    });
  }, []);

  // -------- filter by skill name -------
  const filtered = students.filter(s =>
    s.skills.join(",").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>

        <h1>Placement Readiness Dashboard</h1>

        {/* -------- SEARCH -------- */}
        <input
          placeholder="Search by skill (e.g. DSA)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        {/* -------- STUDENTS -------- */}
        <h2>Students</h2>
        {filtered.map(s => (
          <div key={s._id} style={{ border: "1px solid", margin: 5, padding: 5 }}>
            {s.name} – {s.department}
            <br />
            Skills: {s.skills.join(", ")}
          </div>
        ))}


        {/* -------- SKILL READINESS CHART -------- */}
        <h2>Skill Availability (%)</h2>

        <BarChart width={500} height={300} data={skillsChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percent" />
        </BarChart>


        {/* -------- COMPANY READINESS -------- */}
        <h2>Company Readiness (%)</h2>

        <BarChart width={500} height={300} data={companyChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="company" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percent" />
        </BarChart>

      </div>
    </div>
  );
}
