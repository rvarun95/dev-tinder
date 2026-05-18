import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../utils/constants'

const Login = () => {

    const [emailId, setEmailId] = useState("rvarun95@test.com")
    const [password, setPassword] = useState("Varun@123")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log({ emailId, password });
        axios.post(`${API_BASE_URL}/login`, {
            email: emailId,
            password
        }, {
            withCredentials: true // Include cookies in the request
        }).then((response) => {
            console.log('Login successful', response.data);
            localStorage.setItem('token', response.data.token);
            dispatch(addUser(response.data));
            return navigate('/feed');
        }).catch((error) => {
            console.error('Login failed', error);
            alert('Login failed');
        });
    };

  return (
    <div className="flex items-center justify-center h-screen">
        <div className="card card-border bg-base-300 w-96">
            <div className="card-body">
                <h2 className="card-title justify-center">Login</h2>
                <div className="form-control">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Email ID</legend>
                        <input 
                            type="text" 
                            className="input" 
                            placeholder="Enter your Email Id" 
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Password</legend>
                        <input 
                            type="password" 
                            className="input" 
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </fieldset>
                </div>
                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login