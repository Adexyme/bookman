import BookSelect from "./BookSelect";
import MenuManager from "./MenuManager";

const HeaderLine1 = () => {
  return (
    <>
      {" "}
      <div className="w3-bar w3-red  w3-tiny ">
        <a href="#" className="w3-bar-item w3-button  ">
          <img
            src="/src/assets/icon.png"
            className=" w3-inputv "
            style={{ maxHeight: "30px " }}
          />
        </a>
        <MenuManager />
        <BookSelect />
      </div>{" "}
    </>
  );
};
export default HeaderLine1;
