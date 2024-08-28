import logo from "../../assets/react_logo.svg";

function Header() {
  return (
    <div className="h-14 px-5  flex items-center shadow-md">
      <img
        className="h-8 mr-3 animate-spin"
        src={logo}
        alt="log"
      />
      <span className="text-2xl font-mono font-bold">React Playground</span>
    </div>
  );
}

export default Header;
