import React, { useRef, useEffect, useState } from "react";
import Button from "./Button";
import TextInput from "./TextInput";

interface TypeSearchFilterProps {
  sell: boolean;
  rent: boolean;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<any>>;
  setRent: React.Dispatch<React.SetStateAction<boolean>>;
  setSell: React.Dispatch<React.SetStateAction<boolean>>;
}

const TypeSearchFilter: React.FC<TypeSearchFilterProps> = ({
  sell,
  rent,
  search,
  setSearch,
  setRent,
  setSell,
}) => {
  return (
    <div className="type-search-filter">
      <div className="type-filter">
        <Button color="success" disabled={!rent} onClick={() => setRent(!rent)}>
          {"رهن و اجاره"}
        </Button>
        <Button color="danger" disabled={!sell} onClick={() => setSell(!sell)}>
          {"فروش"}
        </Button>
      </div>
      <TextInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="منطقه مورد نظر را جستجو کنید..."
      />
    </div>
  );
};

export default TypeSearchFilter;
