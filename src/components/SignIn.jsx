import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NotificationManager } from "react-notifications";

export default function SignIn() {
    const navigate = useNavigate();
    const [signUpParam, setSignUpParam] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [signInParam, setSignInParam] = useState({
        name: "",
        password: "",
    });

    const handleSignIn = async () => {
        try {
            let result = await axios.post(
                process.env.REACT_APP_BACKEND_URL + "/api/auth/signin",
                {
                    username: signInParam.name,
                    password: signInParam.password,
                }
            );
            if (result) {
                localStorage.setItem("userToken", result.data.accessToken);
                localStorage.setItem("username", signInParam.name);
                if (result.data.roles[0] === "ROLE_USER") {
                    navigate("/kyc");
                } else {
                    navigate("/admin");
                }
            }
        } catch (err) {
            NotificationManager.error(err.response.data.message);
        }
    };

    const handleSignUp = async () => {
        if (signUpParam.password.trim() !== signUpParam.confirm.trim()) {
            NotificationManager.warning("password is not correct");
            return;
        }
        try {
            let result = await axios.post(
                process.env.REACT_APP_BACKEND_URL + "/api/auth/signup",
                {
                    username: signUpParam.name,
                    email: signUpParam.email,
                    password: signUpParam.password,
                }
            );
            if (result.data.message) {
                NotificationManager.success("Successfully Sign Up");
                window.location.reload();
            }
        } catch (err) {
            NotificationManager.error(err.response.data.message);
        }
    };

    return (
        <div className="sign" style={{ marginTop: "100px" }}>
            <div id="loginForm" className="card mr-auto ml-auto mt-4 p-4">
                <h2 className="text-secondary text-center">Login</h2>
                <form className="p-4 form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            onChange={(e) =>
                                setSignInParam({
                                    ...signInParam,
                                    name: e.target.value,
                                })
                            }
                            value={signInParam.name}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            onChange={(e) =>
                                setSignInParam({
                                    ...signInParam,
                                    password: e.target.value,
                                })
                            }
                            value={signInParam.password}
                        />
                    </div>

                    <br />
                    <input
                        type="button"
                        value="Login"
                        className="btn btn-primary btn-block"
                        onClick={handleSignIn}
                    />
                </form>

                <br />
                <p className="text-right">
                    Don't have an account?
                    <a className="login-a" href="javascript:showRegistration()">
                        Register here.
                    </a>
                </p>
            </div>

            <div
                id="registrationForm"
                className="card mr-auto ml-auto mt-4 p-4 hidden"
            >
                <h2 className="text-secondary text-center">Register</h2>
                <form className="p-4 form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            onChange={(e) =>
                                setSignUpParam({
                                    ...signUpParam,
                                    name: e.target.value,
                                })
                            }
                            value={signUpParam.name}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            onChange={(e) =>
                                setSignUpParam({
                                    ...signUpParam,
                                    email: e.target.value,
                                })
                            }
                            value={signUpParam.email}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            onChange={(e) =>
                                setSignUpParam({
                                    ...signUpParam,
                                    password: e.target.value,
                                })
                            }
                            value={signUpParam.password}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Confirm</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            onChange={(e) =>
                                setSignUpParam({
                                    ...signUpParam,
                                    confirm: e.target.value,
                                })
                            }
                            value={signUpParam.confirm}
                        />
                    </div>
                    <br />
                    <input
                        type="button"
                        value="Register"
                        className="btn btn-primary btn-block"
                        onClick={handleSignUp}
                    />
                </form>
                <br />
                <p className="text-right">
                    Already have an account?
                    <a className="login-a" href="/signin">
                        Login here.
                    </a>
                </p>
            </div>
        </div>
    );
}
