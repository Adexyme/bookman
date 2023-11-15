import * as pdfjsLib from "pdfjs-dist";
import { useEffect /*, useState*/ } from "react";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import PageDisplayManager from "./PageDisplayManager";
import BookPage from "./BookPage";

interface Props {
  mode: "up" | "down" | "load" | null; //up:scrolling up, down: scrolling down, load: load new pdf
  pdfObj: PDFDocumentProxy | null;
  toggleState: boolean;
  pageCnt: number | undefined;
  updateCurrentPage: () => void;
  setPdfObj: (pdfObj: PDFDocumentProxy) => void;
}
pdfjsLib.GlobalWorkerOptions.workerSrc = "/src/pdfJSWorker.js";

const Body = ({
  mode,
  /*pdfObj,*/
  toggleState,
  pageCnt,
  updateCurrentPage,
  setPdfObj,
}: Props) => {
  /*var myState = {
    pdf: 1,

    currentPage: 1,

    zoom: 1,
  };*/

  /*const [pageCount, setPageCount] = useState(
    PageDisplayManager.displayStackLenght
  );*/

  let resizeDebounceTimer: number;
  function handleResize(/*event: Event*/) {
    window.clearTimeout(resizeDebounceTimer);
    resizeDebounceTimer = window.setTimeout(() => {
      PageDisplayManager.updateDisplayStack(true);
    }, 1500);
  }

  let scrollDebounceTimer: number;
  function handleScroll(/*event: Event*/) {
    PageDisplayManager.updateDisplayedPageNum(updateCurrentPage);
    window.clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = window.setTimeout(() => {
      PageDisplayManager.updateDisplayStack();
    }, 250);
  }

  function handleReceivefile(event: Event) {
    console.log("handleReceivefile: " + (event as CustomEvent).detail.file());

    ((event as CustomEvent).detail.file() as FileSystemFileHandle)
      .getFile()
      .then((file) => {
        if (file)
          console.log(
            "file details: " + file.name + "-" + file.type + "-" + file.size
          );
        if (file) initPDFProcessing(file);
      });
  }

  const initPDFProcessing = async (file: File) => {
    const pdf = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(pdf);
    await loadingTask.promise.then((pdf) => {
      PageDisplayManager.currentPdf = pdf;
      //setFileShareState(true);
      setPdfObj(pdf);
    });
  };
  //const [fileShareState, setFileShareState] = useState(false);

  useEffect(() => {
    window.addEventListener("receivefile", handleReceivefile);
    console.log("inside useeffect");
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === "load") {
      PageDisplayManager.clearTextLayer();
      PageDisplayManager.createPageNoRefMap(PageDisplayManager.currentPdf!);
      const totalPageToDisplay =
        PageDisplayManager.currentPdf!.numPages <=
        PageDisplayManager.displayStackLenght
          ? PageDisplayManager.currentPdf!.numPages
          : PageDisplayManager.displayStackLenght;
      for (let n = 0; n < totalPageToDisplay; n++) {
        PageDisplayManager.displayPages(PageDisplayManager.currentPdf!, n + 1);
      }

      window.addEventListener("resize", handleResize);

      if (
        PageDisplayManager.currentPdf!.numPages >
        PageDisplayManager.displayStackLenght
      ) {
        window.addEventListener("scroll", handleScroll);
      }
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      //setFileShareState(false);
      window.removeEventListener("resize", handleResize);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
