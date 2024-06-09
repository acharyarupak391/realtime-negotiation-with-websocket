import react from "react";
import { classnames } from "@/utils/classnames";
import { Icon, IconProps } from "@tabler/icons-react";

const Button = (
  {
    variant = "filled",
    accent = "default",
    children,
    Icon,
    size = "md",
    iconLeft = false,
    ...props
  }: {
    variant?: "filled" | "outlined";
    accent?: "default" | "danger" | "success" | "warning" | "info";
    children: React.ReactNode;
    Icon?: react.ForwardRefExoticComponent<
      IconProps & react.RefAttributes<Icon>
    >;
    size?: "sm" | "md" | "lg" | "xl";
    iconLeft?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement> // Add default HTML button props type
) => {
  const icon = Icon && (
    <Icon
      size={
        size === "sm"
          ? 14
          : size === "md"
          ? 20
          : size === "lg"
          ? 24
          : size === "xl"
          ? 28
          : 20
      }
    />
  );

  return (
    <button
      {...props}
      className={classnames(
        `rounded-xl border font-work-sans hover:shadow-md hover:bg-opacity-90 flex items-center gap-2 justify-center`,
        accent === "default" && "border-gray-900 bg-gray-900 text-gray-900",
        accent === "danger" && "border-red-500 bg-red-500 text-red-500",
        accent === "success" && "border-green-500 bg-green-500 text-green-500",
        accent === "warning" &&
          "border-yellow-700 bg-yellow-700 text-yellow-700",
        accent === "info" && "border-blue-500 bg-blue-500 text-blue-500",
        variant === "outlined" ? "!bg-transparent" : "!text-white",
        "disabled:opacity-25 disabled:cursor-not-allowed",
        size === "sm"
          ? "text-xs py-1 px-2 leading-3"
          : size === "md"
          ? "text-md py-2 px-3"
          : size === "lg"
          ? "text-lg py-3 px-4"
          : size === "xl"
          ? "text-xl py-4 px-5"
          : "",
        props.className
      )}
    >
      {iconLeft && icon}
      {children}
      {!iconLeft && icon}
    </button>
  );
};

export { Button };
