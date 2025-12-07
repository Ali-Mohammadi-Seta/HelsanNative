// MapLocator.tsx
import {
  Circle,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
  useMap, // Import useMap hook
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import L, { LatLngExpression } from "leaflet";
import mainBanner from "@/assets/images/main-banner.png";
import {
  redLocationIcon,
  clinicLocationIcon,
  hospitalLocationIcon,
  drugstoreLocationIcon,
  labLocationIcon,
  greenLocationIcon,
} from "./PointerIcons";
import apiServices from "@/services/apiServices";
import endpoints from "@/services/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentLocation } from "@/redux/reducers/currentLocationReducer";
import { AiOutlineEnvironment } from "react-icons/ai";
import { Tabs, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { PiKeyReturnDuotone } from 'react-icons/pi';
import CustomButton from "@/components/button";

interface LocationItem {
  _id: string;
  id?: string;
  category: string;
  name: string;
  title: string;
  address: string;
  province?: string;
  city?: string;
  region?: string;
  neighbourhood?: string;
  location: {
    lat: number;
    lon: number;
    x?: number;
    y?: number;
  };
}

interface Bounds {
  lat: number;
  lng: number;
}

interface MapLeafletInnerProps {
  allData: LocationItem[];
  onMove: (topLeft: Bounds, bottomRight: Bounds) => void;
}

const { Overlay } = LayersControl;

// --- Custom Location Button Component ---
const MyLocationButton = () => {
  const map = useMap();
  const dispatch = useDispatch();

  const handleLocateUser = useCallback(() => {
    map.locate().on("locationfound", (e: any) => {
      dispatch(
        setCurrentLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        })
      );
      map.flyTo(e.latlng, map.getZoom()); // Fly to the found location
    });
    // You might want to handle locationerror as well
    map.locate().on("locationerror", (e: any) => {
      console.error("Location error:", e.message);
      alert(`Could not find your location: ${e.message}`);
    });
  }, [map, dispatch]);

  return (
    <div
      className="leaflet-control leaflet-bar"
      style={{
        position: "absolute",
        top: "80px", // Adjust position as needed
        left: "10px", // Adjust position as needed
        zIndex: 1000, // Ensure it's above the map
      }}
    >
      <button
        onClick={handleLocateUser}
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#333",
        }}
        title="Find My Location"
      >
        <span style={{ fontFamily: "sans-serif", fontWeight: "bold" }}>
          <AiOutlineEnvironment size={20} />
        </span>{" "}
        {/* Using an emoji for simplicity */}
        {/* You can replace the emoji with an SVG icon or a more sophisticated CSS icon */}
      </button>
    </div>
  );
};
// --- End Custom Location Button Component ---

