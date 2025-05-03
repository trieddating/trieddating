'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

const ZoomableImage = ({ src, alt, width, height }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const modalRef = useRef(null);
  const touchStartRef = useRef(null);
  const lastTapTimeRef = useRef(0);

  // Handle click/tap to open modal
  const handleImageClick = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;

    // Check for double tap (300ms threshold)
    if (timeSinceLastTap < 300 && isOpen) {
      // Double tap detected - toggle zoom
      setIsZoomed(!isZoomed);
    } else if (!isOpen) {
      // Single tap when closed - open modal
      setIsOpen(true);
    }

    lastTapTimeRef.current = now;
  };

  // Track touch start position for swipe detection
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  // Handle swipe up/down to close
  const handleTouchEnd = (e) => {
    if (!isOpen || !touchStartRef.current) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;

    // If swiped more than 50px up or down, close the modal
    if (Math.abs(diff) > 50) {
      setIsOpen(false);
      setIsZoomed(false);
    }

    touchStartRef.current = null;
  };

  // Close modal when clicking outside the image
  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      setIsOpen(false);
      setIsZoomed(false);
    }
  };

  // Close modal with escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen]);

  return (
    <>
      {/* Thumbnail image */}
      <div className="cursor-pointer" onClick={handleImageClick}>
        <Image src={src} alt={alt} width={width} height={height} />
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          ref={modalRef}
          className="bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black"
          onClick={handleModalClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <TransformWrapper
            initialScale={1}
            disabled={!isZoomed}
            minScale={0.5}
            maxScale={3}
            centerOnInit
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent>
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="max-h-screen max-w-full object-contain"
                    onClick={(e) => {
                      // Prevent click from closing modal when clicking on image
                      e.stopPropagation();
                      handleImageClick();
                    }}
                  />
                </TransformComponent>

                {isZoomed && (
                  <div className="bg-opacity-50 absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-4 rounded-lg bg-black px-4 py-2">
                    <button
                      onClick={() => zoomIn()}
                      className="text-xl text-white"
                    >
                      +
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      className="text-xl text-white"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      className="text-xl text-white"
                    >
                      -
                    </button>
                  </div>
                )}
              </>
            )}
          </TransformWrapper>

          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsZoomed(false);
              }}
              className="bg-opacity-50 rounded-full bg-black p-2 text-white"
            >
              ✕
            </button>
          </div>

          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-sm text-white">
            <p className="text-center opacity-70">
              {isZoomed ? 'Double-tap to exit zoom' : 'Double-tap to zoom'}
              <br />
              Swipe up/down to close
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ZoomableImage;