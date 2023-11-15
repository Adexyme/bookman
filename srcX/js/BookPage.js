import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
const BookPage = ({ value, index, toggleState }) => {
    return (_jsxs("div", { id: "pc_" + value, className: "pageContainer ", style: { width: "1oo%" }, onLoad: () => console.log("pc_" + value), children: [_jsxs("canvas", { id: "id_" + value, style: { width: "1oo%" }, children: [value, toggleState] }, "k_" + value), _jsx("div", { id: "tl_" + value, style: { width: "1oo%" }, children: toggleState }, "ktl_" + value), _jsx("div", { id: "al_" + value, className: "w3-hide ", style: { width: "1oo%" }, children: toggleState }, "kal_" + value)] }, "kpc_" + value));
};
export default BookPage;