export const MapLeafletInner = ({ allData, onMove }: MapLeafletInnerProps) => {
  console.log("allDataaaaaaaaaaa", allData);
  const dispatch = useDispatch();
  const { currentLocation, accuracy } = useSelector(
    (state: any) => state.currentLocation
  );

  const [currentPos, setCurrentPos] = useState<LatLngExpression>([
    currentLocation?.lat,
    currentLocation?.lng,
  ]);

  useEffect(() => {
    if (currentLocation?.lat && currentLocation?.lng) {
      setCurrentPos([currentLocation.lat, currentLocation.lng]);
    }
  }, [currentLocation]);

  const map = useMapEvents({
    mouseover() {
      map.scrollWheelZoom.enable();
    },
    click(e) {
      if (map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.disable();
      } else {
        map.scrollWheelZoom.enable();
      }
      dispatch(
        setCurrentLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        })
      );
    },
    moveend() {
      const bounds = map.getBounds();
      const topleft = {
        lat: bounds.getNorthWest().lat,
        lng: bounds.getNorthWest().lng,
      };
      const bottomright = {
        lat: bounds.getSouthEast().lat,
        lng: bounds.getSouthEast().lng,
      };
      onMove(topleft, bottomright);
    },
    locationfound(e) {
      dispatch(
        setCurrentLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        })
      );
      map.flyTo(e.latlng, map.getZoom());
      setCurrentPos(e.latlng);
    },
  });

  const t = (k: string): string => {
    const data: Record<string, string> = {
      mapink: "رنگی",
      blackandwhite: "سیاه و سفید",
      hospital: "بیمارستان",
      drugstore: "داروخانه",
      dentistry: "دندانپزشکی",
      radiography: "پرتوپزشکی",
      radiology: "تصویربرداری",
      counselingcenter: "مرکز مشاوره",
      medicine: "داروها",
      ophthalmology: "چشم پزشکی و بینایی سنجی",
      clinic: "کلینیک",
      illness: "بیماری",
      laboratory: "آزمایشگاه",
      physiotherapy: "فیزیوتراپی",
      doctors: "متخصصان و پزشکان",
      takingturns: "نوبت گیری",
      ambulance: "آمبولانس",
      inpatientCenter: "مركز بستري",
      rehabilitation: "توانبخشی",
      welfare: "بهزیستی",
      medicalServices: "خدمات پزشکی",
      medicalSupplies: "لوازم پزشکی",
      nonTherapeutic: "غیر درمانی",
      yourlocation: "موقعیت شما",
      title: "نام",
      address: "آدرس",
      بیمارستان: "hospital",
      داروخانه: "pharmacy",
      آزمایشگاه: "clinic",
      پرتوپزشکی: "clinic",
      کلینیک: "clinic",
      توانبخشی: "clinic",
      دندانپزشکی: "clinic",
      "مرکز مشاوره": "clinic",
    };
    return data[k] ?? k;
  };

  const showLocation = (
    item: LocationItem,
    index: number,
    customizeIcon: L.Icon,
    t: (k: string) => string
  ) => {
    const point: LatLngExpression = [
      item.location?.lat ?? item.location?.y,
      item.location?.lon ?? item.location?.x,
    ];
    return (
      <Marker
        icon={customizeIcon}
        position={point}
        key={`${item.id || item._id}_${index}`}
      >
        <Popup>
          <Link to={`/${t(item.category)}/${item._id}`} className="!text-start">
            <span className="block">
              <b>{t("title")}: </b> {item.name}
              <br />
              <b>{t("address")}: </b>{" "}
              {item.region
                ? `${item.region}, ${item.neighbourhood} - ${item.address}`
                : `${item.province}, ${item.city} - ${item.address}`}
            </span>
          </Link>
        </Popup>
      </Marker>
    );
  };

  useEffect(() => {
    if (!map) return;
    // Initial bounds check (optional, but good practice)
    const topleft = map.getBounds().getNorthWest();
    const bottomright = map.getBounds().getSouthEast();
    onMove(
      { lat: topleft.lat, lng: topleft.lng },
      { lat: bottomright.lat, lng: bottomright.lng }
    );
  }, [map]);

  const OverlayPart = (name?: string, icon?: L.Icon, data?: LocationItem[]) =>
    name && icon && data ? (
      <Overlay checked name={name}>
        <LayerGroup>
          {data.map((item, index) => showLocation(item, index, icon, t))}
        </LayerGroup>
      </Overlay>
    ) : null;

  const mapOverlay = () => (
    <LayersControl position="topright">
      {OverlayPart(
        t("hospital"),
        hospitalLocationIcon,
        allData.filter((i) => i.category === t("hospital"))
      )}
      {OverlayPart(
        t("drugstore"),
        drugstoreLocationIcon,
        allData.filter((i) => i.category === t("drugstore"))
      )}
      {OverlayPart(
        t("laboratory"),
        labLocationIcon,
        allData.filter((i) => i.category === t("laboratory"))
      )}
      {OverlayPart(
        t("radiography"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("radiography"))
      )}
      {OverlayPart(
        t("radiology"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("radiology"))
      )}
      {OverlayPart(
        t("clinic"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("clinic"))
      )}
      {OverlayPart(
        t("inpatientCenter"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("inpatientCenter"))
      )}
      {OverlayPart(
        t("rehabilitation"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("rehabilitation"))
      )}
      {OverlayPart(
        t("medicalSupplies"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("medicalSupplies"))
      )}
      {OverlayPart(
        t("nonTherapeutic"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("nonTherapeutic"))
      )}
      {OverlayPart(
        t("medicalServices"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("medicalServices"))
      )}
      {OverlayPart(
        t("dentistry"),
        clinicLocationIcon,
        allData.filter((i) => i.category === t("dentistry"))
      )}
      {OverlayPart(
        t("ambulance"),
        redLocationIcon,
        allData.filter((i) => i.category === t("ambulance"))
      )}
    </LayersControl>
  );

  return (
    <>
      <Marker
        key="currentLoc"
        zIndexOffset={10}
        position={currentPos}
        icon={greenLocationIcon}
      />
      <Circle center={currentPos} color="lightblue" radius={accuracy} />
      {mapOverlay()}
      <MyLocationButton /> {/* Add your custom button here */}
    </>
  );
};

