import { type NextPage } from "next";
import ContainerCard from "~/components/ContainerCard";
import useCurrentPosition from "~/hooks/useCurrentPosition";
import { useAuth } from "~/context/AuthContext";

const Feed: NextPage = () => {
  const { user } = useAuth();
  user && user.type === "Driver" ? useCurrentPosition() : { position: null };

  return <ContainerCard />;
};

export default Feed;
