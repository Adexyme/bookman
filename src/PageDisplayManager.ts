import { PDFDocumentProxy } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";

type pageAddr = { [key: string]: number };

class PageDisplayManager {
  public static currentPdf: PDFDocumentProxy | null = null;
  public static displayStackLenght: number = 5; //the number of pages displayed per time
  //the number corresponding to middle page for the first sets of pages displayed
  public static displayStackMiddlePage: number = Math.ceil(
    PageDisplayManager.displayStackLenght / 2
  );
  public static displayStackFirstPage: number = 1;
  public static displayStackLastPage: number =
    PageDisplayManager.displayStackLenght;
  public static displayStackAdjustmentNumber: number = Math.floor(
    PageDisplayManager.displayStackLenght / 2
  );
  //public static lastPage: number = 0;
  public static currentPage: number = 1;
  //public static lastScrollPosition: number = 0;
  public static pageAddress: any = {};
  //public static observerObject: IntersectionObserver;
  /*public static observedElem: HTMLCanvasElement = document.getElementById(
    "id_26"
  ) as HTMLCanvasElement;
  public static canvasContainer: HTMLElement = document.getElementById(
    "canvas_container"
  ) as HTMLElement;*/

  public static updateDisplayedPageNum = (updateCurrentPage: () => void) => {
    const pageCnt = PageDisplayManager.currentPdf!.numPages;
    for (let cnt = 1; cnt <= pageCnt; cnt++) {
      let pageElem = document.getElementById("pc_" + cnt);
      let pageElem_position = pageElem!.getBoundingClientRect();
      if (pageElem_position.top < window.innerHeight / 2) {
        PageDisplayManager.currentPage = cnt;
        updateCurrentPage(); //update the displayed current page
      }
    }
  };

  public static clearTextLayer = () => {
    const pageCnt = PageDisplayManager.currentPdf!.numPages;
    for (let cnt = 1; cnt <= pageCnt; cnt++) {
      document.getElementById("tl_" + cnt)!.innerHTML = "";
    }
  };

  public static updateDisplayStack = () => {
    const pageCnt = PageDisplayManager.currentPdf!.numPages;

    PageDisplayManager.displayStackFirstPage =
      PageDisplayManager.currentPage -
        PageDisplayManager.displayStackAdjustmentNumber <=
      0
        ? 1
        : PageDisplayManager.currentPage -
          PageDisplayManager.displayStackAdjustmentNumber;

    PageDisplayManager.displayStackLastPage =
      PageDisplayManager.currentPage +
        PageDisplayManager.displayStackAdjustmentNumber >
      pageCnt
        ? PageDisplayManager.currentPdf!.numPages
        : PageDisplayManager.currentPage +
          PageDisplayManager.displayStackAdjustmentNumber;

    for (let cnt = 1; cnt <= pageCnt; cnt++) {
      //let pageContainer = document.getElementById("pc_" + cnt);
      let pageCanvas = document.getElementById("id_" + cnt);
      //let pageTxtLayer = document.getElementById("tl_" + cnt);
      if (
        cnt < PageDisplayManager.displayStackFirstPage ||
        cnt > PageDisplayManager.displayStackLastPage
      ) {
        pageCanvas!.innerHTML = "";
        //pageTxtLayer!.innerHTML = ""; //update the displayed current page
      } else {
        if (!pageCanvas!.getAttribute("width")) {
          PageDisplayManager.displayPages(PageDisplayManager.currentPdf!, cnt);
        }
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

  public static goToPage = (pageRef: number) => {
    //console.log("pageRef: " + pageRef);
    let page = PageDisplayManager.pageAddress["pa_" + pageRef];
    //console.log("page: " + page);
    //console.log("Am In Page No" + PageDisplayManager.pageAddress["pa_" + page]);

    if (!page) {
      //console.log("page undefined");
      return;
    }
    if (
      /*if page is already in the displayStack*/
      PageDisplayManager.currentPdf!.numPages <=
        PageDisplayManager.displayStackLenght ||
      (page >= PageDisplayManager.displayStackFirstPage &&
        page <= PageDisplayManager.displayStackLastPage)
    ) {
      //console.log("page1: " + page);
      //let page2Visit = PageDisplayManager.pageAddress["pa_" + page];
      location.assign("#id_" + page);
      PageDisplayManager.currentPage = page;
    }
  };
  public static createPageNoRefMap = (pdf: PDFDocumentProxy) => {
    for (let cnt = 1; cnt <= pdf.numPages; cnt++) {
      pdf.getPage(cnt).then((page) => {
        if (PageDisplayManager.pageAddress)
          PageDisplayManager.pageAddress["pa_" + page.ref!.num] =
            page._pageIndex + 1;
      });
    }
  };
  public static displayPages = (pdf: PDFDocumentProxy, pageNo: number) => {
    pdf
      .getPage(pageNo)
      .then((page) => {
        //page.render;

        var outputScale = window.devicePixelRatio || 1;
        //console.log("id: " + "id_" + pageNo);
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
