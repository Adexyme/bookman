import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { fileOpen, } from "browser-fs-access";
import * as pdfjsLib from "pdfjs-dist";
import PageDisplayManager from "./PageDisplayManager";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/src/pdfJSworker.js";
const FileManager = (props) => {
    //console.log("setPdfObj1: " + props.setPdfObj);
    const handleClick = async () => {
        //console.log("handleClick");
        //console.log("setPdfObj: " + props.setPdfObj);
        const blob = await fileOpen({
            mimeTypes: ["application/pdf"],
        });
        //console.log("handleClick1");
        const pdf = await blob.arrayBuffer();
        var loadingTask = pdfjsLib.getDocument(pdf);
        await loadingTask.promise.then((pdf) => {
            PageDisplayManager.currentPdf = pdf;
            props.setPdfObj(pdf);
        });
        //console.log("handleClick2");
    };
    return (_jsxs(_Fragment, { children: [_jsx("a", { id: "pick-file", className: "w3-bar-item w3-button  w3-border-left ", onClick: handleClick, children: _jsx("i", { className: "icofont-folder-open   w3-round " }) }), _jsx("a", { className: "w3-bar-item w3-button  w3-border-right ", children: _jsx("i", { className: "icofont-save    w3-round " }) })] }));
};
export default FileManager;
