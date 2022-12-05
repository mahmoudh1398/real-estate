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
    <Flickity
      className={"carousel"}
      elementType={"div"}
      options={flickityOptions}
    >
      {data.map((item: any, index: number) => (
        <Tooltip item={item.properties} key={index} />
      ))}
    </Flickity>
  );
};

export default Slider;
