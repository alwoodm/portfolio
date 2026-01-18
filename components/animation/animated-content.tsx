'use client';

import { useEffect, useRef } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';

import type { HTMLAttributes, ReactNode } from 'react';

type GsapBundle = {
  gsap: GSAP;
  ScrollTrigger: typeof ScrollTrigger;
};

let gsapLoader: Promise<GsapBundle> | null = null;

async function loadGsap() {
  if (!gsapLoader) {
    gsapLoader = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => {
        const { gsap } = gsapModule;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      },
    );
  }

  return gsapLoader;
}

type AnimatedContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  container?: Element | string | null;
  disableOnMobile?: boolean;
  trigger?: 'scroll' | 'load';
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
};

const AnimatedContent = ({
  children,
  container,
  disableOnMobile = false,
  trigger = 'scroll',
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power3.in',
  onComplete,
  onDisappearanceComplete,
  className = '',
  ...props
}: AnimatedContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disableOnMobile && isMobile) {
      el.style.transform = 'translate3d(0, 0, 0) scale(1)';
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      return;
    }

    let scrollerTarget: Element | string | null =
      container || document.querySelector('#snap-main-container');

    if (typeof scrollerTarget === 'string') {
      scrollerTarget = document.querySelector(scrollerTarget);
    }

    const axis = direction === 'horizontal' ? 'x' : 'y';
    const offset = reverse ? -distance : distance;
    const startPct = (1 - threshold) * 100;

    const translate =
      axis === 'x' ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`;
    el.style.transform = `${translate} scale(${scale})`;
    el.style.opacity = animateOpacity ? String(initialOpacity) : '1';
    el.style.visibility = 'visible';

    let active = true;
    let cleanup = () => {};

    const setupAnimation = async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (!active) return;

      const handleTimelineComplete = () => {
        if (onComplete) {
          onComplete();
        }
        if (disappearAfter > 0) {
          gsap.to(el, {
            [axis]: reverse ? distance : -distance,
            scale: 0.8,
            opacity: animateOpacity ? initialOpacity : 0,
            delay: disappearAfter,
            duration: disappearDuration,
            ease: disappearEase,
            onComplete: onDisappearanceComplete,
          });
        }
      };

      const tl = gsap.timeline({
        paused: true,
        delay,
        onComplete: handleTimelineComplete,
      });

      tl.to(el, {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease,
      });

      let st: ScrollTrigger | null = null;

      if (trigger === 'scroll') {
        const defaultScroller = globalThis.window || undefined;
        st = ScrollTrigger.create({
          trigger: el,
          scroller: scrollerTarget ?? defaultScroller,
          start: `top ${startPct}%`,
          once: true,
          onEnter: () => tl.play(),
        });
      } else {
        tl.play();
      }

      cleanup = () => {
        st?.kill();
        tl.kill();
      };
    };

    void setupAnimation();

    return () => {
      active = false;
      cleanup();
    };
  }, [
    container,
    distance,
    direction,
    disableOnMobile,
    trigger,
    reverse,
    isMobile,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    disappearAfter,
    disappearDuration,
    disappearEase,
    onComplete,
    onDisappearanceComplete,
  ]);

  return (
    <div ref={ref} className={`invisible ${className}`} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;
