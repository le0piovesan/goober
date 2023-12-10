import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-around">
      <div className="flex flex-col items-center self-start p-4 text-5xl font-bold">
        <h1>Welcome to</h1>
        <div className="flex items-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Goober
          </span>
          <span role="img" aria-label="taxi">
            🚕
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-row items-center gap-4">
        <Link href="users/signup">
          <button className="text-bold rounded border-2 p-2">Sign Up</button>
        </Link>
        <Link href="users/login">
          <button className="text-bold rounded border-2 p-2">Log In</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
