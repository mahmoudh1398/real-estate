import { FC } from "react";
import Flickity from "react-flickity-component";
import wallpaper from "../assets/img/wallpaper.png";

interface SliderProps {}

const Slider: FC<SliderProps> = (): JSX.Element => {
  const flickityOptions = {
    initialIndex: 2,
  };

  return (
    <Flickity
      className={"carousel"} // default ''
      elementType={"div"} // default 'div'
      options={flickityOptions} // takes flickity options {}
      disableImagesLoaded={false} // default false
      reloadOnUpdate // default false
      static // default false
    >
      <img src={wallpaper} alt="wallpaper" />
      <img src={wallpaper} alt="wallpaper" />
      <img src={wallpaper} alt="wallpaper" />
    </Flickity>
  );
};

export default Slider;
