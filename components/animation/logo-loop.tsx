'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LogoNodeItem = {
  node: React.ReactNode;
  href?: string;
  title?: string;
  ariaLabel?: string;
};

export type LogoImageItem = {
  src: string;
  alt?: string;
  href?: string;
  title?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

export type LogoItem = LogoNodeItem | LogoImageItem;

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === 'number' ? `${value}px` : value;

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

const isNodeItem = (item: LogoItem): item is LogoNodeItem => 'node' in item;
const isImageItem = (item: LogoItem): item is LogoImageItem => 'src' in item;

type LogoLoopDeps = Readonly<{
  logos: LogoItem[];
  gap: number;
  logoHeight: number;
  isVertical: boolean;
}>;

const useResizeObserver = (
  callback: () => void,
  elements: Array<React.RefObject<Element | null>>,
  deps: LogoLoopDeps,
) => {
  useEffect(() => {
    const windowRef = globalThis.window;
    if (!windowRef) return;

    if (!windowRef.ResizeObserver) {
      const handleResize = () => callback();
      windowRef.addEventListener('resize', handleResize);
      callback();
      return () => windowRef.removeEventListener('resize', handleResize);
    }

    const observers: ResizeObserver[] = [];
    for (const ref of elements) {
      const element = ref.current;
      if (!element) continue;
      const observer = new ResizeObserver(callback);
      observer.observe(element);
      observers.push(observer);
    }

    callback();

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, [callback, elements, deps.gap, deps.isVertical, deps.logoHeight, deps.logos]);
};

const useImageLoader = (
  seqRef: React.RefObject<HTMLUListElement | null>,
  onLoad: () => void,
  deps: LogoLoopDeps,
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    for (const image of images) {
      const htmlImg = image as HTMLImageElement;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    }

    return () => {
      for (const image of images) {
        image.removeEventListener('load', handleImageLoad);
        image.removeEventListener('error', handleImageLoad);
      }
    };
  }, [onLoad, seqRef, deps.gap, deps.isVertical, deps.logoHeight, deps.logos]);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  seqHeight: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
  isVertical: boolean,
) => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const windowRef = globalThis.window;
    const prefersReduced =
      !!windowRef &&
      windowRef.matchMedia &&
      windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = transformValue;
    }

    if (prefersReduced) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return () => {
        lastTimestampRef.current = null;
      };
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;

        const transformValue = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
        track.style.transform = transformValue;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef]);
};

