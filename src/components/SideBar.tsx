import Link from "next/link";
import React from "react";

const SideBar: React.FC = () => {
  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>{/* <Link href={`/profile/${user.id}`}>Profile</Link> */}</li>
      </ul>
    </nav>
  );
};

export default SideBar;
