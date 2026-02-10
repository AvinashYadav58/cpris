import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CompanyReport(){
  const {id}=useParams();
  const [data,setData]=useState(null);

  useEffect(()=>{
    axios.get(`http://localhost:5000/analyze/company/${id}`)
    .then(r=>setData(r.data));
  },[id]);

  if(!data) return <div>Loading...</div>;

  return(
    <div>
      <Navbar/>
      <div style={{padding:20}}>
        <h2>{data.company}</h2>
        <p>Ready Students: {data.ready_percent}%</p>

        <h3>Skill Gaps</h3>
        {Object.keys(data.gaps).map(s=>(
          <p key={s}>{s} → {data.gaps[s]}</p>
        ))}
      </div>
    </div>
  );
}
