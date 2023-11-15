import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const PageNavigationManager = (prop) => {
    return (_jsx(_Fragment, { children: _jsxs("a", { className: "w3-bar-item w3-button w3-grey ", children: [_jsx("i", { className: "icofont-arrow-left   w3-round  w3-border " }), _jsx("input", { style: { maxWidth: "10vw" }, value: prop.currentPage }), _jsx("label", { className: "i w3-margin-rightX ", children: prop.pageCnt }), _jsx("i", { className: "icofont-arrow-right   w3-round  w3-border " })] }) }));
};
export default PageNavigationManager;
