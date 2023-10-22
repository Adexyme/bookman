import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const HeaderLine2 = ({ children }: Props) => {
  return (
    <>
      <div
        className="w3-bard w3-light-grey w3-center  w3-text-black  "
        style={{ width: "100vw" }}
      >
        {children}
      </div>
    </>
  );
};
export default HeaderLine2;
