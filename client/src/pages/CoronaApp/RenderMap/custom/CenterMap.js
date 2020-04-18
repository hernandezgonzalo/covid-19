import { useEffect } from "react";
import { useGoogleMap } from "@react-google-maps/api";
import { goUserLocation } from "../../../../lib/maps";

function CustomControl(controlDiv, map) {
  const controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginRight = "6px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Your location";
  controlUI.style.backgroundImage = "url(images/location.png)";
  controlUI.style.backgroundSize = "cover";
  controlUI.style.width = "25px";
  controlUI.style.height = "25px";
  controlDiv.appendChild(controlUI);

  controlUI.addEventListener("click", function () {
    goUserLocation(map, 14);
  });
}

const CenterMap = () => {
  const map = useGoogleMap();

  useEffect(() => {
    const customControlDiv = document.createElement("div");
    new CustomControl(customControlDiv, map);
    customControlDiv.index = 1;
    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(
      customControlDiv
    );
  }, [map]);

  return null;
};

export default CenterMap;
