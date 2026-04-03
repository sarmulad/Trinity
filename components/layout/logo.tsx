import React from "react";

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
  return (
    <div className="flex items-center justify-center" style={{ width, height }}>
      <img
        src="/images/logo_black.png"
        alt="Trinity Logo"
        className={`h-full w-full dark:hidden ${className}`}
      />
      <img
        src="/images/logo.png"
        alt="Trinity Logo"
        className={`hidden h-full w-full dark:block ${className}`}
      />
    </div>
  );
};

export default Logo;
