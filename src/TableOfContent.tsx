/* eslint-disable @typescript-eslint/no-explicit-any */
import { w3_close } from "./UtiLityFunctions";
//import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import PageDisplayManager from "./PageDisplayManager";
import { useEffect, useState } from "react";
interface Props {
  toggleState: boolean;
  updateCurrentPage: () => void;
}
const TableOfContent = (props: Props) => {
  const [tableOfContent, setTableOfContent] = useState<
    {
      title: string;
      bold: boolean;
      italic: boolean;
      color: Uint8ClampedArray;
      dest: string | any[] | null;
      url: string | null;
      unsafeUrl: string | undefined;
      newWindow: boolean | undefined;
      count: number | undefined;
      items: string[] | number[] | boolean[];
    }[]
  >([]);
  useEffect(() => {
    if (PageDisplayManager.currentPdf!)
      PageDisplayManager.currentPdf!.getOutline().then((outline) => {
        if (outline) setTableOfContent(outline);
      });
  }, [props.toggleState]);
  return (
    <>
      <div
        className="w3-sidebar w3-bar-block w3-collapse w3-card w3-border w3-border-black w3-white "
        style={{ width: "200px" }}
        id="mySidebar"
      >
        <button
          className="w3-bar-item w3-button w3-hide-large w3-black "
          onClick={() => w3_close()}
        >
          Close &times;
        </button>

        <div className="w3-bar-itemf w3-center w3-wide  w3-small w3-margin-top w3-margin-bottom ">
          <b>Content</b>
        </div>

        <div className="w3-margin-left w3-margin-right w3-margin-bottom ">
          {tableOfContent.map((value /*, index*/) => {
            return (
              <div
                key={value.title}
                className="w3-bar-item w3-button w3-border w3-small "
                onClick={() => {
                  PageDisplayManager.goToPage(value.dest![0].num);
                  props.updateCurrentPage();
                }}
              >
                {value.title}
              </div>
            );
          })}
          <div className="w3-text-white ">...</div>
          <div className="w3-text-white ">...</div>
          <div className="w3-text-white ">...</div>
          <div className="w3-text-white ">...</div>
          <div className="w3-text-white ">...</div>
        </div>
      </div>
    </>
  );
};

export default TableOfContent;
