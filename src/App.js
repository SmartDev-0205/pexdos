import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import { Routes, Route } from "react-router-dom";
import KYC from "./components/KYC";
import Admin from "./pages/Admin";
import RequireAuth from "./utils/requireAuth";
import Show from "./pages/Show";
import Presale from "./pages/ICO";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />

                <Route
                    path="/kyc"
                    element={
                        <RequireAuth>
                            <KYC />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <RequireAuth>
                            <Admin />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/show"
                    element={
                        <RequireAuth>
                            <Show />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/presale"
                    element={
                        // <RequireAuth>
                            <Presale />
                        // </RequireAuth>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
