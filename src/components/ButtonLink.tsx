import { Button, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { type FC } from "react";

type ButtonLinkProps = {
  href: string;
  secondary?: boolean;
  textOnly?: boolean;
  children: React.ReactNode;
};

const ButtonLink: FC<ButtonLinkProps> = ({
  href,
  secondary,
  textOnly,
  children,
}) => {
  return (
    <NextLink href={href} passHref>
      <Link
        as={Button}
        width="80px"
        lineHeight="1.2"
        fontWeight="bold"
        color={secondary ?? textOnly ? "background" : "light"}
        border={secondary ? "2px solid" : "none"}
        backgroundColor={
          secondary ? "light" : textOnly ? "transparent" : "background"
        }
        _hover={{
          bg: textOnly ? "transparent" : "secondary",
          color: textOnly ? "secondary" : "light",
          borderColor: secondary && "secondary",
        }}
      >
        {children}
      </Link>
    </NextLink>
  );
};

export default ButtonLink;
