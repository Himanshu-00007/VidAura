import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate=useNavigate();
    const logoutHandler=()=>{
        axios.post("https://vidaura.onrender.com/api/v1/users/logout",{},{withCredentials:true}).then((res)=>{
            navigate("/login");
        }).catch((error)=>{
            console.log(error);
        })
    }
  return (
    <div>
      <>
        <div className="navbar">
          <Button onClick={logoutHandler}>Logout</Button>
          <p>profile pic</p>
        </div>
      </>
    </div>
  );
}

export default Dashboard;
