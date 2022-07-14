import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Show() {
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        getVerification();
    }, []);

    const getVerification = async () => {
        let token = localStorage.getItem("userToken");
        let result = await axios.post(
            process.env.REACT_APP_BACKEND_URL + "/api/user/checkverification",
            {
                username: localStorage.getItem("username"),
            },
            {
                headers: {
                    "x-access-token": token,
                },
            }
        );
        if (result.data === "Verified") {
            setFlag(true);
        } else if (result.data === "Not verified") {
            setFlag(false);
        }
    };

    return (
        <div style={{ marginTop: "140px" }}>
            {flag ? (
                <div className="agree">
                    <div>
                        <h3 style={{ color: "blue" }}>Congratlation!</h3>
                        <h3 style={{ color: "blue" }}>You was confirmed.</h3>
                        <Link to="/presale">
                            <button className="btn btn-primary btn-block">Go to ICO</button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="disagree">
                    <div>
                        <h3>You are not confirmed. Please wait...</h3>
                    </div>
                </div>
            )}
        </div>
    );
}
