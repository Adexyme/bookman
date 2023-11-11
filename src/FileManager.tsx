import {
  fileOpen,
  directoryOpen,
  fileSave,
  supported,
} from "browser-fs-access";

import * as pdfjsLib from "pdfjs-dist";

import PageDisplayManager from "./PageDisplayManager";

import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

import IFProps from "./IFileManagerProp";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/src/pdfJSworker.js";

const FileManager = (props: IFProps) => {
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

  return (
    <>
      <a
        id="pick-file"
        className="w3-bar-item w3-button  w3-border-left "
        onClick={handleClick}
      >
        <i className="icofont-folder-open   w3-round "></i>
      </a>
      <a className="w3-bar-item w3-button  w3-border-right ">
        <i className="icofont-save    w3-round "></i>
      </a>
    </>
  );
};

export default FileManager;
