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
        const obsElem = document.getElementById("id_26") as HTMLCanvasElement;
        const canvasContainer = document.getElementById(
          "canvas_container"
        ) as HTMLElement;

        console.log("No of Canvases: " + canvasContainer.children.length);
        PageDisplayManager.observedElem = obsElem;
        console.log("obsElem: " + obsElem.scrollTop);
        console.log("window.scrollY: " + window.scrollY);
        console.log("obsElem id: " + obsElem.id);

        // root element is default : screen
        var observer = new IntersectionObserver(
          function () {
            // callback code
            const canvasContainer = document.getElementById(
              "canvas_container"
            ) as HTMLElement;
            const nodesCount = canvasContainer.children.length;
            const firstNode = canvasContainer.children[0];
            const lastNode = canvasContainer.children[nodesCount - 1];
            //each canvas elem id is of the format  id_pagenumber, so we are extracting 1st/last page nos below
            const firstNodePageNum = parseInt(firstNode.id.split("_")[1]);
            const lastNodePageNum = parseInt(lastNode.id.split("_")[1]);
            console.log(
              "lastScrollPosition: " + PageDisplayManager.lastScrollPosition
            );
            //console.log("Scroling Up: " + window.scrollY);
            if (window.scrollY > PageDisplayManager.lastScrollPosition) {
              console.log("Scroling Up: " + window.scrollY);
              if (lastNodePageNum < PageDisplayManager.currentPdf!.numPages) {
                const canvas = document.createElement("canvas");
                canvas.id = `id_${lastNodePageNum + 1}`;
                canvasContainer.append(canvas);
                firstNode.remove();
                PageDisplayManager.displayPages(pdfObj!, lastNodePageNum + 1);
                observer.unobserve(PageDisplayManager.observedElem);
                const prevObsElem = PageDisplayManager.observedElem.id;
                PageDisplayManager.observedElem = document.getElementById(
                  "id_" + (parseInt(prevObsElem.split("_")[1]) + 1)
                ) as HTMLCanvasElement;

                observer.observe(PageDisplayManager.observedElem);
                //console.log("appendHTML: " + appendHTML);
              }
            } else if (window.scrollY < PageDisplayManager.lastScrollPosition) {
              console.log("Scroling Down: " + window.scrollY);
              if (firstNodePageNum > 1) {
                const prependHTML = `<canvas key="k_${
                  firstNodePageNum - 1
                }" id="id_${firstNodePageNum - 1}"></canvas>`;
                console.log("prependHTML: " + prependHTML);
              }
            }

            PageDisplayManager.lastScrollPosition = window.scrollY;
          },
          { threshold: [0.5] }
        );
        PageDisplayManager.observerObject = observer;
        //observer.observe(obsElem);
      }
    }

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
      } else if (window.scrollY > PageDisplayManager.lastScrollPosition || 0) {
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
              "displayStackLastPage: " + PageDisplayManager.displayStackLastPage
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

    //(document.getElementById("pick-fileX") as HTMLElement).onclick
    const code = async () => {
      const blob = await fileOpen({
        mimeTypes: ["application/pdf"],
      });
      console.log("blob : " + blob);
      console.log("blob: " + JSON.stringify(blob));
      const pdf = await blob.arrayBuffer();
      console.log("pdf: " + JSON.stringify(pdf));

      //const content = await file.text();
      //pdfjsLib.pdf;
      var loadingTask = pdfjsLib.getDocument(pdf);
      await loadingTask.promise.then((pdf) => {
        pdf.numPages;
        pdf.getPage(3).then((page) => {
          console.log("page._pageInfo: " + JSON.stringify(page._pageInfo));
          pdf.getOutline().then((retObj) => {
            console.log("pdf.getOutline: " + JSON.stringify(retObj));
          });

          pdf.getDestinations().then((dInfo) => {
            console.log("pdf.getDesination: " + JSON.stringify(dInfo));
          });
          var outputScale = window.devicePixelRatio || 1;

          var canvas = document.getElementById("pdf_renderer");
          console.log("clientWidth1: " + canvas?.style.width);
          if (canvas) {
            console.log("canvas no null");
            var ctx = (canvas as HTMLCanvasElement).getContext("2d");
            var viewport = page.getViewport({
              scale:
                document.getElementById("canvas_container")!.offsetWidth /
                page.getViewport({ scale: 1.0 }).width,
            });
            //var viewport = page.getViewport({ scale: 0.725 });

            //console.log("v.w:" + viewport.width);
            //console.log("v.w:" + viewport.width);
            console.log("window.devicePixelRatio: " + window.devicePixelRatio);
            (canvas as HTMLCanvasElement).width = Math.floor(
              document.getElementById("canvas_container")!.offsetWidth *
                outputScale
            );

            (canvas as HTMLCanvasElement).height = Math.floor(
              ((document.getElementById("canvas_container")!.offsetWidth *
                viewport.height) /
                viewport.width) *
                outputScale
            );

            canvas.style.width =
              Math.floor(
                document.getElementById("canvas_container")!.offsetWidth
              ) + "px";
            canvas.style.height =
              Math.floor(
                (document.getElementById("canvas_container")!.offsetWidth *
                  viewport.height) /
                  viewport.width
              ) + "px";

            var transform =
              outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

            if (ctx)
              page.render({
                canvasContext: ctx,
                transform: [outputScale, 0, 0, outputScale, 0, 0],
                viewport: viewport,
              });
            console.log(
              "clientWidth2: " +
                document.getElementById("canvas_container")?.offsetWidth
            );
          }
        });
      });
    };
  }, [toggleState]);
  //pdfjsLib.get
  return (
    <>
      <div
        id="my_pdf_viewer"
        className="w3-main "
        style={{ marginLeft: "200px" }}
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
          }}
        >
          {PageDisplayManager.loadConsecutivePages(
            pageCnt || PageDisplayManager.displayStackLenght
          ).map((value, index) => {
            return (
              <canvas key={"k_" + value} id={"id_" + value}>
                {value}
                {toggleState}
              </canvas>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Body;
