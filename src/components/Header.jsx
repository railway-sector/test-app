import DropdownContext from "./DropdownContext";

// 2. Design header properties
export default function Header() {
  return (
    <>
      <header
        slot="header"
        id="header-title"
        style={{
          display: "flex",
          height: "70px",
          padding: "0 1rem",
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 4,
          borderTopWidth: 5,
          borderColor: "#555555",
        }}
      >
        {/* <DropdownContext user="test" /> */}
        <DropdownContext />
      </header>
    </>
  );
}
