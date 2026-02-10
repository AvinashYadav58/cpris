import { Link } from "react-router-dom";

export default function Navbar(){
  return(
    <div style={{background:"#111",color:"white",padding:"10px"}}>
      <Link to="/" style={{marginRight:20,color:"white"}}>Dashboard</Link>
      <Link to="/companies" style={{color:"white"}}>Company Analyzer</Link>
      <Link to="/manage-companies">Manage Companies</Link>
      <Link to="/manage-students">Manage Students</Link>
    </div>
  );
}
