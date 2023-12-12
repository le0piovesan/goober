import { Marker, DirectionsRenderer } from "@react-google-maps/api";

type MapMarkersAndRouteProps = {
  pickupLocationRef: React.MutableRefObject<
    google.maps.LatLngLiteral | google.maps.LatLng | null
  >;
  dropoffLocationRef: React.MutableRefObject<
    google.maps.LatLngLiteral | google.maps.LatLng | null
  >;
  directions: google.maps.DirectionsResult | null;
};

const MapMarkerDirections: React.FC<MapMarkersAndRouteProps> = ({
  pickupLocationRef,
  dropoffLocationRef,
  directions,
}) => (
  <>
    {pickupLocationRef.current && (
      <Marker position={pickupLocationRef.current} />
    )}
    {dropoffLocationRef.current && (
      <Marker position={dropoffLocationRef.current} />
    )}
    <DirectionsRenderer
      directions={directions ?? undefined}
      options={{
        polylineOptions: {
          strokeColor: "#845ec2",
          strokeWeight: 5,
        },
      }}
    />
  </>
);

export default MapMarkerDirections;
