import { FC } from "react";
import Flickity from "react-flickity-component";
import Tooltip from "./Tooltip";

interface SliderProps {
  data: Array<any>;
}

const Slider: FC<SliderProps> = ({ data }): JSX.Element => {
  const flickityOptions = {
    initialIndex: 1,
  };

  return (
    <Flickity className="carousel" elementType="div" options={flickityOptions}>
      {data.map((item: any, index: number) => (
        <div style={{ padding: "0 15px" }}>
          <Tooltip item={item.properties} key={index} />
        </div>
      ))}
    </Flickity>
  );
};

export default Slider;
