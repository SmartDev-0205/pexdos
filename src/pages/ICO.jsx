import React, { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useWalletModal } from "../hooks/useWalletModal";
import WalletModal from "../components/WalletModal/WalletModal";
import { toBigNum, fromBigNum } from "../utils";
import bnbpng from "../assets/bnb.png";
import shibapng from "../assets/shiba.png";
import Grid from "@material-ui/core/Grid";
import { useWeb3React } from "@web3-react/core";
import { walletconnect } from "../utils/connector";
import { ethers } from "ethers";
import { tokenContract, presaleContract } from "../contracts";
import { NotificationManager } from "react-notifications";
import background from "../assets/page-background.jpg";
 
export default function Presale() {
    const { active, account, library } = useWallet();
    const { deactivate } = useWeb3React();
    const { toggleOpen } = useWalletModal();
    const [bscAmount, setBSCAmount] = useState(0);
    const [shibaAmount, setShibaAmount] = useState(0);
    const [tokenPrice, setTokenPrice] = useState(1000);
    const [shibaBalance, setShibaBalance] = useState(0);
    const [stageFlag, setStageFlag] = useState(0);

    useEffect(() => {
        const getPrice = async () => {
            let price = (await presaleContract.getPrice()) / 1000000;
            setTokenPrice(price);
        };
        getPrice();
    }, []);

    useEffect(() => {
        const getStage = async () => {
            let stage = await presaleContract.getStage();
            setStageFlag(fromBigNum(stage, 0));
        };
        getStage();
    }, []);

    useEffect(() => {
        const getBalance = async () => {
            if (active && account) {
                let balance = (await tokenContract.balanceOf(account)) / 1e18;
                setShibaBalance(balance);
            } else {
                setShibaBalance(0);
            }
        };
        getBalance();
    }, [active]);

    const onBuy = async () => {
        try {
            if (bscAmount <= 0) {
                NotificationManager.error("Please input BNB amount");
                return;
            }
            let bnbAmount = bscAmount;
            let provider = library.provider;
            const prov = new ethers.providers.Web3Provider(provider);
            let signer = await prov.getSigner();
            var signedPresaleContract = presaleContract.connect(signer);
            const balance = await prov.getBalance(account);
            let estimatedPrice = Number(balance) - toBigNum(0.0003, 18) * 1e18;
            if (estimatedPrice > toBigNum(bnbAmount, 18)) {
            }

            var tx = await signedPresaleContract.buy({
                value: toBigNum(bnbAmount, 18),
            });
            await tx.wait();
            NotificationManager.success("Buy Success");
        } catch (error) {
            NotificationManager.error("Insufficient funds");
        }
    };
    const onBscChange = (e) => {
        try {
            if (e.target.value === "") {
                setBSCAmount(0);
                setShibaAmount(0);
            } else {
                let amount = e.target.value;
                amount = amount.toString().replace(/^0+/, "");
                if (amount.length === 0) amount = "0";
                if (amount[0] === ".") amount = "0" + amount;
                setShibaAmount(amount * tokenPrice);
                setBSCAmount(amount);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onShibaChange = (e) => {
        try {
            if (e.target.value === "") {
                onBscChange(0);
                onShibaChange(0);
            } else {
                let amount = e.target.value;
                amount = amount.toString().replace(/^0+/, "");
                if (amount.length === 0) amount = "0";
                if (amount[0] === ".") amount = "0" + amount;
                setShibaAmount(amount);
                setBSCAmount(amount / tokenPrice);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const disconnect = () => {
        if (window.localStorage.getItem("walletconnect")) {
            walletconnect.close();
            walletconnect.walletConnectProvider = null;
        }
        try {
            deactivate();
            localStorage.removeItem("walletconnect");
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <>
            <WalletModal />
            <div
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: "auto 100%",
                }}
            >
                <section className="inner-banner top-back-img">
                    {!active ? (
                        <button
                            className="top_connect_btn"
                            onClick={toggleOpen}
                            style={{ marginTop: "100px" }}
                        >
                            Connect Wallet{" "}
                        </button>
                    ) : (
                        <button
                            className="top_connect_btn"
                            onClick={disconnect}
                            style={{ marginTop: "100px" }}
                        >
                            Disconnect
                        </button>
                    )}

                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-12 col-xl-12 text-center">
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="center"
                                >
                                    <Grid item xs={10} md={10}>
                                        <h5 className="title-content">
                                            PXDS SWAP
                                        </h5>
                                    </Grid>

                                    <Grid item xs={10} md={10}>
                                        <h5 className="title-description">
                                            Receive your PXDS tokens instantly
                                            in 3 simple steps! Select your
                                            desired method of payment, add your
                                            receiving wallet address & pay.
                                            Simple!
                                        </h5>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="stage">
                    <span>
                        <div className={stageFlag === 1 ? "stage-active" : ""}>
                            Stage 1
                        </div>
                        <div className={stageFlag === 2 ? "stage-active" : ""}>
                            Stage 2
                        </div>
                        <div className={stageFlag === 3 ? "stage-active" : ""}>
                            Stage 3
                        </div>
                    </span>
                </section>

                <section className="padding-top padding-bottom">
                    <div className="container">
                        <div className="row gy-5">
                            <div className="col-lg-6">
                                <div className="game-details-left">
                                    <div id="coin-flip-cont">
                                        <div className="coins-wrapper">
                                            <div className="front">
                                                <img
                                                    src={bnbpng}
                                                    style={{ zIndex: -1000 }}
                                                    alt="game"
                                                />
                                            </div>
                                            <div className="back">
                                                <img
                                                    src={shibapng}
                                                    style={{ zIndex: -1000 }}
                                                    alt="game"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cd-ft"></div>
                                </div>
                            </div>
                            <div
                                className="col-lg-6"
                                id="airdrop_modal"
                                style={{ display: "none" }}
                            ></div>
                            <div className="col-lg-6" id="presale_modal">
                                <div className="game-details-right">
                                    {active && shibaBalance ? (
                                        <>
                                            <h3 className="mb-4 text-center">
                                                Current Balance :{" "}
                                                <span className="base--color">
                                                    <span className="bal">
                                                        {Number(shibaBalance)}
                                                    </span>{" "}
                                                    PXDS
                                                </span>
                                            </h3>
                                        </>
                                    ) : (
                                        <h3 className="mb-4 text-center">
                                            Presale
                                        </h3>
                                    )}

                                    <form id="game">
                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <input
                                                    type="number"
                                                    step="0.000001"
                                                    pattern="^0+|\s+[0-9]*"
                                                    value={bscAmount}
                                                    onChange={onBscChange}
                                                    className="form-control form--control amount-field"
                                                    placeholder="Enter BNB amount"
                                                />
                                                <span
                                                    className="input-group-text text-white bg--base"
                                                    id="basic-addon2"
                                                >
                                                    BNB
                                                </span>
                                            </div>
                                            <div className="input-group mb-3">
                                                <input
                                                    type="number"
                                                    step="0.000001"
                                                    pattern="^0+|\s+[0-9]*"
                                                    value={shibaAmount}
                                                    onChange={onShibaChange}
                                                    name="invest"
                                                    className="form-control form--control amount-field"
                                                    placeholder="Enter PEXD amount"
                                                />
                                                <span
                                                    className="input-group-text text-white bg--base"
                                                    id="basic-addon2"
                                                >
                                                    PXDS
                                                </span>
                                            </div>
                                            {/* <small className="form-text text-muted"><i className="fas fa-info-circle mr-2"></i>Minimum: 1 USD | Maximum: 500.00 USD | <span className="text-warning">Win Amount  1  %</span></small> */}
                                        </div>
                                        <div className="form-group mt-4 mt-sm-5 justify-content-center d-flex justify-content-between">
                                            <div className="single-select head gmimg active">
                                                <div className="back">
                                                    <img
                                                        src={bnbpng}
                                                        alt="game"
                                                    />
                                                </div>
                                            </div>
                                            <div className="single-select tail gmimg">
                                                <div className="front">
                                                    <img
                                                        src={shibapng}
                                                        alt="game"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="mt-5 text-center">
                                        {/* <a target="_blank" href="https://gleam.io">
                        <font className="text-info">Try to add your address to whitelist by joining</font>{" "}
                        <font className="text-warning"> https://gleam.io.</font>
                      </a> */}
                                        {active ? (
                                            <button
                                                onClick={onBuy}
                                                className="cmn--btn active w-100 text-center"
                                            >
                                                Buy PXDS
                                            </button>
                                        ) : (
                                            <button
                                                onClick={toggleOpen}
                                                className="cmn--btn active w-100 text-center"
                                            >
                                                Connect Wallet
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
