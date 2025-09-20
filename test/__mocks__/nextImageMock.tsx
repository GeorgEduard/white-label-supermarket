import * as React from 'react';

// Simple Next.js Image mock that renders a native img
type MockImageProps = React.ComponentProps<'img'> & { src: string | { src: string } };

const MockedImage = React.forwardRef<HTMLImageElement, MockImageProps>(function Image(
  { src, alt, ...props }: MockImageProps,
  ref: React.ForwardedRef<HTMLImageElement>,
) {
  // Next/Image can pass objects; ensure src is string for tests
  const url = typeof src === 'string' ? src : (src?.src ?? '');
  return <img ref={ref} src={url} alt={alt} {...props} />;
});

export default MockedImage;
