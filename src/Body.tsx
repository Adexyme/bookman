import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useLayoutEffect, useState } from "react";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import PageDisplayManager from "./PageDisplayManager";
import BookPage from "./BookPage";

interface Props {
  mode: "up" | "down" | "load" | null; //up:scrolling up, down: scrolling down, load: load new pdf
  pdfObj: PDFDocumentProxy | null;
  toggleState: boolean;
  pageCnt: number | undefined;
  updateCurrentPage: () => void;
}
pdfjsLib.GlobalWorkerOptions.workerSrc = "/src/pdf.worker.2.11.338.js";

const Body = ({
  mode,
  pdfObj,
  toggleState,
  pageCnt,
  updateCurrentPage,
}: Props) => {
  var myState = {
    pdf: 1,

    currentPage: 1,

    zoom: 1,
  };

  const [pageCount, setPageCount] = useState(
    PageDisplayManager.displayStackLenght
  );
  let debounceTimer: number;
  function handleScroll(event: Event) {
    PageDisplayManager.updateDisplayedPageNum(updateCurrentPage);
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      PageDisplayManager.updateDisplayStack();
    }, 250);
  }
  useEffect(() => {
    if (mode === "load") {
      PageDisplayManager.createPageNoRefMap(pdfObj!);
      const totalPageToDisplay =
        pdfObj!.numPages <= PageDisplayManager.displayStackLenght
          ? pdfObj!.numPages
          : PageDisplayManager.displayStackLenght;
      for (var n = 0; n < totalPageToDisplay; n++) {
        PageDisplayManager.displayPages(pdfObj!, n + 1);
      }

      if (pdfObj!.numPages > PageDisplayManager.displayStackLenght) {
        window.addEventListener("scroll", handleScroll);
      }
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toggleState]);

  //pdfjsLib.get
  return (
    <>
      <div
        id="my_pdf_viewer"
        className="w3-main "
        style={{ marginLeft: "200px", position: "relative" }}
      >
        <div
          id="canvas_container"
          className=" "
          style={{
            width: "100%",

            overflow: "auto",
            background: "#333",
            textAlign: "center",
            border: "solid 3px",
            position: "relative",
          }}
        >
          {PageDisplayManager.loadConsecutivePages(
            pageCnt || PageDisplayManager.displayStackLenght
          ).map((value, index) => {
            return (
              <BookPage value={value} index={index} toggleState={toggleState} />
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Body;
