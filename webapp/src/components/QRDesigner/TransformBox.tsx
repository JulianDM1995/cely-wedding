import React, { useRef, useState, useEffect } from 'react';

interface TransformBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => { x: number, y: number } | void;
  onDragEnd?: (x: number, y: number) => void;
  onResizeStart?: () => void;
  onResize?: (w: number, h: number) => void;
  onResizeEnd?: (w: number, h: number, x: number, y: number) => void;
  onRotateStart?: () => void;
  onRotateEnd?: (deg: number) => void;
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  lockAspectRatio?: boolean;
  customHandles?: React.ReactNode;
}

export const TransformBox: React.FC<TransformBoxProps> = ({
  x, y, width, height, rotation,
  onDragStart, onDrag, onDragEnd,
  onResizeStart, onResize, onResizeEnd,
  onRotateStart, onRotateEnd,
  selected, onSelect, children, lockAspectRatio, customHandles
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [action, setAction] = useState<'drag' | 'resize' | 'rotate' | null>(null);
  const [startState, setStartState] = useState<{
    mouseX: number; mouseY: number; x: number; y: number; w: number; h: number; r: number; handle?: string; startAngle?: number;
  } | null>(null);

  // Local state for 60fps interaction without waiting for context
  const [local, setLocal] = useState({ x, y, w: width, h: height, r: rotation });

  useEffect(() => {
    if (!action) {
      setLocal({ x, y, w: width, h: height, r: rotation });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y, width, height, rotation]);

  useEffect(() => {
    if (!action || !startState) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - startState.mouseX;
      const dy = e.clientY - startState.mouseY;

      if (action === 'drag') {
        const newX = startState.x + dx;
        const newY = startState.y + dy;
        const res = onDrag?.(newX, newY);
        setLocal(prev => ({ ...prev, x: res?.x ?? newX, y: res?.y ?? newY }));
      } else if (action === 'rotate') {
        const rect = boxRef.current!.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
        
        let deltaAngle = currentAngle - (startState.startAngle || 0);
        let deg = startState.r + (deltaAngle * 180) / Math.PI;
        
        // Normalize degrees to 0-360
        deg = deg % 360;
        if (deg < 0) deg += 360;
        
        // Snapping logic
        let val = Math.round(deg);
        const remainder = val % 45;
        if (remainder < 7) val = val - remainder;
        else if (remainder > 38) val = val + (45 - remainder);
        if (val >= 360) val = 0;
        
        setLocal(prev => ({ ...prev, r: val }));
      } else if (action === 'resize') {
        const handle = startState.handle;
        if (!handle) return;

        // Unrotate the mouse movement
        const rad = (-startState.r * Math.PI) / 180;
        const udx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const udy = dx * Math.sin(rad) + dy * Math.cos(rad);

        let newW = startState.w;
        let newH = startState.h;

        // Calculate independent new width and height based on mouse drag
        if (handle.includes('e')) newW = startState.w + udx;
        if (handle.includes('w')) newW = startState.w - udx;
        if (handle.includes('s')) newH = startState.h + udy;
        if (handle.includes('n')) newH = startState.h - udy;

        // Apply aspect ratio constraints
        if (lockAspectRatio) {
          const ratio = startState.w / startState.h;
          // If dragging East or West, let Width drive Height. Otherwise, let Height drive Width.
          if (handle.includes('e') || handle.includes('w')) {
            if (newW < 10) newW = 10;
            newH = newW / ratio;
          } else {
            if (newH < 10) newH = 10;
            newW = newH * ratio;
          }
        } else {
          if (newW < 10) newW = 10;
          if (newH < 10) newH = 10;
        }

        // Calculate how much the width and height actually changed
        const dW = newW - startState.w;
        const dH = newH - startState.h;

        // Determine the unrotated shift of the top-left corner (origin)
        const unrotShiftX = handle.includes('w') ? -dW : 0;
        const unrotShiftY = handle.includes('n') ? -dH : 0;

        // The old center in global coordinates
        const oldCx = startState.x + startState.w / 2;
        const oldCy = startState.y + startState.h / 2;

        // How much the center shifted in UNROTATED local coordinates
        const localDcx = unrotShiftX + dW / 2;
        const localDcy = unrotShiftY + dH / 2;

        // Rotate that center shift into GLOBAL coordinates
        const radGlobal = (startState.r * Math.PI) / 180;
        const globalDcx = localDcx * Math.cos(radGlobal) - localDcy * Math.sin(radGlobal);
        const globalDcy = localDcx * Math.sin(radGlobal) + localDcy * Math.cos(radGlobal);

        // The new center in global coordinates
        const newCx = oldCx + globalDcx;
        const newCy = oldCy + globalDcy;

        // CSS positioning targets the top-left of the bounding box!
        const newX = newCx - newW / 2;
        const newY = newCy - newH / 2;

        setLocal({ x: newX, y: newY, w: newW, h: newH, r: local.r });
        onResize?.(newW, newH);
      }
    };

    const handleMouseUp = () => {

      if (action === 'drag') onDragEnd?.(local.x, local.y);
      if (action === 'resize') onResizeEnd?.(local.w, local.h, local.x, local.y);
      if (action === 'rotate') onRotateEnd?.(local.r);
      
      if (action) {
        // Prevent the immediate click event that fires after mouseup
        const captureClick = (evt: MouseEvent) => {
          evt.stopPropagation();
          window.removeEventListener('click', captureClick, true);
        };
        window.addEventListener('click', captureClick, true);
        setTimeout(() => window.removeEventListener('click', captureClick, true), 50);
      }

      setAction(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [action, startState, local.x, local.y, local.w, local.h, local.r, lockAspectRatio, onDrag, onDragEnd, onResize, onResizeEnd, onRotateEnd]);

  // Handle global cursor style separately to prevent DOM thrashing
  useEffect(() => {
    if (!action) {
      const existingStyle = document.getElementById('dynamic-cursor-style');
      if (existingStyle) existingStyle.remove();
      return;
    }

    let styleEl = document.getElementById('dynamic-cursor-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-cursor-style';
      document.head.appendChild(styleEl);
    }

    if (action === 'rotate' && startState?.handle) {
      styleEl.innerHTML = `* { cursor: ${getCursor(startState.handle, local.r)} !important; }`;
    } else if (action === 'drag') {
      styleEl.innerHTML = `* { cursor: move !important; }`;
    } else if (action === 'resize' && startState?.handle) {
      const cursor = getResizeCursor(startState.handle, local.r);
      styleEl.innerHTML = `* { cursor: ${cursor} !important; }`;
    }

    return () => {
      const existing = document.getElementById('dynamic-cursor-style');
      if (existing) existing.remove();
    };
  }, [action, startState?.handle, local.r]);

  const handlePointerDown = (e: React.MouseEvent, type: 'drag' | 'resize' | 'rotate', handle?: string) => {
    e.stopPropagation();
    onSelect(e);
    if (type === 'drag') onDragStart?.();
    if (type === 'resize') onResizeStart?.();
    if (type === 'rotate') onRotateStart?.();

    let startAngle = 0;
    if (type === 'rotate') {
      const rect = boxRef.current!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
    }

    setStartState({
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: local.x, y: local.y, w: local.w, h: local.h, r: local.r, handle,
      startAngle
    });
    setAction(type);
  };

  return (
    <div
      ref={boxRef}
      onMouseDown={(e) => handlePointerDown(e, 'drag')}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: local.x,
        top: local.y,
        width: local.w,
        height: local.h,
        transform: `rotate(${local.r}deg)`,
        transformOrigin: '50% 50%',
        cursor: selected ? 'move' : 'pointer',
        boxShadow: selected ? 'none' : '0 0 0 1px #000000',
        outline: selected ? '2px solid var(--theme-primary-500, #0069ff)' : '1px dashed #ffffff',
        zIndex: selected ? 10 : 2,
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      {selected && (
        <>
          {/* Custom Handles inside the rotated space */}
          {customHandles}

          {/* Rotation Handles */}
          <div onMouseDown={(e) => handlePointerDown(e, 'rotate', 'nw')} onClick={(e) => e.stopPropagation()} style={rotateHandleStyle('nw', local.r)} title="Rotate" />
          <div onMouseDown={(e) => handlePointerDown(e, 'rotate', 'ne')} onClick={(e) => e.stopPropagation()} style={rotateHandleStyle('ne', local.r)} title="Rotate" />
          <div onMouseDown={(e) => handlePointerDown(e, 'rotate', 'sw')} onClick={(e) => e.stopPropagation()} style={rotateHandleStyle('sw', local.r)} title="Rotate" />
          <div onMouseDown={(e) => handlePointerDown(e, 'rotate', 'se')} onClick={(e) => e.stopPropagation()} style={rotateHandleStyle('se', local.r)} title="Rotate" />
          {/* Resize Handles */}
          <div onMouseDown={(e) => handlePointerDown(e, 'resize', 'nw')} onClick={(e) => e.stopPropagation()} style={handleStyle('nw', local.r)} />
          <div onMouseDown={(e) => handlePointerDown(e, 'resize', 'ne')} onClick={(e) => e.stopPropagation()} style={handleStyle('ne', local.r)} />
          <div onMouseDown={(e) => handlePointerDown(e, 'resize', 'sw')} onClick={(e) => e.stopPropagation()} style={handleStyle('sw', local.r)} />
          <div onMouseDown={(e) => handlePointerDown(e, 'resize', 'se')} onClick={(e) => e.stopPropagation()} style={handleStyle('se', local.r)} />
          
          {!lockAspectRatio && (
            <>
              <div onMouseDown={(e) => handlePointerDown(e, 'resize', 'n')} onClick={(e) => e.stopPropagation()} style={handleStyle('n', local.r)} />
              <div onMouseDown={(e) => handlePointerDown(e, 'resize', 's')} onClick={(e) => e.stopPropagation()} style={handleStyle('s', local.r)} />
              <div onMouseDown={(e) => handlePointerDown(e, 'resize', 'e')} onClick={(e) => e.stopPropagation()} style={handleStyle('e', local.r)} />
              <div onMouseDown={(e) => handlePointerDown(e, 'resize', 'w')} onClick={(e) => e.stopPropagation()} style={handleStyle('w', local.r)} />
            </>
          )}
        </>
      )}

      {/* Content */}
      <div style={{ width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
};

const handleStyle = (pos: string, currentRotation: number): React.CSSProperties => {
  const size = 12;
  const offset = -size / 2;
  const base: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    backgroundColor: 'white',
    border: '2px solid var(--theme-primary-500, #0069ff)',
    zIndex: 11,
  };
  if (pos.includes('n')) base.top = offset;
  if (pos.includes('s')) base.bottom = offset;
  if (pos.includes('w')) base.left = offset;
  if (pos.includes('e')) base.right = offset;
  if (pos === 'n' || pos === 's') { base.left = '50%'; base.transform = 'translateX(-50%)'; }
  if (pos === 'w' || pos === 'e') { base.top = '50%'; base.transform = 'translateY(-50%)'; }
  base.cursor = getResizeCursor(pos, currentRotation);
  return base;
};

const getResizeCursor = (pos: string, rotation: number) => {
  let baseAngle = 0;
  if (pos === 'e') baseAngle = 0;
  if (pos === 'se') baseAngle = 45;
  if (pos === 's') baseAngle = 90;
  if (pos === 'sw') baseAngle = 135;
  if (pos === 'w') baseAngle = 180;
  if (pos === 'nw') baseAngle = 225;
  if (pos === 'n') baseAngle = 270;
  if (pos === 'ne') baseAngle = 315;

  let totalAngle = (baseAngle + rotation) % 360;
  if (totalAngle < 0) totalAngle += 360;

  const sector = Math.round(totalAngle / 45) % 8;
  const cursors = [
    'ew-resize',
    'nwse-resize',
    'ns-resize',
    'nesw-resize',
    'ew-resize',
    'nwse-resize',
    'ns-resize',
    'nesw-resize',
  ];

  return cursors[sector];
};

const getCursor = (pos: string, rotation: number) => {
  let baseAngle = 0;
  if (pos === 'nw') baseAngle = 0;
  if (pos === 'ne') baseAngle = 90;
  if (pos === 'se') baseAngle = 180;
  if (pos === 'sw') baseAngle = 270;
  
  const totalAngle = (baseAngle + rotation) % 360;
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g transform='rotate(${totalAngle} 12 12)'><path d='M 8,15.5 A 8,8 0 0,1 15.5,8' stroke='white' stroke-width='4.5' fill='none' stroke-linecap='butt' /><polygon points='5,15.5 11,15.5 8,22' fill='white' stroke='white' stroke-width='2' stroke-linejoin='round' /><polygon points='15.5,5 15.5,11 22,8' fill='white' stroke='white' stroke-width='2' stroke-linejoin='round' /><path d='M 8,15.5 A 8,8 0 0,1 15.5,8' stroke='black' stroke-width='1.8' fill='none' stroke-linecap='butt' /><polygon points='5.5,15.5 10.5,15.5 8,21' fill='black' /><polygon points='15.5,5.5 15.5,10.5 21,8' fill='black' /></g></svg>`;
  
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 12 12, crosshair`;
};

const rotateHandleStyle = (pos: string, currentRotation: number): React.CSSProperties => {
  const size = 24;
  const offset = -20;
  const base: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    backgroundColor: 'transparent',
    borderRadius: '50%',
    zIndex: 10,
    cursor: getCursor(pos, currentRotation),
  };
  if (pos.includes('n')) base.top = offset;
  if (pos.includes('s')) base.bottom = offset;
  if (pos.includes('w')) base.left = offset;
  if (pos.includes('e')) base.right = offset;
  return base;
};
