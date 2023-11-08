import { PDFDocumentProxy } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";
import { AnnotationLayer } from "pdfjs-dist";

type pageAddr = { [key: string]: number };

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
  public static currentPage: number = 1;
  public static lastScrollPosition: number = 0;
  public static pageAddress: any = {};
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

  public static handleScroll = (
    scrollDirection: "u" | "d",
    displayStackAdjustmentFactor: number
  ) => {
    PageDisplayManager.adjustDisplayStack(
      displayStackAdjustmentFactor,
      PageDisplayManager.displayStackFirstPage,
      PageDisplayManager.displayStackLastPage,
      scrollDirection
    );
    if (scrollDirection === "d") {
      PageDisplayManager.displayStackFirstPage =
        PageDisplayManager.displayStackFirstPage - displayStackAdjustmentFactor;

      PageDisplayManager.displayStackLastPage =
        PageDisplayManager.displayStackLastPage - displayStackAdjustmentFactor;
    } else if (scrollDirection === "u") {
      PageDisplayManager.displayStackFirstPage =
        PageDisplayManager.displayStackFirstPage + displayStackAdjustmentFactor;

      PageDisplayManager.displayStackLastPage =
        PageDisplayManager.displayStackLastPage + displayStackAdjustmentFactor;
    }
  };
  public static goToPage = (pageRef: number) => {
    console.log("pageRef: " + pageRef);
    let page = PageDisplayManager.pageAddress["pa_" + pageRef];
    console.log("page: " + page);
    //console.log("Am In Page No" + PageDisplayManager.pageAddress["pa_" + page]);
    console.log(`${page} >= ${PageDisplayManager.displayStackFirstPage} &&
      ${page} <= ${PageDisplayManager.displayStackLastPage}`);
    if (!page) {
      console.log("page undefined");
      return;
    }
    if (
      /*if page is already in the displayStack*/
      PageDisplayManager.currentPdf!.numPages <=
        PageDisplayManager.displayStackLenght ||
      (page >= PageDisplayManager.displayStackFirstPage &&
        page <= PageDisplayManager.displayStackLastPage)
    ) {
      console.log("page1: " + page);
      //let page2Visit = PageDisplayManager.pageAddress["pa_" + page];
      location.assign("#id_" + page);
      PageDisplayManager.currentPage = page;
    } else if (page <= PageDisplayManager.displayStackFirstPage) {
      console.log("page2: " + page);
      const displayStackAdjustmentFactor =
        PageDisplayManager.displayStackFirstPage -
        page +
        (page - 1 < PageDisplayManager.displayStackAdjustmentNumber
          ? page - 1
          : PageDisplayManager.displayStackAdjustmentNumber);

      PageDisplayManager.handleScroll("d", displayStackAdjustmentFactor);
    } else if (page >= PageDisplayManager.displayStackLastPage) {
      console.log("page3: " + page);
      const displayStackAdjustmentFactor =
        page -
        PageDisplayManager.displayStackLastPage +
        (PageDisplayManager.currentPdf!.numPages - page <
        PageDisplayManager.displayStackAdjustmentNumber
          ? PageDisplayManager.currentPdf!.numPages - page
          : PageDisplayManager.displayStackAdjustmentNumber);

      PageDisplayManager.handleScroll("u", displayStackAdjustmentFactor);
    }
    //location.assign("#id_" + page);
  };
  public static createPageNoRefMap = (pdf: PDFDocumentProxy) => {
    for (let cnt = 1; cnt <= pdf.numPages; cnt++) {
      pdf.getPage(cnt).then((page) => {
        console.log("page-ref: " + JSON.stringify(page.ref));
        console.log("page-_pageIndex: " + page._pageIndex);
        console.log("page-_pageInfo: " + JSON.stringify(page._pageInfo));
        const varHolder = "pd" + page.ref!.num;

        if (PageDisplayManager.pageAddress)
          PageDisplayManager.pageAddress["pa_" + page.ref!.num] =
            page._pageIndex + 1;
        //console.log("page-ref: " + page.getAnnotations);
        //PageDisplayManager.currentPdf?.getOutline
        //PageDisplayManager.currentPdf?.getPageIndex(page.ref!);
      });
    }
    console.log(
      "pageAddress: " + JSON.stringify(PageDisplayManager.pageAddress)
    );
  };
  public static displayPages = (pdf: PDFDocumentProxy, pageNo: number) => {
    pdf
      .getPage(pageNo)
      .then((page) => {
        //page.render;

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
                  //const container = document.getElementById("your-container-id");
                  var viewportScale = viewport.scale;

                  textLayer.style.setProperty(
                    "--scale-factor",
                    "" + viewportScale
                  );
                }

                // Pass the data to the method for rendering of text over the pdf canvas.
                pdfjsLib.renderTextLayer({
                  textContent: textContent,
                  container: textLayer!,
                  viewport: viewport,
                  textDivs: [],
                });
              })
              .then(function () {
                // Returns a promise, on resolving it will return annotation data of page
                return page.getAnnotations();
              })
              .then(function (annotationData) {
                //console.log(JSON.stringify(annotationData));
              });
        }
      })
      .then();
  };
}

export default PageDisplayManager;
