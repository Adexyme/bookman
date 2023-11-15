import * as pdfjsLib from "pdfjs-dist";
class PageDisplayManager {
    static currentPdf = null;
    static displayStackLenght = 5; //the number of pages displayed per time
    //the number corresponding to middle page for the first sets of pages displayed
    static displayStackMiddlePage = Math.ceil(PageDisplayManager.displayStackLenght / 2);
    static displayStackFirstPage = 1;
    static displayStackLastPage = PageDisplayManager.displayStackLenght;
    static displayStackAdjustmentNumber = Math.floor(PageDisplayManager.displayStackLenght / 2);
    //public static lastPage: number = 0;
    static currentPage = 1;
    //public static lastScrollPosition: number = 0;
    static pageAddress = {};
    //public static observerObject: IntersectionObserver;
    /*public static observedElem: HTMLCanvasElement = document.getElementById(
      "id_26"
    ) as HTMLCanvasElement;
    public static canvasContainer: HTMLElement = document.getElementById(
      "canvas_container"
    ) as HTMLElement;*/
    static updateDisplayedPageNum = (updateCurrentPage) => {
        const pageCnt = PageDisplayManager.currentPdf.numPages;
        for (let cnt = 1; cnt <= pageCnt; cnt++) {
            let pageElem = document.getElementById("pc_" + cnt);
            let pageElem_position = pageElem.getBoundingClientRect();
            if (pageElem_position.top < window.innerHeight / 2) {
                PageDisplayManager.currentPage = cnt;
                updateCurrentPage(); //update the displayed current page
            }
        }
    };
    static clearTextLayer = () => {
        const pageCnt = PageDisplayManager.currentPdf.numPages;
        for (let cnt = 1; cnt <= pageCnt; cnt++) {
            document.getElementById("tl_" + cnt).innerHTML = "";
        }
    };
    static updateDisplayStack = (mode /*true means redisplay every page, even existing ones*/) => {
        const pageCnt = PageDisplayManager.currentPdf.numPages;
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
                ? PageDisplayManager.currentPdf.numPages
                : PageDisplayManager.currentPage +
                    PageDisplayManager.displayStackAdjustmentNumber;
        for (let cnt = 1; cnt <= pageCnt; cnt++) {
            //let pageContainer = document.getElementById("pc_" + cnt);
            let pageCanvas = document.getElementById("id_" + cnt);
            //let pageTxtLayer = document.getElementById("tl_" + cnt);
            if (cnt < PageDisplayManager.displayStackFirstPage ||
                cnt > PageDisplayManager.displayStackLastPage) {
                if (mode === true && pageCanvas.getAttribute("width")) {
                    PageDisplayManager.displayPages(PageDisplayManager.currentPdf, cnt);
                }
                pageCanvas.innerHTML = "";
            }
            else {
                if (mode === true) {
                    PageDisplayManager.displayPages(PageDisplayManager.currentPdf, cnt);
                }
                else {
                    if (!pageCanvas.getAttribute("width")) {
                        PageDisplayManager.displayPages(PageDisplayManager.currentPdf, cnt);
                    }
                }
            }
        }
    };
    static loadConsecutivePages = (pageCount = PageDisplayManager.displayStackLenght, startPage = 1, page2Display = 1, callbackFN) => {
        const elemArr = [];
        for (let n = 0; n < pageCount; n++) {
            elemArr[n] = n + 1;
        }
        return elemArr;
    };
    static goToPage = (pageRef) => {
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
        PageDisplayManager.currentPdf.numPages <=
            PageDisplayManager.displayStackLenght ||
            (page >= PageDisplayManager.displayStackFirstPage &&
                page <= PageDisplayManager.displayStackLastPage)) {
            //console.log("page1: " + page);
            //let page2Visit = PageDisplayManager.pageAddress["pa_" + page];
            location.assign("#id_" + page);
            PageDisplayManager.currentPage = page;
        }
        else {
            PageDisplayManager.currentPage = page;
            PageDisplayManager.updateDisplayStack();
            location.assign("#id_" + page);
        }
    };
    static createPageNoRefMap = (pdf) => {
        for (let cnt = 1; cnt <= pdf.numPages; cnt++) {
            pdf.getPage(cnt).then((page) => {
                if (PageDisplayManager.pageAddress)
                    PageDisplayManager.pageAddress["pa_" + page.ref.num] =
                        page._pageIndex + 1;
            });
        }
    };
    static displayPages = (pdf, pageNo) => {
        pdf
            .getPage(pageNo)
            .then((page) => {
            //page.render;
            var outputScale = window.devicePixelRatio || 1;
            //console.log("id: " + "id_" + pageNo);
            var canvas = document.getElementById("id_" + pageNo);
            if (canvas) {
                var ctx = canvas.getContext("2d");
                var viewport = page.getViewport({
                    scale: document.getElementById("canvas_container").offsetWidth /
                        page.getViewport({ scale: 1.0 }).width,
                });
                canvas.width = Math.floor(document.getElementById("canvas_container").offsetWidth *
                    outputScale);
                canvas.height = Math.floor(((document.getElementById("canvas_container").offsetWidth *
                    viewport.height) /
                    viewport.width) *
                    outputScale);
                canvas.style.width =
                    Math.floor(document.getElementById("canvas_container").offsetWidth) + "px";
                canvas.style.height =
                    Math.floor((document.getElementById("canvas_container").offsetWidth *
                        viewport.height) /
                        viewport.width) + "px";
                var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
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
                            textLayer.style.setProperty("--scale-factor", "" + viewportScale);
                        }
                        // Pass the data to the method for rendering of text over the pdf canvas.
                        pdfjsLib.renderTextLayer({
                            textContent: textContent,
                            container: textLayer,
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
