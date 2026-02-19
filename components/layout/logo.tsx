import React from "react";

interface LogoProps {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  src = "/images/logo.png",
  alt = "Trinity Logo",
  width = 162,
  height = 32,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center`}
      style={{ width, height }}
    >
      <img src={src} alt={alt} className={`h-full w-full ${className}`} />
    </div>
  );
};

export default Logo;
