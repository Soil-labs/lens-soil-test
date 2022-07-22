import { useEffect, useState } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

export const Avatar = ({ size = 6, src, alt }: AvatarProps) => {
  const [avatarSize, setAvatarSize] = useState("");
  const setSize = `h-${size} w-${size}`;

  useEffect(() => {
    setAvatarSize(setSize);
  }, [size]);

  return (
    <div className="mr-2 flex justify-center items-center drop-shadow-[0px_2px_7px_rgba(0,48,142,0.09)]">
      <span
        className={`inline-block ${avatarSize} rounded-full overflow-hidden bg-gray-100`}
      >
        {src ? (
          <img src={src} alt={alt || "avatar"} />
        ) : (
          <svg
            className={`h-full w-full text-gray-300`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </span>
    </div>
  );
};
