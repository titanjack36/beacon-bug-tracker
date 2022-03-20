import React, { useEffect, useRef, useState } from "react";

export type ResizableDirection = 'north' | 'south' | 'east' | 'west';

export type ResizableConfig = {
  initialWidth?: string;
  initialHeight?: string;
  directions: ResizableDirection[];
};

type ResizableProps = { 
  config: ResizableConfig;
  onSizeChange?: (newWidth: number, newHeight: number) => void;
} & React.AllHTMLAttributes<HTMLDivElement>;

type SliderStyles = {
  [key: string]: React.CSSProperties;
}

const initSliderStyles: SliderStyles = {
  north: { position: 'absolute', top: 0, left: 0 },
  south: { position: 'absolute', bottom: 0, left: 0 },
  east: { position: 'absolute', top: 0, right: 0 },
  west: { position: 'absolute', top: 0, left: 0 }
};

const initResizableStyles: React.CSSProperties = {
  position: 'relative',
  flexShrink: '0'
};

export default function Resizable(
    { config, onSizeChange, children, style, ...props }: ResizableProps) {

  const { initialWidth, initialHeight, directions } = config;

  const resizableElRef = useRef<HTMLDivElement>(null);
  const [resizableStyles, setResizableStyles] = useState<React.CSSProperties>({
    ...initResizableStyles, width: initialWidth, height: initialHeight, ...style });
  const [sliderStyles, setSliderStyles] = useState<SliderStyles>(initSliderStyles);
  const [dragDirection, setDragDirection] = useState<ResizableDirection | undefined>(undefined);

  useEffect(() => {
    setResizableStyles({...resizableStyles, ...style })
  }, [style]);

  useEffect(() => {
    const resizableEl = resizableElRef.current;
    if (resizableEl) {
      const resizeObs = new ResizeObserver(() => {
        const { width, height } = resizableEl!.getBoundingClientRect();
        setSliderStyles({
          north: { ...sliderStyles.north, width },
          south: { ...sliderStyles.south, width },
          east: { ...sliderStyles.east, height },
          west: { ...sliderStyles.west, height },
        });
      });
      resizeObs.observe(resizableEl);
  
      return () => resizeObs.unobserve(resizableEl);
    }
  }, [resizableElRef]);

  const onMouseDrag = (event: MouseEvent) => {
    event.preventDefault();
    const { top, bottom, right, left, height, width } = resizableElRef.current!.getBoundingClientRect();
    let newWidth = width, newHeight = height;
    switch (dragDirection) {
      case 'north':
        newHeight = bottom - event.clientY;
        break;
      case 'south':
        newHeight = top - event.clientY;
        break;
      case 'east':
        newWidth = left - event.clientX;
        break;
      case 'west':
        newWidth = right - event.clientX;
        break;
    }
    if (typeof onSizeChange === 'function') {
      onSizeChange(newWidth, newHeight);
    }
    if (newWidth !== width) {
      setResizableStyles({ ...resizableStyles, width: `${newWidth}px` });
    }
    if (newHeight != height) {
      setResizableStyles({ ...resizableStyles, height: `${newHeight}px` });
    }
  }

  const onStartDrag = (direction: ResizableDirection) => {
    setDragDirection(direction);
  };

  const onStopDrag = (_: MouseEvent) => {
    setDragDirection(undefined);
  }

  useEffect(() => {
    if (dragDirection) {
      window.addEventListener('mousemove', onMouseDrag);
      window.addEventListener('mouseup', onStopDrag);

      return () => {
        window.removeEventListener('mousemove', onMouseDrag);
        window.removeEventListener('mouseup', onStopDrag);
      };
    }
    // any state or prop used inside event listener must be added to dependency array
  }, [dragDirection]);

  if (!children) {
    return null;
  }

  return (
    <div className="resizable" ref={resizableElRef} style={resizableStyles} {...props} >
      {
        directions.map(direction => (
          <div key={direction} className={`slider slider-${direction}`} style={sliderStyles[direction]} 
              onMouseDown={() => onStartDrag(direction)} />
        ))
      }
      {children}
    </div>
  );
}