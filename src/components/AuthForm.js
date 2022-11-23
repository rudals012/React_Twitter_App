import React, { useState } from 'react';
import {authService} from '../fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "styles/authForm.scss";

function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = e => {
        // console.log(e.target.name);
        const {target: {name, value}} = e;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            if(newAccount){
                // create newAccount
                data = await createUserWithEmailAndPassword(authService, email, password)
            }else{
                // log in
                data = await signInWithEmailAndPassword(authService, email, password)
            }
            console.log(data);
        } catch (error){
            // console.log(error);
            setError(error.message);
        }
    }
    
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
        <form onSubmit={onSubmit} className="container">
            <input type="email" placeholder="Email" required
            name="email" value={email} onChange={onChange} className="authInput"/>
            <input type="password" placeholder='Password' required 
            name="password" value={password} onChange={onChange} className="authInput"/>
            {/* <input type="submit" value="Log In" /> */}
            <input type="submit" className="authInput authSubmit"
            value={newAccount ? "Create Account" : "Log In"} />
            {error &&
            <span className='authError'>{error}</span>
            }
        </form>
        <span onClick={toggleAccount} className="authSwitch">
            {newAccount ? "Sign in" : "Create Account"}
        </span>
    </>
  )
}

export default AuthForm
