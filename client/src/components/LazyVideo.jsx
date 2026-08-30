import { useState, useEffect, useRef } from "react";

/**
 * LazyVideo component for smooth, performance-focused video lazy loading below the fold.
 * Only loads video source and triggers playback when the container enters the viewport.
 */
export default function LazyVideo({
  src,
  poster,
  type = "video/mp4",
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  playsInline = true,
  className = "",
  style = {},
  ariaLabel = "Video player",
  ...props
}) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Standard IntersectionObserver to observe viewport proximity (200px threshold)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isInView && videoRef.current && autoPlay) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked if unmuted, muted handles most browsers gracefully
      });
    }
  }, [isInView, autoPlay]);

  return (
    <div
      ref={containerRef}
      className={`lazy-video-container ${className}`}
      style={{ position: "relative", overflow: "hidden", ...style }}
      {...props}
    >
      {poster && (
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isLoaded ? 0 : 1,
            transition: "opacity 0.4s ease",
            pointerEvents: "none"
          }}
        />
      )}

      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          aria-label={ariaLabel}
          onLoadedData={() => setIsLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block"
          }}
        />
      )}
    </div>
  );
}
