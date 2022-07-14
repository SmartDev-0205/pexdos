import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import countries from "./mock.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";

export default function KYC() {
    const navigate = useNavigate();
    useEffect(() => {
        const reloadCount = localStorage.getItem("reloadCount");
        if (reloadCount < 2) {
            localStorage.setItem("reloadCount", String(reloadCount + 1));
            window.location.reload();
        } else {
            localStorage.removeItem("reloadCount");
        }
        getVerification();
    }, []);

    const getVerification = async () => {
        try {
            let token = localStorage.getItem("userToken");
            let username = localStorage.getItem("username");
            let result = await axios.post(
                process.env.REACT_APP_BACKEND_URL +
                    "/api/user/checkverification",
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
                navigate("/show");
            } else if (result.data === "Not verified") {
                let res = await axios.post(
                    process.env.REACT_APP_BACKEND_URL + "/api/order/get",
                    {
                        username: username,
                    },
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    }
                );
                if (res.data != "") {
                    navigate("/show");
                }
            }
        } catch (err) {
            NotificationManager.error(err.response.data.message);
        }
    };

    const [radios, setRadios] = useState({
        0: false,
        1: false,
    });

    const [docType, setDocType] = useState("0");
    const [country, setCountry] = useState("Åland Islands");
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [faceImage, setFaceImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkBoxChange = (e, index) => {
        setRadios({
            ...radios,
            [index]: !radios[index],
        });
    };
    const handleFront = async (event) => {
        try {
            const newImage = event.target?.files?.[0];

            if (newImage) {
                setFrontImage(newImage);
            }
        } catch (err) {
            console.log(err.message);
        }
    };
    const handleBack = async (event) => {
        try {
            const newImage = event.target?.files?.[0];

            if (newImage) {
                setBackImage(newImage);
            }
        } catch (err) {
            console.log(err.message);
        }
    };
    const handleFace = async (event) => {
        try {
            const newImage = event.target?.files?.[0];

            if (newImage) {
                setFaceImage(newImage);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        let username = localStorage.getItem("username");
        let token = localStorage.getItem("userToken");
        const formData = new FormData();
        formData.append("country", country);
        formData.append("front_image", frontImage);
        if (backImage !== null) formData.append("back_image", backImage);
        formData.append("face_image", faceImage);
        formData.append("userName", username);

        try {
            const res = await axios.post(
                process.env.REACT_APP_BACKEND_URL + "/api/order/submit",
                formData,
                {
                    headers: {
                        "x-access-token": token,
                    },
                }
            );
            console.log(res);
            if (res) {
                NotificationManager.success("Successfully submitted");
                navigate("/show");
                setLoading(false);
            }
        } catch (ex) {
            setLoading(false);
            console.log(ex);
            // NotificationManager.error(ex.response.data.message);
        }
    };

    return (
        <div>
            <section className="wizard-section" style={{ marginTop: "100px" }}>
                <div className="row no-gutters">
                    <div className="col-lg-10 col-md-10">
                        <div className="form-wizard">
                            <div className="form-wizard-header">
                                <ul className="list-unstyled form-wizard-steps clearfix">
                                    <li className="active">
                                        <span>1</span>
                                    </li>
                                    <li>
                                        <span>2</span>
                                    </li>
                                    <li>
                                        <span>3</span>
                                    </li>
                                    <li>
                                        <span>4</span>
                                    </li>
                                </ul>
                            </div>
                            <br />
                            <br />
                            {/* First Step */}
                            <fieldset className="wizard-fieldset show">
                                <h2>Let's get you verified</h2>
                                <div className="form-group">
                                    Before you start, please prepare your
                                    identity document and make sure it is valid.{" "}
                                    <br />
                                    We also require you to accept our T's & C's,
                                    and to agree our processing of your personal
                                    data:
                                </div>
                                <div className="form-group">
                                    <div className="wizard-form-radio">
                                        <input
                                            name="radio1"
                                            type="checkbox"
                                            onClick={(e) =>
                                                checkBoxChange(e, 0)
                                            }
                                            value={radios[0]}
                                        />
                                        <label>
                                            By clicking next, I accept the{" "}
                                            <a href="#">
                                                <b>Terms and Conditions</b>
                                            </a>
                                        </label>
                                    </div>
                                    <div className="wizard-form-radio">
                                        <input
                                            name="radio2"
                                            type="checkbox"
                                            onClick={(e) =>
                                                checkBoxChange(e, 1)
                                            }
                                            value={radios[1]}
                                        />
                                        <label>
                                            I agree to the processing of my
                                            personal data, as described in the{" "}
                                            <a href="#">
                                                <b>
                                                    Consent to Personal Data
                                                    Processing NEXT
                                                </b>
                                            </a>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button
                                        className="form-wizard-next-btn float-right"
                                        disabled={!radios[0] || !radios[1]}
                                    >
                                        Next
                                    </button>
                                </div>
                            </fieldset>
                            {/* Second Step */}
                            <fieldset className="wizard-fieldset">
                                <h2>Take a photo of your document</h2>
                                <br />
                                <h3>Country</h3>
                                <p>
                                    Select the country that issued your
                                    document.
                                </p>
                                <div className="form-group">
                                    <select
                                        onChange={(e) =>
                                            setCountry(e.target.value)
                                        }
                                        value={country}
                                    >
                                        {countries.map((item, index) => (
                                            <option key={index}>
                                                {item.country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <h3>Document</h3>
                                <p>Choose your document type.</p>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    className="cards"
                                    onChange={(e) => setDocType(e.target.value)}
                                >
                                    <Grid item xs={12} sm={6} md={3}>
                                        <input
                                            type="radio"
                                            id="passport"
                                            name="card"
                                            value={0}
                                            defaultChecked
                                        />
                                        <label htmlFor="passport">
                                            Passport
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <input
                                            type="radio"
                                            id="idcard"
                                            name="card"
                                            value={1}
                                        />
                                        <label htmlFor="idcard">ID Card</label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <input
                                            type="radio"
                                            id="residence"
                                            name="card"
                                            value={2}
                                        />
                                        <label htmlFor="residence">
                                            Residence permit
                                        </label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <input
                                            type="radio"
                                            id="driver"
                                            name="card"
                                            value={3}
                                        />
                                        <label htmlFor="driver">
                                            Driver's license
                                        </label>
                                    </Grid>
                                </Grid>
                                <div className="form-group">
                                    <button className="form-wizard-previous-btn float-left">
                                        Previous
                                    </button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <button
                                        className="form-wizard-next-btn float-right"
                                        onClick={() => console.log(docType)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </fieldset>
                            {/* Third Step */}
                            <fieldset className="wizard-fieldset">
                                <h2>Take a photo of your document</h2>
                                <br />
                                <h3>
                                    Take a photo of your document.
                                    <br />
                                    The photo should be:
                                </h3>
                                <div className="form-group tips">
                                    <ul>
                                        <li>
                                            Bright and clear (good quality).
                                        </li>
                                        <li>
                                            Uncut (all corners of the document
                                            should be visible).
                                        </li>
                                    </ul>
                                </div>
                                <div className="form-group">
                                    <input
                                        accept="image/*"
                                        type="file"
                                        id="upload"
                                        multiple
                                        hidden
                                        onChange={handleFront}
                                    />
                                    <label
                                        htmlFor="upload"
                                        className="upload_button"
                                    >
                                        <CloudUploadIcon />
                                        <span>
                                            Upload the{" "}
                                            <b
                                                style={{
                                                    color: "gold",
                                                }}
                                            >
                                                front
                                            </b>{" "}
                                            of your document
                                        </span>
                                    </label>
                                </div>
                                {docType !== "0" ? (
                                    <div className="form-group">
                                        <input
                                            accept="image/*"
                                            type="file"
                                            id="upload1"
                                            hidden
                                            multiple
                                            onChange={handleBack}
                                        />
                                        <label
                                            htmlFor="upload1"
                                            className="upload_button"
                                        >
                                            <CloudUploadIcon />
                                            <span>
                                                Upload the{" "}
                                                <b
                                                    style={{
                                                        color: "gold",
                                                    }}
                                                >
                                                    back
                                                </b>{" "}
                                                of your document
                                            </span>
                                        </label>
                                    </div>
                                ) : null}
                                <div className="form-group clearfix">
                                    <button className="form-wizard-previous-btn float-left">
                                        Previous
                                    </button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <button
                                        className="form-wizard-next-btn float-right"
                                        disabled={
                                            docType === "0"
                                                ? frontImage
                                                    ? false
                                                    : true
                                                : frontImage && backImage
                                                ? false
                                                : true
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </fieldset>
                            {/* Forth Step */}
                            <fieldset className="wizard-fieldset">
                                <h2>Finish Verification</h2>
                                <p>
                                    To complete the face ID verification, please
                                    take a photo with your camera and upload it
                                    here.
                                </p>
                                <div className="form-group">
                                    <input
                                        accept="image/*"
                                        type="file"
                                        id="upload_face"
                                        hidden
                                        multiple
                                        onChange={handleFace}
                                    />
                                    <label
                                        htmlFor="upload_face"
                                        className="upload_button"
                                    >
                                        <CloudUploadIcon />
                                        <span>
                                            Upload a photo of{" "}
                                            <b style={{ color: "gold" }}>
                                                your face
                                            </b>
                                        </span>
                                    </label>
                                </div>
                                <div className="form-group clearfix">
                                    <button className="form-wizard-previous-btn float-left">
                                        Previous
                                    </button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {loading ? (
                                        <button className="form-wizard-submit float-right">
                                            Submitting...
                                        </button>
                                    ) : (
                                        <button
                                            className="form-wizard-submit float-right"
                                            disabled={faceImage ? false : true}
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </button>
                                    )}
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
