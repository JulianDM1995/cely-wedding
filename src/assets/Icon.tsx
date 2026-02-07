import React from 'react'

const Icon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img
    src="/images/branding/icon.png"
    alt="NJean Icon"
    {...props}
    style={{ maxWidth: '100%', height: 'auto', maxHeight: '100%', ...props.style }}
  />
)

export default Icon
