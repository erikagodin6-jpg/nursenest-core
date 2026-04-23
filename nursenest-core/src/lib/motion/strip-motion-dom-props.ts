const MOTION_DOM_PROP_KEYS = new Set([
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileInView",
  "whileFocus",
  "whileDrag",
  "viewport",
  "layout",
  "layoutId",
  "layoutRoot",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragSnapToOrigin",
  "dragTransition",
  "dragDirectionLock",
  "dragPropagation",
  "dragControls",
  "dragListener",
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onDirectionLock",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onHoverStart",
  "onHoverEnd",
  "onTapStart",
  "onTap",
  "onTapCancel",
  "onPan",
  "onPanStart",
  "onPanEnd",
  "onPanSessionStart",
  "custom",
  "inherit",
]);

/** Remove Framer Motion-specific props before spreading onto a plain DOM element. */
export function stripMotionDomProps<T extends Record<string, unknown>>(props: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (!MOTION_DOM_PROP_KEYS.has(key)) out[key] = props[key];
  }
  return out;
}
