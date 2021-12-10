import React from 'react';

interface IProps {
  width?: number;
  height?: number;
  alt?: string;
  src: string;
  className?: any;
}

function Image(props: IProps) {
  const { alt, width, height, src, className } = props;

  return (
    <img
      alt={alt || 'site'}
      style={
        {
          width: width || '',
          height: height || '',
        }
      }
      src={src}
      className={className}
    />
  );
}

export default Image;