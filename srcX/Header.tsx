import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}
const Header = ({ children }: Props) => {
  return (
    <>
      <div className="w3-top  ">{children}</div>
      <div className="   ">{children}</div>
    </>
  );
};

export default Header;
