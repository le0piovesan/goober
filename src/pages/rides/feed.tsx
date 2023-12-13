import { type NextPage } from "next";
import RidesContainer from "~/components/RidesContainer";
import useCurrentPosition from "~/hooks/useCurrentPosition";
import { useAuth } from "~/context/AuthContext";

const Feed: NextPage = () => {
  const { user } = useAuth();
  user && user.type === "Driver" ? useCurrentPosition() : { position: null };

  return <RidesContainer />;
};

export default Feed;
