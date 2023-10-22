import { w3_close } from "./UtiLityFunctions";
const TableOfContent = () => {
  return (
    <>
      <div
        className="w3-sidebar w3-bar-block w3-collapse w3-card w3-border w3-border-black w3-light-grey"
        style={{ width: "200px" }}
        id="mySidebar"
      >
        <button
          className="w3-bar-item w3-button w3-hide-large w3-black "
          onClick={() => w3_close()}
        >
          Close &times;
        </button>
        <u>
          <a href="#" className="w3-bar-item w3-button">
            Table Of Content
          </a>
        </u>
        <a href="#" className="w3-bar-item w3-button">
          Link 1
        </a>
        <a href="#" className="w3-bar-item w3-button">
          Link 2
        </a>
        <a href="#" className="w3-bar-item w3-button">
          Link 3
        </a>
      </div>
    </>
  );
};

export default TableOfContent;
