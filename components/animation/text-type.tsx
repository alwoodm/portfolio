'use client';

import { gsap } from 'gsap';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ElementType, HTMLAttributes, ReactNode } from 'react';

type TextTypeProps = Readonly<{
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}>;

type TextTypeComponentProps = TextTypeProps & HTMLAttributes<HTMLElement>;

const getSecureRandom = (min: number, max: number) => {
  if (max <= min) return min;
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const maxUint32 = 4_294_967_295;
    const fraction = array[0] / maxUint32;
    return min + fraction * (max - min);
  }
  return min;
};

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeComponentProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    return getSecureRandom(variableSpeed.min, variableSpeed.max);
  }, [variableSpeed, typingSpeed]);

  const currentTextColor =
    textColors.length > 0 ? textColors[currentTextIndex % textColors.length] : undefined;

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            break;
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!showCursor || !cursorRef.current) return;

    gsap.set(cursorRef.current, { opacity: 1 });
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });
  }, [cursorBlinkDuration, showCursor]);

  useEffect(() => {
    if (!isVisible || textArray.length === 0) return;

    const currentText = textArray[currentTextIndex] ?? '';
    const processedText = reverseMode ? [...currentText].toReversed().join('') : currentText;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const schedule = (fn: () => void, delay: number) => {
      timeout = setTimeout(fn, delay);
    };

    const completeSentence = () => {
      if (onSentenceComplete) {
        onSentenceComplete(textArray[currentTextIndex] ?? '', currentTextIndex);
      }
    };

    const handleDeletion = () => {
      if (displayedText.length === 0) {
        setIsDeleting(false);

        if (currentTextIndex === textArray.length - 1 && !loop) {
          return;
        }

        completeSentence();
        setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
        setCurrentCharIndex(0);
        return;
      }

      const nextText = displayedText.slice(0, -1);
      schedule(() => {
        setDisplayedText(nextText);
      }, deletingSpeed);
    };

    const handleTyping = () => {
      if (currentCharIndex < processedText.length) {
        const nextText = displayedText + processedText[currentCharIndex];
        const nextCharIndex = currentCharIndex + 1;
        schedule(
          () => {
            setDisplayedText(nextText);
            setCurrentCharIndex(nextCharIndex);
          },
          variableSpeed ? getRandomSpeed() : typingSpeed,
        );
        return;
      }

      if (!loop && currentTextIndex === textArray.length - 1) return;
      schedule(() => setIsDeleting(true), pauseDuration);
    };

    const execute = () => {
      if (isDeleting) {
        handleDeletion();
        return;
      }
      handleTyping();
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText.length === 0) {
      schedule(execute, initialDelay);
    } else {
      execute();
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    currentCharIndex,
    currentTextIndex,
    deletingSpeed,
    displayedText,
    getRandomSpeed,
    initialDelay,
    isDeleting,
    isVisible,
    loop,
    onSentenceComplete,
    pauseDuration,
    reverseMode,
    textArray,
    typingSpeed,
    variableSpeed,
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < (textArray[currentTextIndex]?.length ?? 0) || isDeleting);

  const ComponentTag = Component;

  return (
    <ComponentTag
      className={`inline-block tracking-tight whitespace-pre-wrap ${className}`}
      {...props}
    >
      <span ref={containerRef}>
        <span className="inline" style={{ color: currentTextColor || 'inherit' }}>
          {displayedText}
        </span>
        {showCursor ? (
          <span
            ref={cursorRef}
            className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}
          >
            {cursorCharacter}
          </span>
        ) : null}
      </span>
    </ComponentTag>
  );
};

export default TextType;
