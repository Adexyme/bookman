import { useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import TableOfContent from "./TableOfContent";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
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
  const [pageMode, setPageMode] = useState<"up" | "down" | "load" | null>(null);
  const [pdfObj, setPdfObj] = useState(PageDisplayManager.currentPdf);
  const [toggleState, setToggleState] = useState(true);

  const updatePdfObj = (pdfObj: PDFDocumentProxy) => {
    console.log("inside updatePdfObj1");
    setPdfObj(pdfObj);
    setPageMode("load");
    setToggleState(!toggleState);
    console.log("pageMode :" + pageMode);
    console.log("inside updatePdfObj2");
  };
  return (
    <>
      <Header>
        <HeaderLine1 />
        <HeaderLine2>
          <FileManager setPdfObj={updatePdfObj} />
          <RotationManager />
          <DisplayTypeManager />
          <ZoomManager />
          <PageNavigationManager />
          <SearchManager />
        </HeaderLine2>
      </Header>
      <TableOfContent />
      <Body mode={pageMode} pdfObj={pdfObj} toggleState={toggleState} />
      <Footer />
    </>
  );
}

export default App;