export const LogoLoop = React.memo<LogoLoopProps>(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = 'Partner logos',
    className,
    style,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState<number>(0);
    const [seqHeight, setSeqHeight] = useState<number>(0);
    const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const effectiveHoverSpeed = useMemo(() => {
      const resolved = hoverSpeed;
      if (resolved !== undefined) return resolved;
      if (pauseOnHover === true) return 0;
      return resolved;
    }, [hoverSpeed, pauseOnHover]);
    const hoverEnabled = effectiveHoverSpeed !== undefined;

    const isVertical = direction === 'up' || direction === 'down';

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      let directionMultiplier: number;
      if (isVertical) {
        directionMultiplier = direction === 'up' ? 1 : -1;
      } else {
        directionMultiplier = direction === 'left' ? 1 : -1;
      }
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceRect = seqRef.current?.getBoundingClientRect?.();
      const sequenceWidth = sequenceRect?.width ?? 0;
      const sequenceHeight = sequenceRect?.height ?? 0;
      if (isVertical) {
        const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
        if (containerRef.current && parentHeight > 0) {
          const targetHeight = Math.ceil(parentHeight);
          if (containerRef.current.style.height !== `${targetHeight}px`) {
            containerRef.current.style.height = `${targetHeight}px`;
          }
        }
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight));
          const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
          const copiesNeeded =
            Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, [isVertical]);

    const observedElements = useMemo(() => [containerRef, seqRef], []);
    const observerDeps = useMemo(
      () => ({
        gap,
        isVertical,
        logoHeight,
        logos,
      }),
      [gap, isVertical, logoHeight, logos],
    );

    useResizeObserver(updateDimensions, observedElements, observerDeps);

    useImageLoader(seqRef, updateDimensions, observerDeps);

    useAnimationLoop(
      trackRef,
      targetVelocity,
      seqWidth,
      seqHeight,
      isHovered,
      effectiveHoverSpeed,
      isVertical,
    );

    const cssVariables = useMemo(
      () =>
        ({
          '--logoloop-gap': `${gap}px`,
          '--logoloop-logoHeight': `${logoHeight}px`,
          ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
        }) as React.CSSProperties,
      [gap, logoHeight, fadeOutColor],
    );

    const rootClasses = useMemo(
      () =>
        cx(
          'relative group',
          isVertical ? 'overflow-hidden h-full inline-block' : 'overflow-x-hidden',
          '[--logoloop-gap:32px]',
          '[--logoloop-logoHeight:28px]',
          '[--logoloop-fadeColorAuto:#ffffff]',
          'dark:[--logoloop-fadeColorAuto:#0b0b0b]',
          scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]',
          className,
        ),
      [isVertical, scaleOnHover, className],
    );

    const handleHoverStart = useCallback(() => {
      if (hoverEnabled) setIsHovered(true);
    }, [hoverEnabled]);
    const handleHoverEnd = useCallback(() => {
      if (hoverEnabled) setIsHovered(false);
    }, [hoverEnabled]);

    const renderLogoItem = useCallback(
      (item: LogoItem, key: React.Key) => {
        if (renderItem) {
          return (
            <li
              key={key}
              className={cx(
                'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
                isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]',
                scaleOnHover && 'group/item overflow-visible',
              )}
              role="listitem"
              onBlur={handleHoverEnd}
              onFocus={handleHoverStart}
              onPointerEnter={handleHoverStart}
              onPointerLeave={handleHoverEnd}
            >
              {renderItem(item, key)}
            </li>
          );
        }

        const hasNode = isNodeItem(item);
        const hasImage = isImageItem(item);
        if (!hasNode && !hasImage) return null;

        const href = item.href;
        const itemTitle = item.title;

        const content = hasNode ? (
          <span
            aria-hidden={Boolean(href) && !item.ariaLabel}
            className={cx(
              'inline-flex items-center',
              'motion-reduce:transition-none',
              scaleOnHover &&
                'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120',
            )}
          >
            {item.node}
          </span>
        ) : (
          <Image
            unoptimized
            alt={item.alt ?? ''}
            className={cx(
              'block h-[var(--logoloop-logoHeight)] w-auto object-contain',
              'pointer-events-none [-webkit-user-drag:none]',
              '[image-rendering:-webkit-optimize-contrast]',
              'motion-reduce:transition-none',
              scaleOnHover &&
                'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120',
            )}
            height={item.height ?? logoHeight}
            loading="lazy"
            sizes={item.sizes}
            src={item.src}
            title={itemTitle}
            width={item.width ?? logoHeight}
          />
        );

        const itemAriaLabel = hasNode ? (item.ariaLabel ?? itemTitle) : (item.alt ?? itemTitle);

        const inner = href ? (
          <a
            aria-label={itemAriaLabel || 'logo link'}
            className={cx(
              'inline-flex items-center rounded no-underline',
              'transition-opacity duration-200 ease-linear',
              'hover:opacity-80',
              'focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-current',
            )}
            href={href}
            rel="noreferrer noopener"
            target="_blank"
          >
            {content}
          </a>
        ) : (
          content
        );

        return (
          <li
            key={key}
            className={cx(
              'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
              isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]',
              scaleOnHover && 'group/item overflow-visible',
            )}
            role="listitem"
            onBlur={handleHoverEnd}
            onFocus={handleHoverStart}
            onPointerEnter={handleHoverStart}
            onPointerLeave={handleHoverEnd}
          >
            {inner}
          </li>
        );
      },
      [handleHoverEnd, handleHoverStart, isVertical, logoHeight, renderItem, scaleOnHover],
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            key={`copy-${copyIndex}`}
            ref={copyIndex === 0 ? seqRef : undefined}
            aria-hidden={copyIndex > 0}
            className={cx('flex items-center', isVertical && 'flex-col')}
            role="list"
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem, isVertical],
    );

    const containerStyle = useMemo((): React.CSSProperties => {
      const resolvedWidth = toCssLength(width);
      let computedWidth: string | undefined;
      if (isVertical) {
        if (resolvedWidth && resolvedWidth !== '100%') {
          computedWidth = resolvedWidth;
        }
      } else {
        computedWidth = resolvedWidth ?? '100%';
      }

      return {
        width: computedWidth,
        ...cssVariables,
        ...style,
      };
    }, [width, cssVariables, style, isVertical]);

    return (
      <div
        ref={containerRef}
        aria-label={ariaLabel}
        className={rootClasses}
        role="region"
        style={containerStyle}
      >
        {fadeOut ? (
          <>
            {isVertical ? (
              <>
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-x-0 top-0 z-10',
                    'h-[clamp(24px,8%,120px)]',
                    'bg-[linear-gradient(to_bottom,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]',
                  )}
                />
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-x-0 bottom-0 z-10',
                    'h-[clamp(24px,8%,120px)]',
                    'bg-[linear-gradient(to_top,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]',
                  )}
                />
              </>
            ) : (
              <>
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-y-0 left-0 z-10',
                    'w-[clamp(24px,8%,120px)]',
                    'bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]',
                  )}
                />
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-y-0 right-0 z-10',
                    'w-[clamp(24px,8%,120px)]',
                    'bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]',
                  )}
                />
              </>
            )}
          </>
        ) : null}

        <div
          ref={trackRef}
          className={cx(
            'relative z-0 flex will-change-transform select-none',
            'motion-reduce:transform-none',
            isVertical ? 'h-max w-full flex-col' : 'w-max flex-row',
          )}
          onMouseEnter={handleHoverStart}
          onMouseLeave={handleHoverEnd}
        >
          {logoLists}
        </div>
      </div>
    );
  },
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;
