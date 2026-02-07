import React from 'react'

const Logo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img
    src="/images/branding/logo.png"
    alt="NJean Logo"
    {...props}
    style={{ maxWidth: '100%', height: 'auto', maxHeight: '8rem', ...props.style }}
  />
)

export default Logo
