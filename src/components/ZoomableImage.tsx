'use client';

import React from 'react';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { PreparedPhotoSwipeOptions } from 'photoswipe';

const PhotoSwipeImageViewer = ({
  src,
  alt,
  width,
  height,
  className = '',
  thumbnailWidth = 700,
  thumbnailHeight = 400,
}) => {
  // Configure PhotoSwipe options for mobile interactions
  const options = {
    // Dark background
    bgOpacity: 0.8,

    // Allow swiping to next/prev when zoomed
    allowPanToNext: false,

    // Enable close gesture (swipe down/up)
    wheelToZoom: false,

    // Single tap to toggle zoom
    clickToCloseNonZoomable: true,

    // Pinch to close
    pinchToClose: true,

    // Animation settings
    showAnimationDuration: 300,
    hideAnimationDuration: 300,

    // Zoom settings
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 0.5,
    maxZoomLevel: 0.5,

    // Remove magnifier button
    zoom: false,

    bgClickAction: 'close',
    tapAction: 'close',

    // Padding around the image when zoomed out
    paddingFn: () => {
      return {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      };
    },
  } as Partial<PreparedPhotoSwipeOptions>;

  // Event handlers for mobile interactions
  const handleBeforeOpen = (pswp) => {
    // Add custom event listeners before the PhotoSwipe is initialized
    pswp.on('firstUpdate', () => {
      // Initial setup when the gallery first updates
    });
  };

  const handleOpen = (pswp) => {
    // When PhotoSwipe is fully open
    pswp.on('doubleTap', (e) => {
      // Custom double tap handler - toggles between fit and zoomed
      const currSlide = pswp.currSlide;

      if (currSlide.currZoomLevel === currSlide.zoomLevels.initial) {
        // Currently at initial zoom, zoom in to secondary level
        currSlide.zoomTo(
          currSlide.zoomLevels.secondary,
          { x: e.point.x, y: e.point.y },
          50,
        );
      } else {
        // Currently zoomed in, zoom back out to fit
        currSlide.zoomTo(
          currSlide.zoomLevels.initial,
          { x: e.point.x, y: e.point.y },
          50,
        );
      }
    });

    // Add other event handlers as needed
    pswp.on('close', () => {
      console.log('PhotoSwipe closed');
    });
  };

  return (
    <div className={`photoswipe-image-container ${className}`}>
      <Gallery
        options={options}
        onBeforeOpen={handleBeforeOpen}
        onOpen={handleOpen}
      >
        <Item
          original={src}
          thumbnail={src}
          width={width}
          height={height}
          alt={alt}
        >
          {({ ref, open }) => (
            <div onClick={open} className="cursor-pointer">
              <Image
                ref={ref}
                src={src}
                alt={alt}
                width={thumbnailWidth}
                height={thumbnailHeight}
                className="h-auto w-full object-contain"
              />
            </div>
          )}
        </Item>
      </Gallery>
    </div>
  );
};

export default PhotoSwipeImageViewer;