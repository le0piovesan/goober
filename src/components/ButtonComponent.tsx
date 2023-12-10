import { Button, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { type FC, type ButtonHTMLAttributes } from "react";

type ButtonComponentProps = {
  href?: string;
  outline?: boolean;
  textOnly?: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonComponent: FC<ButtonComponentProps> = ({
  href,
  outline,
  textOnly,
  children,
  ...props
}) => {
  const buttonStyles = {
    lineHeight: "1.2",
    fontWeight: "bold",
    color: outline ?? textOnly ? "background" : "light",
    border: outline ? "2px solid" : "none",
    backgroundColor: outline
      ? "light"
      : textOnly
        ? "transparent"
        : "background",
    _hover: {
      bg: textOnly ? "transparent" : "primary",
      color: textOnly ? "primary" : "light",
      borderColor: outline && "primary",
    },
  };

  return href ? (
    <NextLink href={href} passHref>
      <Link as={Button} {...buttonStyles}>
        {children}
      </Link>
    </NextLink>
  ) : (
    <Button {...buttonStyles} {...props}>
      {children}
    </Button>
  );
};

export default ButtonComponent;
