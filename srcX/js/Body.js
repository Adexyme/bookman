import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useState } from "react";
import PageDisplayManager from "./PageDisplayManager";
import BookPage from "./BookPage";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/src/pdfJSWorker.js";
const Body = ({ mode, pdfObj, toggleState, pageCnt, updateCurrentPage, }) => {
    var myState = {
        pdf: 1,
        currentPage: 1,
        zoom: 1,
    };
    const [pageCount, setPageCount] = useState(PageDisplayManager.displayStackLenght);
    let resizeDebounceTimer;
    function handleResize(event) {
        window.clearTimeout(resizeDebounceTimer);
        resizeDebounceTimer = window.setTimeout(() => {
            PageDisplayManager.updateDisplayStack(true);
        }, 1500);
    }
    let scrollDebounceTimer;
    function handleScroll(event) {
        PageDisplayManager.updateDisplayedPageNum(updateCurrentPage);
        window.clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = window.setTimeout(() => {
            PageDisplayManager.updateDisplayStack();
        }, 250);
    }
    useEffect(() => {
        if (mode === "load") {
            PageDisplayManager.clearTextLayer();
            PageDisplayManager.createPageNoRefMap(pdfObj);
            const totalPageToDisplay = pdfObj.numPages <= PageDisplayManager.displayStackLenght
                ? pdfObj.numPages
                : PageDisplayManager.displayStackLenght;
            for (var n = 0; n < totalPageToDisplay; n++) {
                PageDisplayManager.displayPages(pdfObj, n + 1);
            }
            window.addEventListener("resize", handleResize);
            if (pdfObj.numPages > PageDisplayManager.displayStackLenght) {
                window.addEventListener("scroll", handleScroll);
            }
        }
        return () => window.removeEventListener("scroll", handleScroll);
    }, [toggleState]);
    //pdfjsLib.get
    return (_jsx(_Fragment, { children: _jsx("div", { id: "my_pdf_viewer", className: "w3-main ", style: { marginLeft: "200px", position: "relative" }, children: _jsx("div", { id: "canvas_container", className: " ", style: {
                    width: "100%",
                    overflow: "auto",
                    background: "#333",
                    textAlign: "center",
                    border: "solid 3px",
                    position: "relative",
                }, children: PageDisplayManager.loadConsecutivePages(pageCnt || PageDisplayManager.displayStackLenght).map((value, index) => {
                    return (_jsx(BookPage, { value: value, index: index, toggleState: toggleState }));
                }) }) }) }));
};
export default Body;
