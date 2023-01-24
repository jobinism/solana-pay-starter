import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import HeadComponent from '../components/Head';

// Constants
const TWITTER_HANDLE = "0xJobin";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [products, setProducts] = useState([]);

  const WalletMultiButtonDynamic = dynamic(
    async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  const { publicKey } = useWallet();
  
  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/m8WyGRkSBeLRTRz8oA/giphy.gif" alt="emoji" />

      <div className="button-container">
        <WalletMultiButtonDynamic className="cta-button connect-wallet-button" />
      </div>
    </div>
  );

  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        console.log("products", data);
      });
    }
  }, [publicKey]);

  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  )

  return (
    <div className="App">
      <HeadComponent/>
      <div className="container">
        <header className="header-container">
          <p className="header"> Jobin's Emoji Store 😈</p>
          <p className="sub-text">The only jobin store that accepts sh*tcoins</p>
        </header>

        <main>
        {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
