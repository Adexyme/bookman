import React from "react";
interface Props {
  value: number | string;
  index: number | string;
  toggleState: boolean;
}
const BookPage = ({ value, index, toggleState }: Props) => {
  return (
    <div
      key={"kpc_" + value}
      id={"pc_" + value}
      className="pageContainer "
      onLoad={() => console.log("pc_" + value)}
    >
      <canvas key={"k_" + value} id={"id_" + value}>
        {value}
        {toggleState}
      </canvas>
      <div key={"ktl_" + value} id={"tl_" + value}></div>
      <div key={"kal_" + value} id={"al_" + value} className="w3-hide "></div>
    </div>
  );
};

export default BookPage;
