// import Navbar from "../components/Navbar";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   CartesianGrid, LabelList
// } from "recharts";

// const API = "http://localhost:5000";

// export default function Dashboard() {

//   const navigate = useNavigate();

//   const [distribution, setDistribution] = useState([]);
//   const [skillsChart, setSkillsChart] = useState([]);
//   const [companyReadiness, setCompanyReadiness] = useState([]);

//   const [search, setSearch] = useState("");
//   const [minCgpa, setMinCgpa] = useState("");
//   const [minCoding, setMinCoding] = useState("");

//   const [skillStats, setSkillStats] = useState(null);



//   // =================================================
//   // LOAD INITIAL DATA
//   // =================================================
//   useEffect(() => {
//     axios.get(`${API}/dashboard/summary`)
//       .then(r => setSkillsChart(r.data.skills));

//     axios.get(`${API}/dashboard/skill-distribution`)
//       .then(r => setDistribution(r.data));

//     axios.get(`${API}/dashboard/company-readiness`)
//       .then(r => setCompanyReadiness(r.data));

//   }, []);



//   // =================================================
//   // SEARCH INTELLIGENCE (INDIVIDUAL + COMBINED)
//   // =================================================
//   const skillArray = search
//     .split(",")
//     .map(s => s.trim())
//     .filter(Boolean);

//   useEffect(() => {

//     // call API if ANY filter is present
//     if (skillArray.length > 0 || minCgpa || minCoding) {

//       axios.get(`${API}/dashboard/skills`, {
//         params: {
//           skills: search,
//           min_cgpa: minCgpa,
//           coding: minCoding
//         }
//       })
//         .then(r => setSkillStats(r.data))
//         .catch(() => setSkillStats(null));

//     } else {
//       setSkillStats(null);
//     }

//   }, [search, minCgpa, minCoding]);



//   const getStatus = () => {
//     if (!skillStats) return "";
//     if (skillStats.students_percent < 40) return "🔴 High Shortage";
//     if (skillStats.students_percent < 70) return "🟡 Moderate";
//     return "🟢 Good";
//   };


//   // =================================================
//   // CLICK NAVIGATION
//   // =================================================
//   const openSkill = (skill) => {
//     navigate(`/skill/${skill}`);
//   };

//   const openCompany = (company) => {
//     navigate(`/company/${company}`);
//   };



//   return (
//     <div>
//       <Navbar />

//       <div style={{ padding: 20 }}>
//         <h1>Placement Intelligence Dashboard</h1>



//         {/* ================================================= */}
//         {/* FILTERS */}
//         {/* ================================================= */}
//         <div style={{
//           marginBottom: 20,
//           padding: 12,
//           background: "#eef2ff",
//           borderRadius: 8
//         }}>
//           <b>Recruiter Simulation</b>
//           <br />

//           <input
//             placeholder="Skills (DSA, React)"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             style={{ width: 220, marginRight: 10, marginTop: 5 }}
//           />

//           <input
//             placeholder="Min CGPA"
//             value={minCgpa}
//             onChange={e => setMinCgpa(e.target.value)}
//             style={{ width: 120, marginRight: 10 }}
//           />

//           <input
//             placeholder="Coding >="
//             value={minCoding}
//             onChange={e => setMinCoding(e.target.value)}
//             style={{ width: 120 }}
//           />
//         </div>



//         {/* ================================================= */}
//         {/* RESULT */}
//         {/* ================================================= */}
//         {skillStats && (
//           <div style={{
//             border: "2px solid #444",
//             padding: 15,
//             marginBottom: 20,
//             background: "#f8fafc",
//             borderRadius: 8
//           }}>
//             <h2>Eligibility Insight</h2>

//             {search && <p><b>Skills:</b> {skillStats.skills.join(", ")}</p>}
//             {minCgpa && <p><b>Min CGPA:</b> {minCgpa}</p>}
//             {minCoding && <p><b>Coding ≥:</b> {minCoding}</p>}

//             <p><b>Students matched:</b> {skillStats.students_count}</p>
//             <p><b>Campus %:</b> {skillStats.students_percent}</p>
//             <p><b>Companies requiring:</b></p>

// <ul>
//   {skillStats.companies_need.length === 0 && <li>None</li>}

//   {skillStats.companies_need.map((c, i) => (
//     <li key={i} style={{ marginBottom: 5 }}>
//       {c.name} – {c.role}

//       <button
//         style={{ marginLeft: 10 }}
//         onClick={() => navigate(`/company/${c.name}`)}
//       >
//         View
//       </button>
//     </li>
//   ))}
// </ul>

