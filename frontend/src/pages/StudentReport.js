import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StudentReport(){
  const {id}=useParams();
  const [data,setData]=useState(null);

  useEffect(()=>{
    axios.get(`http://localhost:5000/student/${id}`)
    .then(r=>setData(r.data));
  },[id]);

  if(!data) return <div>Loading...</div>;

  return(
    <div>
      <Navbar/>
      <div style={{padding:20}}>
        <h2>{data.name}</h2>
        <p>Dept: {data.department}</p>
        <p>Readiness: {data.readiness}</p>
        <p>Placement Probability: {data.probability}%</p>
      </div>
    </div>
  );
}
