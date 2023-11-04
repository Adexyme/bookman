import { PDFDocumentProxy } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";
class PageDisplayManager {
  public static currentPdf: PDFDocumentProxy | null = null;
  public static displayStackLenght: number = 101; //the number of pages displayed per time
  //the number corresponding to middle page for the first sets of pages displayed
  public static displayStackMiddlePage: number = Math.ceil(
    PageDisplayManager.displayStackLenght / 2
  );
  public static displayStackFirstPage: number = 1;
  public static displayStackLastPage: number =
    PageDisplayManager.displayStackLenght;
  public static displayStackAdjustmentNumber: number = 50;
  public static lastPage: number = 0;
  public static lastScrollPosition: number = 0;
  public static observerObject: IntersectionObserver;
  public static observedElem: HTMLCanvasElement = document.getElementById(
    "id_26"
  ) as HTMLCanvasElement;
  public static canvasContainer: HTMLElement = document.getElementById(
    "canvas_container"
  ) as HTMLElement;
  public static alterObservedElemStatus = (type: "enable" | "disable") => {
    if (
      (document.getElementById("canvas_container") as HTMLElement) === undefined
    ) {
      return;
    }
    const elemChildren = (
      document.getElementById("canvas_container") as HTMLElement
    ).children;
    const elemCnt = elemChildren.length;
    for (var cnt = 0; cnt < elemCnt; cnt++) {
      if (type === "enable") {
        PageDisplayManager.observerObject.observe(elemChildren[cnt]);
        console.log("enabled: " + cnt);
      } else if (type === "disable") {
        PageDisplayManager.observerObject.unobserve(elemChildren[cnt]);
        console.log("disabled: " + cnt);
      }
    }
  };

  public static loadConsecutivePages = (
    pageCount: number = PageDisplayManager.displayStackLenght,
    startPage: number = 1,
    page2Display: number = 1,
    callbackFN?: (status: boolean) => any
  ): any[] => {
    const elemArr: any[] = [];
    for (let n = 0; n < pageCount; n++) {
      elemArr[n] = n + 1;
    }
    return elemArr;
  };
  private static scrollDownPagesReAdjustment = (
    displayStackAdjustmentFactor: number,
    displayStack1stPage: number,
    displayStackLastPage: number
  ) => {
    for (let n = 0; n < displayStackAdjustmentFactor; n++) {
      const oldElem = document.getElementById(
        "id_" + (displayStackLastPage - n)
      );

      const newElem = document.createElement("canvas");
      newElem.innerHTML = `${displayStackLastPage - n}`;
      newElem.id = "id_" + (displayStackLastPage - n);
      oldElem?.replaceWith(newElem);

      PageDisplayManager.displayPages(
        PageDisplayManager.currentPdf!,
        displayStack1stPage - 1 - n
      );
    }
  };
  private static scrollUpPagesReAdjustment = (
    displayStackAdjustmentFactor: number,
    displayStack1stPage: number,
    displayStackLastPage: number
  ) => {
    for (let n = 0; n < displayStackAdjustmentFactor; n++) {
      const oldElem = document.getElementById(
        "id_" + (n + displayStack1stPage)
      );

      const newElem = document.createElement("canvas");
      newElem.innerHTML = `${n + displayStack1stPage}`;
      newElem.id = "id_" + (n + displayStack1stPage);
      oldElem?.replaceWith(newElem);

      PageDisplayManager.displayPages(
        PageDisplayManager.currentPdf!,
        displayStackLastPage + 1 + n
      );
    }
  };
  public static adjustDisplayStack = (
    displayStackAdjustmentFactor: number,
    displayStackStartPage: number,
    displayStackEndPage: number,
    scrollDirection: "u" | "d"
  ) => {
    if (scrollDirection === "u") {
      PageDisplayManager.scrollUpPagesReAdjustment(
        displayStackAdjustmentFactor,
        displayStackStartPage,
        displayStackEndPage
      );
    } else if (scrollDirection === "d") {
      PageDisplayManager.scrollDownPagesReAdjustment(
        displayStackAdjustmentFactor,
        displayStackStartPage,
        displayStackEndPage
      );
    }
  };
  public static displayPages = (pdf: PDFDocumentProxy, pageNo: number) => {
    pdf.getPage(pageNo).then((page) => {
      var outputScale = window.devicePixelRatio || 1;
      console.log("id: " + "id_" + pageNo);
      var canvas = document.getElementById("id_" + pageNo);
      if (canvas) {
        var ctx = (canvas as HTMLCanvasElement).getContext("2d");
        var viewport = page.getViewport({
          scale:
            document.getElementById("canvas_container")!.offsetWidth /
            page.getViewport({ scale: 1.0 }).width,
        });

        (canvas as HTMLCanvasElement).width = Math.floor(
          document.getElementById("canvas_container")!.offsetWidth * outputScale
        );

        (canvas as HTMLCanvasElement).height = Math.floor(
          ((document.getElementById("canvas_container")!.offsetWidth *
            viewport.height) /
            viewport.width) *
            outputScale
        );

        canvas.style.width =
          Math.floor(document.getElementById("canvas_container")!.offsetWidth) +
          "px";
        canvas.style.height =
          Math.floor(
            (document.getElementById("canvas_container")!.offsetWidth *
              viewport.height) /
              viewport.width
          ) + "px";

        var transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        if (ctx)
          page
            .render({
              canvasContext: ctx,
              transform: [outputScale, 0, 0, outputScale, 0, 0],
              viewport: viewport,
            })
            .promise.then(function () {
              return page.getTextContent();
            })
            .then(function (textContent) {
              // Assign CSS to the textLayer element
              var textLayer = document.getElementById("tl_" + pageNo);
              if (textLayer && canvas) {
                textLayer.style.left = canvas.offsetLeft + "px";
                textLayer.style.top = canvas.offsetTop + "px";
                textLayer.style.height = canvas.offsetHeight + "px";
                textLayer.style.width = canvas.offsetWidth + "px";
              }

              // Pass the data to the method for rendering of text over the pdf canvas.
              pdfjsLib.renderTextLayer({
                textContent: textContent,
                container: textLayer!,
                viewport: viewport,
                textDivs: [],
              });
            });
      }
    });
  };
}

export default PageDisplayManager;
