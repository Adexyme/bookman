import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import BookSelect from "./BookSelect";
import MenuManager from "./MenuManager";
const HeaderLine1 = () => {
    return (_jsxs(_Fragment, { children: [" ", _jsxs("div", { className: "w3-bar w3-red  ", children: [_jsx("a", { href: "#", className: "w3-bar-item w3-button w3-small  ", children: _jsx("img", { src: "/src/assets/icon.png", className: " w3-inputv ", style: { maxHeight: "40px" } }) }), _jsx(MenuManager, {}), _jsx(BookSelect, {})] }), " "] }));
};
export default HeaderLine1;
