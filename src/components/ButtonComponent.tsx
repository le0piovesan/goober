import { Button, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { type FC, type ButtonHTMLAttributes } from "react";

type ButtonComponentProps = {
  href?: string;
  outline?: boolean;
  textOnly?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactElement;
  declineCancel?: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonComponent: FC<ButtonComponentProps> = ({
  href,
  outline,
  textOnly,
  loading,
  leftIcon,
  declineCancel,
  children,
  ...props
}) => {
  const buttonStyles = {
    lineHeight: "1.2",
    fontWeight: "bold",
    marginBottom: "0.2rem",
    color: outline ?? textOnly ? "background" : declineCancel ? "red" : "light",
    border: outline ?? declineCancel ? "2px solid" : "none",
    backgroundColor:
      outline ?? declineCancel
        ? "light"
        : textOnly
          ? "transparent"
          : "background",
    _hover: {
      bg: textOnly ? "transparent" : declineCancel ? "red" : "primary",
      color: textOnly ? "primary" : "light",
      borderColor: outline ? "primary" : declineCancel ? "red" : "none",
    },
  };

  return href ? (
    <NextLink href={href} passHref>
      <Link as={Button} {...buttonStyles} leftIcon={leftIcon}>
        {children}
      </Link>
    </NextLink>
  ) : (
    <Button
      {...buttonStyles}
      {...props}
      isLoading={loading}
      leftIcon={leftIcon}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
