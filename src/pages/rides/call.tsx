import { type NextPage } from "next";
import ContainerForm from "~/components/ContainerForm";
import Map from "~/components/Map";
import { useJsApiLoader } from "@react-google-maps/api";
import Loading from "~/components/Loading";

const Call: NextPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });
  return <ContainerForm>{isLoaded ? <Map /> : <Loading />}</ContainerForm>;
};

export default Call;
