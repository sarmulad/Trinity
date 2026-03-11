import React from "react";
import { useTheme } from "next-themes";

interface LogoProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 162,
  height = 32,
  className = "",
}) => {
  const { resolvedTheme } = useTheme();
  const src =
    resolvedTheme === "dark" ? "/images/logo.png" : "/images/logo_black.png";

  return (
    <div className="flex items-center justify-center" style={{ width, height }}>
      <img
        src={src}
        alt="Trinity Logo"
        className={`h-full w-full ${className}`}
      />
    </div>
  );
};

export default Logo;
