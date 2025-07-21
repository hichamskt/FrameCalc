import { useState } from "react";

interface LazyBlurImageProps {
  src: string;
  alt?: string;
  placeholder?: string; // low-res version
  className?: string;
}

const LazyImage: React.FC<LazyBlurImageProps> = ({
  src,
  alt,
  placeholder,
  className,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={placeholder}
        alt="placeholder"
        aria-hidden
        className={`absolute inset-0 w-full h-full object-cover blur-lg scale-110 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};


export default LazyImage;
