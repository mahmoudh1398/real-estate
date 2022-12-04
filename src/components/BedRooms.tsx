import HeaderBox from "./HeaderBox";

interface BedRoomsProps {
  bedRooms: Array<number>;
  setBedRooms: React.Dispatch<React.SetStateAction<Array<number>>>;
}

const BedRooms: React.FC<BedRoomsProps> = ({ bedRooms, setBedRooms }) => {
  const handleChangeBedRoomsCount = (count: any) => {
    setBedRooms(
      bedRooms.includes(count)
        ? bedRooms.filter((item) => item !== count)
        : [...bedRooms, count]
    );
  };

  return (
    <div className="bedRooms">
      <HeaderBox title="تعداد اتاق خواب" />
      <div className="bedrooms-container">
        <div className="bedrooms-items-container">
          {Array(4)
            .fill(1)
            .map((item, index) => (
              <div
                key={index}
                className={`bedroom-item ${
                  bedRooms.includes(index + 1) ? "active" : ""
                }`}
                onClick={() => handleChangeBedRoomsCount(index + 1)}
              >
                {index + 1}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BedRooms;
