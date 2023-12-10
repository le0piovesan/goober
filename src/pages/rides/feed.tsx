import { type NextPage } from "next";
import { useContext } from "react";
import { AuthContext } from "~/context/AuthContext";

const Feed: NextPage = () => {
  const { logout } = useContext(AuthContext);

  const handleLogOut = async () => {
    await logout();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Feed</h1>
      <button onClick={() => handleLogOut()}>Log out</button>
    </div>
  );
};

export default Feed;
