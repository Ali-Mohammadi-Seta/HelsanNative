import L from "leaflet";
import markerShadow from "@/assets/images/map/marker-shadow.png";
import PointerIcon from "@/assets/images/map/pointerIcon.svg";
import PurpleIcon from "@/assets/images/map/purple-icon.svg";
import BlueIcon from "@/assets/images/map/blue-icon.svg";
import RedIcon from "@/assets/images/map/red-icon.svg";
import BlackLocationMarker from "@/assets/images/map/black-marker-icon.svg";
import GreenIcon from "@/assets/images/map/green-icon.svg";
import YellowIcon from "@/assets/images/map/yellow-icon.svg";
import PinkIcon from "@/assets/images/map/pink-icon.svg";
import OrangeIcon from "@/assets/images/map/orange-icon.svg";
import GrayIcon from "@/assets/images/map/gray-icon.svg";
import DarkBlueIcon from "@/assets/images/map/dark-blue-icon.svg";
import DarkGreenIcon from "@/assets/images/map/dark-green-icon.svg";
import DarkGrayIcon from "@/assets/images/map/dark-gray-icon.svg";
import DarkPinkIcon from "@/assets/images/map/dark-pink-icon.svg";
import ClinicIcon from "@/assets/images/map/clinic.svg";
import DoctorIcon from "@/assets/images/map/doctor.svg";
import HospitalIcon from "@/assets/images/map/hospital.svg";
import DrugStoreIcon from "@/assets/images/map/drugstore.svg";
import LabIcon from "@/assets/images/map/lab.svg";

export const handIcon = new L.Icon({
  iconUrl: PointerIcon,
  iconRetinaUrl: PointerIcon,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [25, 55],
  shadowUrl: markerShadow,
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
});
export const purpleLocationIcon = new L.Icon({
  iconUrl: PurpleIcon,
  iconRetinaUrl: PurpleIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const blueLocationIcon = new L.Icon({
  iconUrl: BlueIcon,
  iconRetinaUrl: BlueIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const redLocationIcon = new L.Icon({
  iconUrl: RedIcon,
  iconRetinaUrl: RedIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const blackLocationIcon = new L.Icon({
  iconUrl: BlackLocationMarker,
  iconRetinaUrl: BlackLocationMarker,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const greenLocationIcon = new L.Icon({
  iconUrl: GreenIcon,
  iconRetinaUrl: GreenIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const yellowLocationIcon = new L.Icon({
  iconUrl: YellowIcon,
  iconRetinaUrl: YellowIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const pinkLocationIcon = new L.Icon({
  iconUrl: PinkIcon,
  iconRetinaUrl: PinkIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const orangeLocationIcon = new L.Icon({
  iconUrl: OrangeIcon,
  iconRetinaUrl: OrangeIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const grayLocationIcon = new L.Icon({
  iconUrl: GrayIcon,
  iconRetinaUrl: GrayIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});

export const darkBlueLocationIcon = new L.Icon({
  iconUrl: DarkBlueIcon,
  iconRetinaUrl: DarkBlueIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const darkGreenLocationIcon = new L.Icon({
  iconUrl: DarkGreenIcon,
  iconRetinaUrl: DarkGreenIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});

export const darkGrayLocationIcon = new L.Icon({
  iconUrl: DarkGrayIcon,
  iconRetinaUrl: DarkGrayIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const darkPinkLocationIcon = new L.Icon({
  iconUrl: DarkPinkIcon,
  iconRetinaUrl: DarkPinkIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const clinicLocationIcon = new L.Icon({
  iconUrl: ClinicIcon,
  iconRetinaUrl: ClinicIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const doctorLocationIcon = new L.Icon({
  iconUrl: DoctorIcon,
  iconRetinaUrl: DoctorIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const hospitalLocationIcon = new L.Icon({
  iconUrl: HospitalIcon,
  iconRetinaUrl: HospitalIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const drugstoreLocationIcon = new L.Icon({
  iconUrl: DrugStoreIcon,
  iconRetinaUrl: DrugStoreIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
export const labLocationIcon = new L.Icon({
  iconUrl: LabIcon,
  iconRetinaUrl: LabIcon,
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
  iconSize: [40, 40],
  shadowUrl: markerShadow,
  shadowSize: [29, 40],
  shadowAnchor: [7, 40],
});
