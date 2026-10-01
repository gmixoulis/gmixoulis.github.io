import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface CarouselProps {
  /** slide contents; each is wrapped in an .embla__slide element */
  slides: React.ReactNode[];
  /** autoplay interval in ms; set to 0 to disable */
  autoplayDelay?: number;
  /** extra class on the root (controls slides-per-view via CSS) */
  className?: string;
}

/**
 * Lightweight, reliable carousel built on Embla. Replaces the abandoned
 * react-alice-carousel, whose CJS default export broke under Vite 8 and whose
 * slide sizing let images overflow their slots. Slides-per-view and square
 * sizing are controlled with CSS (see `.embla` rules in style.scss).
 */
const Carousel: React.FC<CarouselProps> = ({ slides, autoplayDelay = 2500, className = '' }) => {
  const plugins = autoplayDelay > 0
    ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true })]
    : [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', dragFree: false }, plugins);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={`embla ${className}`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, i) => (
            <div className="embla__slide" key={i}>{slide}</div>
          ))}
        </div>
      </div>
      <button type="button" className="embla__arrow embla__arrow--prev" onClick={scrollPrev} aria-label="Previous">
        <i className="fa fa-angle-left" />
      </button>
      <button type="button" className="embla__arrow embla__arrow--next" onClick={scrollNext} aria-label="Next">
        <i className="fa fa-angle-right" />
      </button>
    </div>
  );
};

export default Carousel;
