import { useMemo, useState } from "react";
import { Layer, LayerProps, Marker, Popup, Source } from "react-map-gl";
import rentMarkerIcon from "../assets/img/rentMarker.svg";
import sellMarkerIcon from "../assets/img/sellMarker.svg";
import Tooltip from "./Tooltip";

interface ExactLocationMapProps {
  ChangeZoom: any;
  data: any;
}
const Pins = ({ ChangeZoom, data }: ExactLocationMapProps) => {
  const [popupInfo, setPopupInfo] = useState<any | null>(null);

  const pins: any = useMemo(
    () =>
      data?.map((location: any, index: number) => {
        return (
          <Marker
            key={index}
            longitude={location.geometry.coordinates[0]}
            latitude={location.geometry.coordinates[1]}
            anchor="bottom"
            onClick={(e) => {
              //           // If we let the click event propagates to the map, it will immediately close the popup
              //           // with `closeOnClick: true`
              e.originalEvent.stopPropagation();
              setPopupInfo(location);
            }}
          >
            <div>
              <img
                src={
                  location.properties.type === "sell"
                    ? sellMarkerIcon
                    : rentMarkerIcon
                }
                alt="marker"
              />
            </div>
          </Marker>
        );
      }),
    [ChangeZoom, data]
  );

  return (
    <>
      {pins}
      {popupInfo && (
        <Popup
          anchor="bottom"
          longitude={Number(popupInfo.geometry.coordinates[0])}
          latitude={Number(popupInfo.geometry.coordinates[1])}
          onClose={() => setPopupInfo(null)}
          style={{ borderRadius: "50px", paddingBottom: "30px" }}
          maxWidth="500"
        >
          <Tooltip item={popupInfo.properties} />
        </Popup>
      )}
    </>
  );
};

export default Pins;
