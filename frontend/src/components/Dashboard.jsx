import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate=useNavigate();
    const logoutHandler=async()=>{
      try{
        const token=localStorage.getItem("Tokens");
        console.log(token);
        await axios.post(
        "https://vidaura-1.onrender.com/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
        },
          withCredentials: true,
      });
      
        localStorage.clear();
        navigate("/login");
      }
      catch(error){
        console.error("logout error",error.response?.data || error.message);
      }
        


    }
  return (
    <div>
      <>
        <div className="navbar">
          <Button onClick={logoutHandler}>Logout</Button>
        </div>
      </>
    </div>
  );
}

export default Dashboard;
