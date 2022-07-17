import "./Footer.css";

const Footer = ({ address }) => {
  return (
    <footer className="footer">
      <p>
        SMART CONTRACT ADDRESS:&nbsp;
        <br />
        <span>
          <a
            className="contract-link"
            href={`https://mumbai.polygonscan.com/address/${address}`}
            // href={`https://testnet.rarible.com/collection/polygon/${address}/items`}
            target="_blank"
            rel="noreferrer"
          >
            ${address}
          </a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
