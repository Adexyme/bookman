import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import TableOfContent from "./TableOfContent";
import PageDisplayManager from "./PageDisplayManager";
import HeaderLine1 from "./HeaderLine1";
import HeaderLine2 from "./HeaderLine2";
import FileManager from "./FileManager";
import RotationManager from "./RotationManager";
import DisplayTypeManager from "./DisplayTypeManager";
import PageNavigationManager from "./PageNavigationManager";
import SearchManager from "./SearchManager";
import ZoomManager from "./ZoomManager";
function App() {
    const [pageMode, setPageMode] = useState(null);
    const [pdfObj, setPdfObj] = useState(PageDisplayManager.currentPdf);
    const [toggleState, setToggleState] = useState(true);
    const [currentPage, setCurrentPage] = useState(PageDisplayManager.currentPage);
    const updatePdfObj = (pdfObj) => {
        setPdfObj(pdfObj);
        setPageMode("load");
        setToggleState(!toggleState);
    };
    const updateCurrentPage = () => {
        setCurrentPage(PageDisplayManager.currentPage);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Header, { children: [_jsx(HeaderLine1, {}), _jsxs(HeaderLine2, { children: [_jsx(FileManager, { setPdfObj: updatePdfObj }), _jsx(RotationManager, {}), _jsx(DisplayTypeManager, {}), _jsx(ZoomManager, {}), _jsx(PageNavigationManager, { pageCnt: pdfObj?.numPages, currentPage: currentPage }), _jsx(SearchManager, {})] })] }), _jsx(TableOfContent, { toggleState: toggleState, updateCurrentPage: () => updateCurrentPage() }), _jsx(Body, { mode: pageMode, pdfObj: pdfObj, toggleState: toggleState, pageCnt: pdfObj?.numPages, updateCurrentPage: updateCurrentPage }), _jsx(Footer, {})] }));
}
export default App;
