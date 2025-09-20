import * as React from 'react';

// Simple Next.js Image mock that renders a native img
const MockedImage = React.forwardRef<HTMLImageElement, any>(function Image(
  { src, alt, ...props },
  ref,
) {
  // Next/Image can pass objects; ensure src is string for tests
  const url = typeof src === 'string' ? src : (src?.src ?? '');
  return <img ref={ref} src={url} alt={alt} {...props} />;
});

export default MockedImage;
