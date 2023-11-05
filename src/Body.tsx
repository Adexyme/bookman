import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useState } from "react";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import PageDisplayManager from "./PageDisplayManager";

import {
  fileOpen,
  directoryOpen,
  fileSave,
  supported,
} from "browser-fs-access";

interface Props {
  mode: "up" | "down" | "load" | null; //up:scrolling up, down: scrolling down, load: load new pdf
  pdfObj: PDFDocumentProxy | null;
  toggleState: boolean;
  pageCnt: number | undefined;
}
pdfjsLib.GlobalWorkerOptions.workerSrc = "/src/pdfJSworker.js";

const Body = ({ mode, pdfObj, toggleState, pageCnt }: Props) => {
  var myState = {
    pdf: 1,

    currentPage: 1,

    zoom: 1,
  };
  const [pageCount, setPageCount] = useState(
    PageDisplayManager.displayStackLenght
  );
  useEffect(() => {
    console.log("inside useEffect");
    console.log("mode: " + mode);
    if (mode === "load") {
      console.log("mode === load");
      const tPage =
        pdfObj!.numPages <= PageDisplayManager.displayStackLenght
          ? pdfObj!.numPages
          : PageDisplayManager.displayStackLenght;
      for (var n = 0; n < tPage; n++) {
        //console.log("n :" + n);
        PageDisplayManager.displayPages(pdfObj!, n + 1);
      }
      if (pdfObj!.numPages > PageDisplayManager.displayStackLenght) {
        window.addEventListener("scroll", function handleScroll(event) {
          const displayStackFirstPageElem = document.getElementById(
            "id_" + PageDisplayManager.displayStackFirstPage
          );

          const displayStackLastPageElem = document.getElementById(
            "id_" + PageDisplayManager.displayStackLastPage
          );

          const displayStackFirstPageElem_position =
            displayStackFirstPageElem!.getBoundingClientRect();
          const displayStackLastPageElem_position =
            displayStackLastPageElem!.getBoundingClientRect();

          if (
            !PageDisplayManager.currentPdf ||
            !PageDisplayManager.currentPdf.numPages
          ) {
            console.log(
              "!PageDisplayManager.currentPdf ||!PageDisplayManager.currentPdf.numPages"
            );
            return;
          }

          if (window.scrollY < PageDisplayManager.lastScrollPosition) {
            console.log("scrolling down");
            if (
              displayStackFirstPageElem_position.top >= -200 &&
              displayStackFirstPageElem_position.top <= 200
            ) {
              // fully visible
              console.log("Element Visible - down");

              if (
                /*come here only if we have not yet scrolled to the first page  */
                PageDisplayManager.displayStackFirstPage > 1
              ) {
                //do something
                console.log("down2");
                console.log(
                  "displayStackFirstPage: " +
                    PageDisplayManager.displayStackFirstPage
                );
                const displayStackAdjustmentFactor =
                  PageDisplayManager.displayStackFirstPage - 1 <
                  PageDisplayManager.displayStackAdjustmentNumber
                    ? PageDisplayManager.displayStackFirstPage - 1
                    : PageDisplayManager.displayStackAdjustmentNumber;

                PageDisplayManager.adjustDisplayStack(
                  displayStackAdjustmentFactor,
                  PageDisplayManager.displayStackFirstPage,
                  PageDisplayManager.displayStackLastPage,
                  "d"
                );

                PageDisplayManager.displayStackFirstPage =
                  PageDisplayManager.displayStackFirstPage -
                  displayStackAdjustmentFactor;

                PageDisplayManager.displayStackLastPage =
                  PageDisplayManager.displayStackLastPage -
                  displayStackAdjustmentFactor;
              }
            }
          } else if (
            window.scrollY > PageDisplayManager.lastScrollPosition ||
            0
          ) {
            console.log("scrolling up");
            if (
              displayStackLastPageElem_position.top >= -200 &&
              displayStackLastPageElem_position.top <= 200
            ) {
              // fully visible
              console.log("Element Visible - up");

              if (
                /*come here only if we have not yet scrolled to the last page  */
                PageDisplayManager.displayStackLastPage <
                PageDisplayManager.currentPdf.numPages
              ) {
                //do something
                console.log("up2");
                console.log(
                  "displayStackLastPage: " +
                    PageDisplayManager.displayStackLastPage
                );
                const displayStackAdjustmentFactor =
                  PageDisplayManager.currentPdf.numPages -
                    PageDisplayManager.displayStackLastPage <
                  PageDisplayManager.displayStackAdjustmentNumber
                    ? PageDisplayManager.currentPdf.numPages -
                      PageDisplayManager.displayStackLastPage
                    : PageDisplayManager.displayStackAdjustmentNumber;

                PageDisplayManager.adjustDisplayStack(
                  displayStackAdjustmentFactor,
                  PageDisplayManager.displayStackFirstPage,
                  PageDisplayManager.displayStackLastPage,
                  "u"
                );

                PageDisplayManager.displayStackFirstPage =
                  PageDisplayManager.displayStackFirstPage +
                  displayStackAdjustmentFactor;

                PageDisplayManager.displayStackLastPage =
                  PageDisplayManager.displayStackLastPage +
                  displayStackAdjustmentFactor;
              }
            }
          }
          PageDisplayManager.lastScrollPosition = window.scrollY;
        });
      }
    }
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
              <>
                <div className="pageContainer ">
                  <canvas key={"k_" + value} id={"id_" + value}>
                    {value}
                    {toggleState}
                  </canvas>
                  <div key={"ktl_" + value} id={"tl_" + value}></div>
                  <div key={"kal_" + value} id={"al_" + value}></div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Body;
