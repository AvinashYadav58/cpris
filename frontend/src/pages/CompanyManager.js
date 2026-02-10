import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "http://localhost:5000";

export default function CompanyManager() {

  const emptyForm = {
    name: "",
    role: "",
    min_cgpa: "",
    coding_cutoff: "",
    skills: ""
  };

  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // ---------------- load companies ----------------
  const loadCompanies = () => {
    axios.get(`${API}/companies`)
      .then(res => setCompanies(res.data));
  };

  useEffect(() => {
    loadCompanies();
  }, []);


  // ---------------- add or update ----------------
  const submit = () => {

    const payload = {
      name: form.name,
      role: form.role,
      min_cgpa: Number(form.min_cgpa),
      coding_cutoff: Number(form.coding_cutoff),
      skills: form.skills.split(",").map(s => s.trim())
    };

    if (editId) {
      axios.put(`${API}/companies/${editId}`, payload)
        .then(() => {
          alert("Updated");
          setEditId(null);
          setForm(emptyForm);
          loadCompanies();
        });
    } else {
      axios.post(`${API}/companies`, payload)
        .then(() => {
          alert("Added");
          setForm(emptyForm);
          loadCompanies();
        });
    }
  };


  // ---------------- edit ----------------
  const editCompany = (c) => {
    setEditId(c._id);
    setForm({
      name: c.name,
      role: c.role,
      min_cgpa: c.min_cgpa,
      coding_cutoff: c.coding_cutoff,
      skills: c.skills.join(", ")
    });
  };


  // ---------------- delete ----------------
  const deleteCompany = (id) => {
    if (window.confirm("Delete this company?")) {
      axios.delete(`${API}/companies/${id}`)
        .then(() => loadCompanies());
    }
  };


  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>Company Requirement Manager</h1>

        {/* ---------------- FORM ---------------- */}
        <div style={{ border: "1px solid gray", padding: 15, marginBottom: 20 }}>
          <h3>{editId ? "Update Company" : "Add Company"}</h3>

          <input
            placeholder="Company Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <br />

          <input
            placeholder="Role"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          />
          <br />

          <input
            placeholder="Min CGPA"
            value={form.min_cgpa}
            onChange={e => setForm({ ...form, min_cgpa: e.target.value })}
          />
          <br />

          <input
            placeholder="Coding Cutoff"
            value={form.coding_cutoff}
            onChange={e => setForm({ ...form, coding_cutoff: e.target.value })}
          />
          <br />

          <input
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })}
          />
          <br />

          <button onClick={submit}>
            {editId ? "Update" : "Add"}
          </button>
        </div>


        {/* ---------------- LIST ---------------- */}
        <h2>Company List</h2>

        {companies.length === 0 && <p>No companies added yet.</p>}

        {companies.map(c => (
          <div
            key={c._id}
            style={{
              border: "1px solid black",
              padding: 10,
              marginBottom: 10
            }}
          >
            <b>{c.name}</b> – {c.role}
            <br />
            CGPA: {c.min_cgpa} | Coding: {c.coding_cutoff}
            <br />
            Skills: {c.skills.join(", ")}

            <br />
            <button onClick={() => editCompany(c)}>Edit</button>
            <button onClick={() => deleteCompany(c._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
