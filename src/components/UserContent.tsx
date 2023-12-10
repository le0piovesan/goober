import { useAuth } from "~/context/AuthContext";
import SideBar from "~/components/SideBar";

const UserContent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto flex items-start">
      {user && user.isLoggedIn && <SideBar />}
      <div className="min-h-screen flex-grow border-x">{children}</div>
    </div>
  );
};

export default UserContent;
