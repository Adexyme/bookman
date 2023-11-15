import { w3_open } from "./UtiLityFunctions";

const MenuManager = () => {
  return (
    <>
      <a className="w3-bar-item w3-button w3-right w3-tiny ">
        <i
          className="icofont-navigation-menu w3-input w3-border  w3-round  w3-black "
          onClick={() => w3_open()}
        ></i>
      </a>
    </>
  );
};
export default MenuManager;
