import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { WalletModalProvider } from "./context/WalletModalContext";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

ReactDOM.render(
    <React.StrictMode>
        <Web3ReactProvider getLibrary={getLibrary}>
            <WalletModalProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
                <NotificationContainer />
            </WalletModalProvider>
        </Web3ReactProvider>
        <NotificationContainer />
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
