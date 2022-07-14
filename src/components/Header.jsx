import React, { useEffect, useState } from "react";
import $ from "jquery";
import img_logo from "../assets/header/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
    console.log("------------------", process.env);
    const navigate = useNavigate();
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        $(".menu h4").click(function () {
            $("nav ul").toggleClass("active");
        });
        $("#body").click(function () {
            $("nav ul").removeClass("active");
        });
    }, []);

    useEffect(() => {
        if (localStorage.getItem("userToken") != undefined) {
            getVerification();
        }
    }, [flag, localStorage.getItem("userToken")]);

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

    const SignOut = async () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("username");
        setFlag(false);
        navigate("/signin");
    };

    return (
        <>
            <div className="responsive-bar">
                <div className="logo" style={{ width: "70%" }}>
                    <div className="logo_container">
                        <img src={img_logo} alt="logo" />
                        <span>
                            <a href="/" style={{ color: "white" }}>
                                Pexdos
                            </a>
                        </span>
                    </div>
                </div>
                <div className="menu">
                    <h4>Menu</h4>
                </div>
            </div>
            <nav style={{ zIndex: "100", backgroundColor: "#000118" }}>
                <div className="logo" style={{ width: "10%" }}>
                    <div className="logo_container">
                        <img src={img_logo} alt="logo" />
                        <span>
                            <a href="/" style={{ color: "white" }}>
                                Pexdos
                            </a>
                        </span>
                    </div>
                </div>
                <ul>
                    <li className="header_home_li">
                        <a className="mob-menu__link" href="/#who">
                            Who Are We
                        </a>
                    </li>
                    <li>
                        <a className="mob-menu__link" href="/#project">
                            Projects
                        </a>
                    </li>
                    <li>
                        <a className="mob-menu__link" href="/#roadmap">
                            Road Map
                        </a>
                    </li>
                    <li>
                        <a className="mob-menu__link" href="/#token">
                            Tokenomics
                        </a>
                    </li>
                    <li>
                        <a
                            className="mob-menu__link"
                            href="https://docs.pexdos.io/"
                        >
                            Whitepaper
                        </a>
                    </li>
                    <li>
                        {flag && (
                            <Link to="/presale">
                                <button className="header_signin_btn">
                                    Buy $PXDS
                                </button>
                            </Link>
                        )}
                    </li>
                    <li>
                        {localStorage.getItem("userToken") ? (
                            <button
                                className="header_signin_btn"
                                onClick={SignOut}
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link to="/signin">
                                <button className="header_signin_btn">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Header;
