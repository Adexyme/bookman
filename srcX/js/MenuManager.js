import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { w3_open } from "./UtiLityFunctions";
const MenuManager = () => {
    return (_jsx(_Fragment, { children: _jsx("a", { className: "w3-bar-item w3-button w3-right w3-small ", children: _jsx("i", { className: "icofont-navigation-menu w3-input w3-border  w3-round  w3-black ", onClick: () => w3_open() }) }) }));
};
export default MenuManager;
