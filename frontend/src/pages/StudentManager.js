import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "http://localhost:5000";

export default function StudentManager() {

  const emptyForm = {
    name: "",
    department: "",
    cgpa: "",
    coding_score: "",
    aptitude_score: "",
    communication_score: "",
    internships: "",
    projects: "",
    skills: ""
  };

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // -------- load ----------
  const load = () => {
    axios.get(`${API}/students`)
      .then(res => setStudents(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  // -------- add / update ----------
  const submit = () => {
    const payload = {
      name: form.name,
      department: form.department,
      cgpa: Number(form.cgpa),
      coding_score: Number(form.coding_score),
      aptitude_score: Number(form.aptitude_score),
      communication_score: Number(form.communication_score),
      internships: Number(form.internships),
      projects: Number(form.projects),
      skills: form.skills.split(",").map(s => s.trim())
    };

    if (editId) {
      axios.put(`${API}/students/${editId}`, payload)
        .then(() => {
          alert("Updated");
          setEditId(null);
          setForm(emptyForm);
          load();
        });
    } else {
      axios.post(`${API}/students`, payload)
        .then(() => {
          alert("Added");
          setForm(emptyForm);
          load();
        });
    }
  };

  // -------- edit ----------
  const editStudent = (s) => {
    setEditId(s._id);
    setForm({
      name: s.name,
      department: s.department,
      cgpa: s.cgpa,
      coding_score: s.coding_score,
      aptitude_score: s.aptitude_score,
      communication_score: s.communication_score,
      internships: s.internships,
      projects: s.projects,
      skills: s.skills.join(", ")
    });
  };

  // -------- delete ----------
  const del = (id) => {
    if (window.confirm("Delete this student?")) {
      axios.delete(`${API}/students/${id}`)
        .then(() => load());
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h1>Student Manager</h1>

        {/* -------- FORM -------- */}
        <div style={{ border: "1px solid gray", padding: 15, marginBottom: 20 }}>
          <h3>{editId ? "Update Student" : "Add Student"}</h3>

          <input placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} /><br />

          <input placeholder="Department"
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })} /><br />

          <input placeholder="CGPA"
            value={form.cgpa}
            onChange={e => setForm({ ...form, cgpa: e.target.value })} /><br />

          <input placeholder="Coding Score"
            value={form.coding_score}
            onChange={e => setForm({ ...form, coding_score: e.target.value })} /><br />

          <input placeholder="Aptitude Score"
            value={form.aptitude_score}
            onChange={e => setForm({ ...form, aptitude_score: e.target.value })} /><br />

          <input placeholder="Communication Score"
            value={form.communication_score}
            onChange={e => setForm({ ...form, communication_score: e.target.value })} /><br />

          <input placeholder="Internships"
            value={form.internships}
            onChange={e => setForm({ ...form, internships: e.target.value })} /><br />

          <input placeholder="Projects"
            value={form.projects}
            onChange={e => setForm({ ...form, projects: e.target.value })} /><br />

          <input placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })} /><br />

          <button onClick={submit}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* -------- LIST -------- */}
        <h2>Students</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 15
        }}>
          {students.map(s => (
            <div key={s._id} style={{
              border: "1px solid #333",
              padding: 12,
              borderRadius: 8,
              background: "#f8fafc"
            }}>

              <h3 style={{ marginTop: 0 }}>{s.name || "-"}</h3>

              <p><b>Department:</b> {s.department || "-"}</p>
              <p><b>CGPA:</b> {s.cgpa ?? "-"}</p>
              <p><b>Coding:</b> {s.coding_score ?? "-"}</p>
              <p><b>Aptitude:</b> {s.aptitude_score ?? "-"}</p>
              <p><b>Communication:</b> {s.communication_score ?? "-"}</p>
              <p><b>Internships:</b> {s.internships ?? "-"}</p>
              <p><b>Projects:</b> {s.projects ?? "-"}</p>
              <p><b>Skills:</b> {s.skills?.length ? s.skills.join(", ") : "-"}</p>

              <div style={{ marginTop: 10 }}>
                <button onClick={() => editStudent(s)}>Edit</button>
                <button onClick={() => del(s._id)} style={{ marginLeft: 5 }}>
                  Delete
                </button>
                <a href={`/student/${s._id}`}>
                  <button style={{ marginLeft: 5 }}>View</button>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
