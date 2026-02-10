import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CompanyAnalyzer(){
  const [data,setData]=useState([]);

  useEffect(()=>{
    axios.get("http://localhost:5000/companies")
    .then(r=>setData(r.data));
  },[]);

  return(
    <div>
      <Navbar/>
      <div style={{padding:20}}>
        <h2>Companies</h2>
        {data.map(c=>(
          <p key={c._id}>
            <a href={`/company/${c._id}`}>{c.name}</a>
          </p>
        ))}
      </div>
    </div>
  );
}
