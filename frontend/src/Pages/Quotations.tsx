import { IoFilter } from "react-icons/io5";

import { useState } from "react";

import QuotationFilter from "../components/QuotationFilter";

function Quotations() {
  const [showFillter, setShowFillters] = useState<boolean>(true);

  return (
    <div className="p-4 w-full">
      <p className="text-white text-3xl font-medium">My Quotation</p>
      <div className="text-white flex items-center justify-between w-full text-2xl">
        <p>fillter</p>
        <span onClick={() => setShowFillters(!showFillter)}>
          {" "}
          <IoFilter />
        </span>
      </div>
      <QuotationFilter showFillter={showFillter} />
    </div>
  );
}

export default Quotations;



