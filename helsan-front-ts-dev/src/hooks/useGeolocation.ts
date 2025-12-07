import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  setAccuracy,
  setCurrentLocation,
} from "@/redux/reducers/currentLocationReducer";

function isBounded(
  top: number,
  left: number,
  bottom: number,
  right: number,
  latitude: number,
  longitude: number
) {
  if (top >= latitude && latitude >= bottom) {
    if (left <= right && left <= longitude && longitude <= right) {
      return true;
    }
    if (left > right && (left <= longitude || longitude <= right)) {
      return true;
    }
  }
  return false;
}

export const useGeolocation = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(setAccuracy(position.coords.accuracy));

        if (
          isBounded(
            40,
            43.5,
            24.5,
            64,
            position.coords.latitude,
            position.coords.longitude
          )
        ) {
          dispatch(
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          );
        }
      },
      () => {
        console.log("error finding location");
      },
      { enableHighAccuracy: true }
    );
  }, []);
};
