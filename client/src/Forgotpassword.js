import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./forgotpassword.css";
const ForgotPassword=()=>{
    const [email,setEmail] =useState("");
    const navigate = useNavigate();
    const handleclick = async(e)=>{
        e.preventDefault();
        await fetch("http://localhost:3001/forgotpassword",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email:email
            })
        })
    }
    return(
        <div className="outer-container-fp">
            <div className="inner-container-fp">
                <h1 className="title">Forgot Password</h1>
                <form>
                    <input type="text" placeholder="Email" onChange={(e)=> setEmail(e.target.value)} />
                    <br></br>
                    
                    <button type="submit" onClick={handleclick}>Send</button>
                    <br></br>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;