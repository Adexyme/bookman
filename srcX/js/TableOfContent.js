import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { w3_close } from "./UtiLityFunctions";
import PageDisplayManager from "./PageDisplayManager";
import { useEffect, useState } from "react";
const TableOfContent = (props) => {
    const [tableOfContent, setTableOfContent] = useState([]);
    useEffect(() => {
        PageDisplayManager.currentPdf.getOutline().then((outline) => {
            setTableOfContent(outline);
        });
    }, [props.toggleState]);
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "w3-sidebar w3-bar-block w3-collapse w3-card w3-border w3-border-black w3-white ", style: { width: "200px" }, id: "mySidebar", children: [_jsx("button", { className: "w3-bar-item w3-button w3-hide-large w3-black ", onClick: () => w3_close(), children: "Close \u00D7" }), _jsx("div", { className: "w3-bar-itemf w3-center w3-wide  w3-small w3-margin-top w3-margin-bottom ", children: _jsx("b", { children: "Content" }) }), _jsxs("div", { className: "w3-margin-left w3-margin-right w3-margin-bottom ", children: [tableOfContent.map((value, index) => {
                            return (_jsx("div", { className: "w3-bar-item w3-button w3-border w3-small ", onClick: () => {
                                    PageDisplayManager.goToPage(value.dest[0].num);
                                    props.updateCurrentPage();
                                }, children: value.title }, value.title));
                        }), _jsx("div", { className: "w3-text-white ", children: "..." }), _jsx("div", { className: "w3-text-white ", children: "..." }), _jsx("div", { className: "w3-text-white ", children: "..." }), _jsx("div", { className: "w3-text-white ", children: "..." }), _jsx("div", { className: "w3-text-white ", children: "..." })] })] }) }));
};
export default TableOfContent;
