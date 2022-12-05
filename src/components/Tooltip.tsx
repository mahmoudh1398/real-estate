import { Rating } from "react-simple-star-rating";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import meterageIcon from "../assets/img/meterage.png";
import roomsIcon from "../assets/img/rooms.png";
import parkingIcon from "../assets/img/parking.png";
import callIcon from "../assets/img/call.png";
import { FC } from "react";

interface TooltipProps {
  item: any;
}

const Tooltip: FC<TooltipProps> = ({ item }): JSX.Element => {
  return (
    <div className="tooltip" dir="rtl">
      <div className="wallpaper-container">
        <img className="wallpaper" src={item.image} alt="wallpaper" />
        <div className="favorite">
          {item.bookmarked ? (
            <AiFillHeart style={{ color: "#ff0f00" }} />
          ) : (
            <AiOutlineHeart />
          )}
        </div>
      </div>
      <div className="title">{item.title}</div>
      <div className="rating">
        <Rating initialValue={item.rating} readonly size={20} />
      </div>
      <div className="properties">
        <div className="tooltip-meterage">
          <img src={meterageIcon} alt="meterage" />
          <span>متراژ: {item.meterage} متر‌مربع</span>
        </div>
        <div className="rooms">
          <img src={roomsIcon} alt="rooms" />
          <span>{item.bedrooms} خوابه</span>
        </div>
        {item.parking && (
          <div className="parking">
            <img src={parkingIcon} alt="parking" />
            <span>پارکینگ</span>
          </div>
        )}
      </div>
      <div className="separator-line"></div>
      <div className="price-and-call">
        {item.type === "rent" ? (
          <div className="price">
            <span>ودیعه: {item.mortgage}</span>
            <span>اجاره: {item.price}</span>
          </div>
        ) : (
          <div className="price">
            <span>قیمت: {item.price}</span>
          </div>
        )}
        <button className="call">
          <img src={callIcon} alt="call" />
        </button>
      </div>
    </div>
  );
};

export default Tooltip;
