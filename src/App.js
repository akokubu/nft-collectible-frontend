import { useEffect, useState } from "react";
import "./App.css";
import contract from "./contracts/NFTCollectible.json";
import { ethers } from "ethers";
import Footer from "./components/Footer";
import Header from "./components/Header";
import nftCollectibleImg from "./assets/nft_collectibles.gif";

const contractAddress = "0x0bfD17a065D90F6EB051763FfD498c13b90A0a0b";
const RARIBLE_LINK = `https://testnet.rarible.com/collection/polygon/${contractAddress}/items`;
const abi = contract.abi;
const MUMBAI_TESTNET = "0x13881";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamaskError, setMetamaskError] = useState(false);
  const [mineStatus, setMineStatus] = useState("");

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const network = await ethereum.request({ method: "eth_chainId" });

    if (accounts.length !== 0 && network.toString() === MUMBAI_TESTNET) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      setMetamaskError(true);
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install MetaMask!");
    }

    try {
      const network = await ethereum.request({ method: "eth_chainId" });

      if (network.toString() === MUMBAI_TESTNET) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Found an account! Address: ", accounts[0]);
        setMetamaskError(false);
        setCurrentAccount(accounts[0]);
      } else {
        setMetamaskError(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const mintNftHandler = async () => {
    try {
      setMineStatus("mining");
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ntfContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await ntfContract.mintNFTs(1, {
          value: ethers.utils.parseEther("0.01"),
        });

        console.log("Mining...please wait");
        await nftTxn.wait();

        console.log(`Minted, see transaction: ${nftTxn.hash}`);
        setMineStatus("success");
      } else {
        console.log("Ethereum object does not exist");
        setMineStatus("error");
      }
    } catch (err) {
      console.log(err);
      setMineStatus("error");
    }
  };

  useEffect(() => {
    checkWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  }, []);

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWalletHandler}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={mintNftHandler} class="cta-button mint-nft-button">
      Mint a Polygon Collectible NFT
    </button>
  );

  return (
    <>
      {metamaskError && (
        <div className="metamask-error">
          Metamask から Polygon Testnet に接続してください!
        </div>
      )}
      <div className="App">
        <div className="container">
          <Header rarible={RARIBLE_LINK}></Header>
          <div className="header-container">
            <div className="banner-img">
              <img src={nftCollectibleImg} alt="Polygon Squirrels" />
            </div>
            {currentAccount && mineStatus !== "mining" && renderMintUI()}
            {!currentAccount && renderNotConnectedContainer()}
            <div class="mine-submission">
              {mineStatus === "success" && (
                <div className={mineStatus}>
                  <p>NFT minting successful!</p>
                  <p className="success-link">
                    <a
                      href={`https://testnet.rarible.com/user/${currentAccount}/owned`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Click here
                    </a>
                    <span> to view your NFT on Rarible.</span>
                  </p>
                </div>
              )}
              {mineStatus === "mining" && (
                <div className={mineStatus}>
                  <div className="loader" />
                  <span>Transaction is mining</span>
                </div>
              )}
              {mineStatus === "error" && (
                <div className={mineStatus}>
                  <p>
                    Transaction failed. Make sure you have at least 0.01 MATIC
                    in your Metamask wallet and try again.
                  </p>
                </div>
              )}
            </div>
            {currentAccount && (
              <div className="show-user-address">
                Your address being connected: &nbsp;
                <br />
                <span>
                  <a className="user-address" target="_blank" rel="noreferrer">
                    {currentAccount}
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
        <Footer address={contractAddress} />
      </div>
    </>
  );
}

export default App;