//             <p><b>Status:</b> {getStatus()}</p>

//             <button
//               style={{ marginTop: 10 }}
//               onClick={() => navigate(`/skills/${search}`)}
//             >
//               View Students
//             </button>
//           </div>
//         )}



//         {/* ================================================= */}
//         {/* CAMPUS SKILL DISTRIBUTION */}
//         {/* ================================================= */}
//         <h2>Campus Skill Distribution</h2>
//         <p style={{ color: "gray" }}>Click a bar to view students.</p>

//         <BarChart
//           width={850}
//           height={300}
//           data={distribution}
//           onClick={(e) => {
//             if (e && e.activeLabel) openSkill(e.activeLabel);
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="skill" />
//           <YAxis />
//           <Tooltip formatter={(v) => `${v} students`} />
//           <Bar dataKey="count">
//             <LabelList dataKey="percent" position="top" formatter={(v)=>`${v}%`} />
//           </Bar>
//         </BarChart>



//         {/* ================================================= */}
//         {/* OVERALL SKILL AVAILABILITY */}
//         {/* ================================================= */}
//         <h2>Overall Skill Availability (%)</h2>

//         <BarChart
//           width={850}
//           height={300}
//           data={skillsChart}
//           onClick={(e) => {
//             if (e && e.activeLabel) openSkill(e.activeLabel);
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="skill" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="percent">
//             <LabelList dataKey="percent" position="top" formatter={(v)=>`${v}%`} />
//           </Bar>
//         </BarChart>



//         {/* ================================================= */}
//         {/* COMPANY READINESS */}
//         {/* ================================================= */}
//         <h2>Company Eligibility Overview</h2>
//         <p style={{ color: "gray" }}>
//           Click a company to see detailed gaps and action plan.
//         </p>

//         <BarChart
//           width={850}
//           height={300}
//           data={companyReadiness}
//           onClick={(e) => {
//             if (e && e.activeLabel) openCompany(e.activeLabel);
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="company" />
//           <YAxis />
//           <Tooltip formatter={(v) => `${v}% eligible`} />

//           <Bar dataKey="percent">
//             <LabelList
//               dataKey="eligible"
//               position="insideTop"
//               formatter={(v) => `${v}`}
//             />
//             <LabelList
//               dataKey="percent"
//               position="top"
//               formatter={(v) => `${v}%`}
//             />
//           </Bar>
//         </BarChart>

//       </div>
//     </div>
//   );
// }

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, LabelList
} from "recharts";

const API = "http://localhost:5000";

