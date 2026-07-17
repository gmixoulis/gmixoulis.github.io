import React, { useEffect, useRef, useState } from 'react';

interface TypedProps {
  /** strings to cycle through */
  strings: string[];
  /** typing speed in ms per character */
  typeSpeed?: number;
  /** backspacing speed in ms per character */
  backSpeed?: number;
  /** pause in ms once a string is fully typed, before backspacing */
  backDelay?: number;
  /** loop back to the first string after the last */
  loop?: boolean;
}

/**
 * Lightweight, dependency-free typewriter effect. Replaces the abandoned
 * `react-typed` package, whose UMD build is not ESM-compatible and rendered
 * as an invalid element type under Vite.
 */
const Typed: React.FC<TypedProps> = ({
  strings,
  typeSpeed = 60,
  backSpeed = 50,
  backDelay = 1500,
  loop = true,
}) => {
  const [text, setText] = useState('');
  const stringIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    if (strings.length === 0) return;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = strings[stringIndex.current];

      if (!deleting.current) {
        charIndex.current += 1;
        setText(current.slice(0, charIndex.current));
        if (charIndex.current === current.length) {
          const atEnd = stringIndex.current === strings.length - 1;
          if (atEnd && !loop) return;
          deleting.current = true;
          timer = setTimeout(tick, backDelay);
          return;
        }
        timer = setTimeout(tick, typeSpeed);
      } else {
        charIndex.current -= 1;
        setText(current.slice(0, charIndex.current));
        if (charIndex.current === 0) {
          deleting.current = false;
          stringIndex.current = (stringIndex.current + 1) % strings.length;
        }
        timer = setTimeout(tick, backSpeed);
      }
    };

    timer = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strings.join('|'), typeSpeed, backSpeed, backDelay, loop]);

  return (
    <span>
      {text}
      <span className="typed-cursor" aria-hidden="true">|</span>
    </span>
  );
};

export default Typed;