const MapLocator = () => {
  const { t } = useTranslation();

  const [mapPlacesData, setMapPlacesData] = useState<any[]>([]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    scrollToTop();
  }, []);

  const callApi = async (topleft: any, bottomright: any) => {
    const body = {
      topLeftLat: topleft.lat,
      topLeftLng: topleft.lng,
      bottomRightLat: bottomright.lat,
      bottomRightLng: bottomright.lng,
    };

    const res = await apiServices.get(endpoints.getPlaceListOnMove1, body);
    if (res?.isSuccess) {
      console.log("resssssssss", res);
      setMapPlacesData([...res.data?.data?.data]);
    }
  };
  const southWest = L.latLng(-89.98155760646617, -180),
    northEast = L.latLng(89.99346179538875, 180),
    bounds = L.latLngBounds(southWest, northEast);
  return (
    <div className="pt-10">


      <div className="flex justify-center gap-5">
        <div className="  text-center py-10 text-colorPrimary font-bold text-xl">
          {t("mapLocator.medicalCenterMap")}
        </div>
        <Link className="mt-4" to="../">
          <Tooltip title={t('return')}>
            <CustomButton icon={<PiKeyReturnDuotone size={30} />} className="w-full rounded-[1rem] mt-[19px] flex   flex-row-reverse !border-none !bg-stone-50 !text-red-400 !text-xl py-2 !cursor-pointer"></CustomButton>
          </Tooltip>
        </Link>
      </div>

      <section
        style={{ backgroundImage: `url(${mainBanner})` }}
        className="main-section min-h-[100px] relative bg-cover
        before:content['']
        before:top-0 before:bottom-0 before:right-0 before:left-0
        before:opacity-[0.75] before:absolute before:bg-colorPrimary px-5 !rounded-lg before:!rounded-lg"
      >
        <div className="text-center relative z-10 pt-10 px-5">
          <Typography.Text className="block my-1 !text-lg !text-center !text-white">
            {t("mapLocator.text1")}
          </Typography.Text>{" "}
          <Typography.Text className="block my-1 !text-[16px] !text-center !text-white mt-2">
            {t("mapLocator.text2")}
          </Typography.Text>
        </div>
        <div className="container relative flex flex-col items-center py-[45px] z-10">
          <Tabs
            className="tab-el w-full"
            type="card"
            animated={false}
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: `${t("nearestOffice")}`,
                children: (
                  <div
                    className="tab-content-container map p-[0] flex items-start h-[300px]
                2md:flex-col
                2md:justify-center
                "
                  >
                    <MapContainer
                      center={[35.6892, 51.389]}
                      zoom={13}
                      minZoom={1}
                      maxBounds={bounds}
                      scrollWheelZoom
                      className="w-full !rounded-lg !my-auto h-[300px]"
                    // style={{ height: "calc(50vh - 100px)" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapLeafletInner
                        allData={mapPlacesData ?? []}
                        onMove={(topleft, bottomright) =>
                          callApi(topleft, bottomright)
                        }
                      />
                    </MapContainer>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
};

export default MapLocator;
