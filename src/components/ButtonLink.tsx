import { Button, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { type FC } from "react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
};

const ButtonLink: FC<ButtonLinkProps> = ({ href, children }) => {
  return (
    <NextLink href={href} passHref>
      <Link
        as={Button}
        lineHeight="1.2"
        fontWeight="bold"
        color="light"
        backgroundColor="background"
        _hover={{ bg: "secondary" }}
      >
        {children}
      </Link>
    </NextLink>
  );
};

export default ButtonLink;
