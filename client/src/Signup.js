import { NavLink, useNavigate } from "react-router-dom";
import "./signup.css";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

const Signup = ()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [hidepass ,setHidepass]=useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        await fetch("http://localhost:3001/register",{
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                username:email,
                password:password
            })
        }).then((result)=> {
            console.log(result.json());
            navigate("/login");
        }).catch((error)=>console.log(error));

    }

    const handlelogin2 =  ()=>{
        window.open("http://localhost:3001/auth/google/callback", "_self")
        
    }

    const handlefacebooklogin=()=>{
        window.open("http://localhost:3001/auth/facebook/callback", "_self")
    }

    return(
        <div className="outer-container-signup">
            <div className="inner-container-signup">
                <h1 className="title">Signup</h1>
                <form>
                    <input type="text" name="email" placeholder="Email" onChange={(e)=> setEmail(e.target.value)}/>
                    <br></br>
                    <input type="password" name="password" placeholder="Password" />
                    <br></br>
                    <input type={hidepass ? "password": "text"} placeholder="Confirm password" onChange={(e)=> setPassword(e.target.value)}/>
                    <FontAwesomeIcon icon={hidepass ? faEyeSlash : faEye} className="eyeicon" onClick={()=>setHidepass(!hidepass)}/>
                
                    
                    <button type="submit" onClick={handleSubmit}>Signup</button>
                    <br></br>
                </form>
                <div className="donot-account">
                    <p>Already have an account?</p>
                    <NavLink to="/login" className="signup-link">Login</NavLink>
                </div>

                <div className="separation">
                    <hr className="line"></hr>
                    <p className="or-statement">Or</p>
                    <hr className="line"></hr>
                </div>
                
                <div className="signin-special">
                    <button type="button" className="login-with-google-btn" onClick={handlelogin2}>
                        Sign in with Google
                    </button>
                    <button type="button" className="login-with-facebook-btn" onClick={handlefacebooklogin} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" version="1">
                            <path fill="#FFFFFF" d="M32 30a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v28z"/>
                            <path fill="#4267b2" d="M22 32V20h4l1-5h-5v-2c0-2 1.002-3 3-3h2V5h-4c-3.675 0-6 2.881-6 7v3h-4v5h4v12h5z"/>
                            </svg>
                        Sign in with Facebook
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Signup;