export default function Dashboard() {

  const navigate = useNavigate();

  const [distribution, setDistribution] = useState([]);
  const [skillsChart, setSkillsChart] = useState([]);
  const [companyReadiness, setCompanyReadiness] = useState([]);

  const [search, setSearch] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [minCoding, setMinCoding] = useState("");
  const [minAptitude, setMinAptitude] = useState("");   // ⭐ NEW

  const [skillStats, setSkillStats] = useState(null);



  // =================================================
  // LOAD INITIAL DATA
  // =================================================
  useEffect(() => {
    axios.get(`${API}/dashboard/summary`)
      .then(r => setSkillsChart(r.data.skills));

    axios.get(`${API}/dashboard/skill-distribution`)
      .then(r => setDistribution(r.data));

    axios.get(`${API}/dashboard/company-readiness`)
      .then(r => setCompanyReadiness(r.data));

  }, []);



  // =================================================
  // SEARCH INTELLIGENCE
  // =================================================
  const skillArray = search
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  useEffect(() => {

    if (skillArray.length > 0 || minCgpa || minCoding || minAptitude) {

      axios.get(`${API}/dashboard/skills`, {
        params: {
          skills: search,
          min_cgpa: minCgpa,
          coding: minCoding,
          aptitude: minAptitude    // ⭐ NEW
        }
      })
        .then(r => setSkillStats(r.data))
        .catch(() => setSkillStats(null));

    } else {
      setSkillStats(null);
    }

  }, [search, minCgpa, minCoding, minAptitude]);   // ⭐ NEW



  const getStatus = () => {
    if (!skillStats) return "";
    if (skillStats.students_percent < 40) return "🔴 High Shortage";
    if (skillStats.students_percent < 70) return "🟡 Moderate";
    return "🟢 Good";
  };


  // =================================================
  // CLICK NAVIGATION
  // =================================================
  const openSkill = (skill) => {
    navigate(`/skills?skills=${skill}`);
  };

  const openCompany = (company) => {
    navigate(`/company/${company}`);
  };



  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>Placement Intelligence Dashboard</h1>



        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}
        <div style={{
          marginBottom: 20,
          padding: 12,
          background: "#eef2ff",
          borderRadius: 8
        }}>
          <b>Recruiter Simulation</b>
          <br />

          <input
            placeholder="Skills (DSA, React)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 180, marginRight: 10, marginTop: 5 }}
          />

          <input
            placeholder="Min CGPA"
            value={minCgpa}
            onChange={e => setMinCgpa(e.target.value)}
            style={{ width: 110, marginRight: 10 }}
          />

          <input
            placeholder="Coding >="
            value={minCoding}
            onChange={e => setMinCoding(e.target.value)}
            style={{ width: 110, marginRight: 10 }}
          />

          {/* ⭐ NEW */}
          <input
            placeholder="Aptitude >="
            value={minAptitude}
            onChange={e => setMinAptitude(e.target.value)}
            style={{ width: 110 }}
          />
        </div>



        {/* ================================================= */}
        {/* RESULT */}
        {/* ================================================= */}
        {skillStats && (
          <div style={{
            border: "2px solid #444",
            padding: 15,
            marginBottom: 20,
            background: "#f8fafc",
            borderRadius: 8
          }}>
            <h2>Eligibility Insight</h2>

            {search && <p><b>Skills:</b> {skillStats.skills.join(", ")}</p>}
            {minCgpa && <p><b>Min CGPA:</b> {minCgpa}</p>}
            {minCoding && <p><b>Coding ≥:</b> {minCoding}</p>}
            {minAptitude && <p><b>Aptitude ≥:</b> {minAptitude}</p>} {/* ⭐ */}

            <p><b>Students matched:</b> {skillStats.students_count}</p>
            <p><b>Campus %:</b> {skillStats.students_percent}</p>

            <p><b>Companies requiring:</b></p>

            <ul>
              {skillStats.companies_need.length === 0 && <li>None</li>}

              {skillStats.companies_need.map((c, i) => (
                <li key={i} style={{ marginBottom: 5 }}>
                  {c.name} – {c.role}

                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => navigate(`/company/${c.name}`)}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>

            <p><b>Status:</b> {getStatus()}</p>



            {/* ⭐ PASS FILTERS */}
            <button
              style={{ marginTop: 10 }}
              onClick={() =>
                navigate(
                  `/skills?skills=${search}&cgpa=${minCgpa}&coding=${minCoding}&aptitude=${minAptitude}`
                )
              }
            >
              View Students
            </button>

          </div>
        )}



        {/* ================================================= */}
        {/* CAMPUS SKILL DISTRIBUTION */}
        {/* ================================================= */}
        <h2>Campus Skill Distribution</h2>
        <p style={{ color: "gray" }}>Click a bar to view students.</p>

        <BarChart
          width={850}
          height={300}
          data={distribution}
          onClick={(e) => {
            if (e && e.activeLabel) openSkill(e.activeLabel);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip formatter={(v) => `${v} students`} />
          <Bar dataKey="count">
            <LabelList dataKey="percent" position="top" formatter={(v)=>`${v}%`} />
          </Bar>
        </BarChart>



        {/* ================================================= */}
        {/* OVERALL SKILL AVAILABILITY */}
        {/* ================================================= */}
        <h2>Overall Skill Availability (%)</h2>

        <BarChart
          width={850}
          height={300}
          data={skillsChart}
          onClick={(e) => {
            if (e && e.activeLabel) openSkill(e.activeLabel);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percent">
            <LabelList dataKey="percent" position="top" formatter={(v)=>`${v}%`} />
          </Bar>
        </BarChart>



        {/* ================================================= */}
        {/* COMPANY READINESS */}
        {/* ================================================= */}
        <h2>Company Eligibility Overview</h2>
        <p style={{ color: "gray" }}>
          Click a company to see detailed gaps and action plan.
        </p>

        <BarChart
          width={850}
          height={300}
          data={companyReadiness}
          onClick={(e) => {
            if (e && e.activeLabel) openCompany(e.activeLabel);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="company" />
          <YAxis />
          <Tooltip formatter={(v) => `${v}% eligible`} />

          <Bar dataKey="percent">
            <LabelList
              dataKey="eligible"
              position="insideTop"
              formatter={(v) => `${v}`}
            />
            <LabelList
              dataKey="percent"
              position="top"
              formatter={(v) => `${v}%`}
            />
          </Bar>
        </BarChart>

      </div>
    </div>
  );
}
