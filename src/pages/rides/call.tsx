import { type NextPage } from "next";
import Map from "~/components/Map";
import { useJsApiLoader, type Libraries } from "@react-google-maps/api";
import Loading from "~/components/Loading";
import { useRef } from "react";

const Call: NextPage = () => {
  const libraries = useRef<Libraries>(["places"]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: libraries.current,
  });
  return <>{isLoaded ? <Map /> : <Loading />}</>;
};

export default Call;
