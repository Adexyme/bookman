const BookSelect = () => {
  return (
    <>
      <a className="w3-bar-item w3-button  w3-right w3-small ">
        <select className="w3-input w3-round " style={{ width: "50vw" }}>
          <option value="Book1.pdf" selected>
            Book1.pdf
          </option>
          <option value="Book2.pdf">Book2.pdf</option>
          <option value="Book3.pdf">Book3.pdf</option>
          <option value="Book4.pdf">Book4.pdf</option>
        </select>
      </a>
    </>
  );
};
export default BookSelect;
