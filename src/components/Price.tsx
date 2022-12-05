import Slider from "rc-slider";
import HeaderBox from "./HeaderBox";

interface PriceProps {
  range: Array<number>;
  setRange: any;
}

const Price: React.FC<PriceProps> = ({ range, setRange }) => {
  const numberWithCommas = (x: any) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div className="price-card">
      <HeaderBox title="قیمت" />
      <div className="range-conatiner">
        <div className="range-slider">
          <Slider
            className="slider-input"
            range
            step={5000000}
            allowCross={false}
            value={range}
            defaultValue={[0, 50]}
            onChange={setRange}
            reverse
            max={10000000000}
          />
        </div>
        <div className="price-value">
          <div>{numberWithCommas(range[0])}</div>
          <div>{numberWithCommas(range[1])}</div>
        </div>
      </div>
    </div>
  );
};

export default Price;
