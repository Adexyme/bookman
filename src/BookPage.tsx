//import React from "react";
interface Props {
  value: number | string | unknown;
  index: number | string;
  toggleState: boolean;
}
const BookPage = ({ value, toggleState }: Props) => {
  return (
    <div
      key={"kpc_" + value}
      id={"pc_" + value}
      className="pageContainer "
      style={{ width: "1oo%" }}
      onLoad={() => console.log("pc_" + value)}
    >
      <canvas key={"k_" + value} id={"id_" + value} style={{ width: "1oo%" }}>
        {value as number | string}
        {toggleState}
      </canvas>
      <div key={"ktl_" + value} id={"tl_" + value} style={{ width: "1oo%" }}>
        {toggleState}
      </div>
      <div
        key={"kal_" + value}
        id={"al_" + value}
        className="w3-hide "
        style={{ width: "1oo%" }}
      >
        {toggleState}
      </div>
    </div>
  );
};

export default BookPage;
