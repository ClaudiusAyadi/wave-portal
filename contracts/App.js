import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
    // set state variables
    const [currentAccount, setCurrentAccount] = useState("");
    const [allWaves, setAllWaves] = useState([]);
    const contractAddress = "0xa7FE59cE4041c0f25c87Fe1b361F27c7e9fae076";
    const contractABI = abi.abi;

    // Check wallet status here
    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have MetaMask installed");
                return;
            } else {
                console.log("We have the Ethereum object", ethereum);
            }

            // get authorization
            const accounts = await ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account", account);
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found!");
            }
        } catch (error) {
            console.error("error");
        }
    };

    // Implement connectWallet here
    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);
            setCurrentAccount([0]);
        } catch (error) {
            console.error("error");
        }
    };

    // Method to get all the waves from SC
    const getAllWaves = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const portal = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                // Call allWaves() from SC
                const waves = await portal.allWaves();

                // Get address, timestamp, and message
                let wavesCleaned = [];
                waves.forEach((wave) => {
                    wavesCleaned.push({
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    });
                });

                // Store the data in React State
                setAllWaves(wavesCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let portal;

        const onNewWave = (from, timestamp, message) => {
            console.log("NewWave:", from, timestamp, message);
            setAllWaves((prevState) => [
                ...prevState,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message: message,
                },
            ]);
        };

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            portal = new ethers.Contract(contractAddress, contractABI, signer);
            portal.on("NewWave", onNewWave);
        }

        return () => {
            if (portal) {
                portal.off("NewWave", onNewWave);
            }
        };
    }, []);

    // Method to get users to wave
    const wave = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const portal = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                // Calling getTotalWaves() from SC
                let count = await portal.getTotalWaves();
                console.log("Total Waves:", count.toNumber());

                // Calling wave() from SC
                const tx = await portal.wave("This is first wave", {
                    gasLimit: 300000,
                });
                console.log("Mining...", tx.hash);

                await tx.wait();
                console.log("Mined...", tx.hash);

                count = await portal.getTotalWaves();
                console.log("Total Waves:", count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="main">
            <div className="meta">
                <div className="header">👋 Hey there!</div>
                <div className="bio">
                    I am D. C., and welcome to my New World!
                    <br />
                    <br />
                    This is my first web3 app using the Buildspace resources,
                    and I hope you will help me test it out, too.
                    <br />
                    <br />
                    I am particularly interested in how blockchain could help
                    bring leverage to the underbanked and unbanked in many
                    3rd-world countries, and fondly interested too in probable
                    blockchain applications in the treatment and management of
                    common cancers.
                    <br />
                    <br />
                    Going forward, I would love to work with anyone interested
                    in a similar area.
                    <br />
                    <br />
                    Thanks!
                    <br />
                    <br />
                    Total Waves:
                </div>
                <div className="alert">
                    Connect your Ethereum wallet below to wave at me and let's
                    connect!
                </div>

                <button className="waveButton" onClick={wave}>
                    Wave at Me
                </button>

                {/**
                 * If there is no currentAccount render this button
                 */}

                {!currentAccount && (
                    <button className="waveButton" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}

                {allWaves.map((wave, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "OldLace",
                                marginTop: "16px",
                                padding: "8px",
                            }}
                        >
                            <div>Address: {wave.address}</div>
                            <div>Time: {wave.timestamp.toString()}</div>
                            <div>Message: {wave.message}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default App;
