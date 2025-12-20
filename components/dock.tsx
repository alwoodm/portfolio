'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = Readonly<{
  items: DockItemData[];
  className?: string;
  containerClassName?: string;
  position?: 'bottom' | 'top';
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
}>;

type DockItemProps = Readonly<{
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
}>;

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      aria-haspopup="true"
      className={`border-border bg-background/90 text-foreground relative inline-flex items-center justify-center rounded-full border-2 shadow-md backdrop-blur ${className}`}
      role="button"
      style={{
        width: size,
        height: size,
      }}
      tabIndex={0}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onFocus={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onHoverStart={() => isHovered.set(1)}
    >
      {Children.map(children, (child) =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, {
              isHovered,
            })
          : child,
      )}
    </motion.div>
  );
}

type DockLabelProps = Readonly<{
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
  position: 'bottom' | 'top';
}>;

function DockLabel({ children, className = '', isHovered, position }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  const placement = position === 'top' ? 'top-full mt-2' : '-top-6';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1, y: position === 'top' ? 10 : -10 }}
          className={`${className} border-border bg-background/90 text-foreground absolute left-1/2 w-fit rounded-md border px-2 py-0.5 text-xs whitespace-pre shadow-sm backdrop-blur ${placement}`}
          exit={{ opacity: 0, y: 0 }}
          initial={{ opacity: 0, y: 0 }}
          role="tooltip"
          style={{ x: '-50%' }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = Readonly<{
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
}>;

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  containerClassName = '',
  position = 'bottom',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const panelPosition = position === 'top' ? 'top-0 items-start' : 'bottom-2 items-end';
  const panelPadding = position === 'top' ? 'pt-2 pb-2' : 'pb-2 pt-2';

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [dockHeight, magnification],
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      className={`relative mx-2 flex max-w-full items-center justify-center ${containerClassName}`}
      style={{ height, scrollbarWidth: 'none' }}
    >
      <motion.div
        aria-label="Application dock"
        className={`${className} border-border bg-background/70 text-foreground absolute left-1/2 flex w-fit -translate-x-1/2 transform gap-4 rounded-2xl border-2 px-4 backdrop-blur ${panelPadding} ${panelPosition}`}
        role="toolbar"
        style={{ height: panelHeight }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            baseItemSize={baseItemSize}
            className={item.className}
            distance={distance}
            magnification={magnification}
            mouseX={mouseX}
            spring={spring}
            onClick={item.onClick}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel position={position}>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
