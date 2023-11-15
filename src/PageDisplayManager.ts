import { PDFDocumentProxy } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";

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

  public static currentPage: number = 1;

  public static pageAddress: { [key: string]: number } = {};

  public static updateDisplayedPageNum = (updateCurrentPage: () => void) => {
    const pageCnt = PageDisplayManager.currentPdf!.numPages;
    for (let cnt = 1; cnt <= pageCnt; cnt++) {
      const pageElem = document.getElementById("pc_" + cnt);
      const pageElem_position = pageElem!.getBoundingClientRect();
      if (pageElem_position.top < window.innerHeight / 2) {
        PageDisplayManager.currentPage = cnt;
        updateCurrentPage(); //update the displayed current page number
      }
    }
  };

  public static clearTextLayer = () => {
    const pageCnt = PageDisplayManager.currentPdf!.numPages;
    for (let cnt = 1; cnt <= pageCnt; cnt++) {
      if (document.getElementById("tl_" + cnt)) {
        document.getElementById("tl_" + cnt)!.innerHTML = "";
      }
    }
  };

  public static updateDisplayStack = (
    mode?: boolean /*true means redisplay every page, even existing ones*/
  ) => {
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
      const pageCanvas = document.getElementById(
        "id_" + cnt
      ) as HTMLCanvasElement;

      if (
        cnt < PageDisplayManager.displayStackFirstPage ||
        cnt > PageDisplayManager.displayStackLastPage
      ) {
        if (mode === true && pageCanvas!.getAttribute("width")) {
          PageDisplayManager.displayPages(PageDisplayManager.currentPdf!, cnt);
        }
        pageCanvas!.innerHTML = "";
      } else {
        if (mode === true) {
          PageDisplayManager.displayPages(PageDisplayManager.currentPdf!, cnt);
        } else {
          if (!pageCanvas!.getAttribute("width")) {
            PageDisplayManager.displayPages(
              PageDisplayManager.currentPdf!,
              cnt
            );
          }
        }
      }
    }
  };

  public static loadConsecutivePages = (
    pageCount: number = PageDisplayManager.displayStackLenght
    /*startPage: number = 1,
    page2Display: number = 1,
    callbackFN?: (status: boolean) => any*/
  ): unknown[] => {
    const elemArr: unknown[] = [];
    for (let n = 0; n < pageCount; n++) {
      elemArr[n] = n + 1;
    }
    return elemArr;
  };

  public static goToPage = (pageRef: number) => {
    const page = PageDisplayManager.pageAddress["pa_" + pageRef];

    if (!page) {
      return;
    }
    if (
      PageDisplayManager.currentPdf!.numPages <=
        PageDisplayManager.displayStackLenght ||
      (page >= PageDisplayManager.displayStackFirstPage &&
        page <= PageDisplayManager.displayStackLastPage)
    ) {
      location.assign("#id_" + page);
      PageDisplayManager.currentPage = page;
    } else {
      PageDisplayManager.currentPage = page;
      PageDisplayManager.updateDisplayStack();
      location.assign("#id_" + page);
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
        const outputScale = window.devicePixelRatio || 1;

        const canvas = document.getElementById("id_" + pageNo);
        if (canvas) {
          const ctx = (canvas as HTMLCanvasElement).getContext("2d");
          const viewport = page.getViewport({
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

          /*const transform =
            outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;*/

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
                const textLayer = document.getElementById("tl_" + pageNo);

                if (textLayer && canvas) {
                  textLayer.style.left = canvas.offsetLeft + "px";
                  textLayer.style.top = canvas.offsetTop + "px";
                  textLayer.style.height = canvas.offsetHeight + "px";
                  textLayer.style.width = canvas.offsetWidth + "px";

                  const viewportScale = viewport.scale;

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
              .then(function (/* annotationData */) {
                //console.log(JSON.stringify(annotationData));
              });
        }
      })
      .then();
  };
}

export default PageDisplayManager;
