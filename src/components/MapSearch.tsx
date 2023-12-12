import { Autocomplete } from "@react-google-maps/api";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";

type LocationAutocompleteProps = {
  register: UseFormRegister<{
    pickupLocation: string;
    dropoffLocation: string;
  }>;
  loading: boolean;
  retrieveRouteInfo: () => void;
  pickupLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>;
  dropoffLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>;
  errors: FieldErrors<{
    pickupLocation: string;
    dropoffLocation: string;
  }>;
};

const MapSearch: React.FC<LocationAutocompleteProps> = ({
  register,
  loading,
  retrieveRouteInfo,
  pickupLocationRef,
  dropoffLocationRef,
  errors,
}) => (
  <>
    <Autocomplete
      onLoad={(autocomplete) => {
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          pickupLocationRef.current = {
            lat: lat ?? 0,
            lng: lng ?? 0,
          };
        });
      }}
    >
      <InputComponent
        label="Get a ride"
        register={register}
        name="pickupLocation"
        placeholder="Origin"
        error={errors.pickupLocation}
      />
    </Autocomplete>
    <Autocomplete
      onLoad={(autocomplete) => {
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          dropoffLocationRef.current = {
            lat: lat ?? 0,
            lng: lng ?? 0,
          };
        });
      }}
    >
      <InputComponent
        label="Where to?"
        register={register}
        name="dropoffLocation"
        placeholder="Destination"
        error={errors.dropoffLocation}
      />
    </Autocomplete>

    <ButtonComponent onClick={retrieveRouteInfo} loading={loading}>
      Search 🔍
    </ButtonComponent>
  </>
);

export default MapSearch;
