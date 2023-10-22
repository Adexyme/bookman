import { PDFDocumentProxy } from "pdfjs-dist";
class PageDisplayManager {
  public static currentPdf: PDFDocumentProxy | null = null;
  public static pageCnt: number = 15;
  public static loadConsecutivePages = (
    pageCnt: number = 15,
    startPage: number = 1,
    page2Display: number = 1,
    callbackFN?: (status: boolean) => any
  ): any[] => {
    const elemArr: any[] = [];
    for (let n = 0; n < pageCnt; n++) {
      elemArr[n] = n + 1;
    }
    return elemArr;
  };
  public static scrollDownPagesReAdjustment = () => {};
  public static scrollUpPagesReAdjustment = () => {};
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
          page.render({
            canvasContext: ctx,
            transform: [outputScale, 0, 0, outputScale, 0, 0],
            viewport: viewport,
          });
      }
    });
  };
}

export default PageDisplayManager;
