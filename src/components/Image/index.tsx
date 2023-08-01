import React from "react";

import "./Image.css";

interface Props {
  src: string;
  alt?: string;
  clickEvent?: Function;
  styleClass?: string;
}

const Image: React.FC<Props> = ({
  clickEvent,
  src,
  alt,
  styleClass,
}) => {
  return (
    <img
      onClick={() => {
        clickEvent && clickEvent();
      }}
      src={src}
      alt={alt}
      className={`${styleClass} image_component`}
    />
  );
};

export default Image;
