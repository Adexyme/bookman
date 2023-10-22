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
}
pdfjsLib.GlobalWorkerOptions.workerSrc = "/src/pdfJSworker.js";

const Body = ({ mode, pdfObj, toggleState }: Props) => {
  var myState = {
    pdf: 1,

    currentPage: 1,

    zoom: 1,
  };

  useEffect(() => {
    console.log("inside useEffect");
    console.log("mode: " + mode);
    if (mode === "load") {
      console.log("mode === load");
      for (var n = 0; n < PageDisplayManager.pageCnt; n++)
        //console.log("n :" + n);
        PageDisplayManager.displayPages(pdfObj!, n + 1);
    }
    let fileHandle;

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
          {PageDisplayManager.loadConsecutivePages().map((value, index) => {
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
