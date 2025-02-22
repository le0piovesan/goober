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
  disabled?: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonComponent: FC<ButtonComponentProps> = ({
  href,
  outline,
  textOnly,
  loading,
  leftIcon,
  declineCancel,
  disabled,
  children,
  ...props
}) => {
  const buttonStyles = {
    lineHeight: "1.2",
    fontWeight: "bold",
    marginBottom: "0.2rem",
    color: outline ?? textOnly ? "background" : "light",
    border: outline ? "2px solid" : "none",
    boxShadow: textOnly ? "none" : "0px 4px 4px rgba(0, 0, 0, 0.25)",
    backgroundColor: outline
      ? "light"
      : textOnly
        ? "transparent"
        : declineCancel
          ? "red"
          : "background",
    _hover: {
      bg: textOnly ? "transparent" : declineCancel ? "red.600" : "primary",
      color: textOnly ? "primary" : "light",
      borderColor: outline ? "primary" : declineCancel ? "red" : "none",
    },
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
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
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
