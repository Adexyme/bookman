interface Props {
  pageCnt: number | undefined;
  currentPage: number;
}

const PageNavigationManager = (prop: Props) => {
  return (
    <>
      <a className="w3-bar-item w3-button w3-grey ">
        <i className="icofont-arrow-left   w3-round  w3-border "></i>
        <input style={{ maxWidth: "10vw" }} value={prop.currentPage} />
        <label className="i w3-margin-rightX ">{prop.pageCnt}</label>
        <i className="icofont-arrow-right   w3-round  w3-border "></i>
      </a>
    </>
  );
};

export default PageNavigationManager;
