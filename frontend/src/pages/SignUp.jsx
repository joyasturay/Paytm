import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heading } from "../components/Heading";
import { Subheading } from "../components/Subheading";
import { BottomWarning } from "../components/BottomWarning";
export const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <div className="bg-slate-300 h-screen flex justify-center items-center">
            <div className="rounded-lg bg-white w-96 p-6 shadow-lg">
                <Heading label="Sign Up" />
                <Subheading label="Create your account" />
                <div className="space-y-4 mt-4">
                    <input 
                        onChange={e => setFirstName(e.target.value)}
                        type="text" 
                        placeholder="First Name" 
                        className="w-full px-3 py-2 border rounded border-slate-200"
                    />
                    <input 
                        onChange={e => setLastName(e.target.value)}
                        type="text" 
                        placeholder="Last Name" 
                        className="w-full px-3 py-2 border rounded border-slate-200"
                    />
                    <input 
                        onChange={e => setEmail(e.target.value)}
                        type="email" 
                        placeholder="Email" 
                        className="w-full px-3 py-2 border rounded border-slate-200"
                    />
                    <input 
                        onChange={e => setPassword(e.target.value)}
                        type="password" 
                        placeholder="Password" 
                        className="w-full px-3 py-2 border rounded border-slate-200"
                    />
                    <button 
                        className="w-full bg-gray-800 text-white py-2 rounded font-bold hover:bg-gray-900 transition-colors" 
                        onClick={async () => {
                            if (!firstName || !lastName || !email || !password) {
                                alert("All fields are required");
                                return;
                            }

                            if (password.length < 6) {
                                alert("Password must be at least 6 characters");
                                return;
                            }

                            if (!email.includes('@')) {
                                alert("Please enter a valid email");
                                return;
                            }

                            try {
                                const response = await axios.post("http://localhost:8080/api/v1/user/signup", {
                                    username: email,
                                    firstName,
                                    lastName,
                                    password
                                });
                                
                                if (response.data.token) {
                                    localStorage.setItem("token", response.data.token);
                                    navigate("/dashboard");
                                }
                            } catch(error) {
                                if (error.response?.data?.message) {
                                    alert(error.response.data.message);
                                } else if (error.code === "ERR_NETWORK") {
                                    alert("Cannot connect to server. Please check if backend is running.");
                                } else {
                                    alert("Something went wrong. Please try again.");
                                }
                                console.error("Signup error:", error);
                            }
                        }}
                    >
                        Sign Up
                    </button>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    )
}