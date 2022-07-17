import "./Header.css";

const Header = ({ rarible }) => {
  return (
    <header>
      <h1 className="heading gradient-text">
        <a href={rarible} target="_blank" rel="noreferrer">
          Polygon Squirels
        </a>
      </h1>
      <div>
        <button className="r-button">
          <a href={rarible} target="_blank" rel="noreferrer">
            View Collection on Rarible
          </a>
        </button>
      </div>
    </header>
  );
};

export default Header;
