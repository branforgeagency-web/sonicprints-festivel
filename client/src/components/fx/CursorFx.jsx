import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import useMotionProfile from "../../anim/useMotionProfile.js";
import { SPRING_CURSOR } from "../../anim/tokens.js";

/* ============================================================
   Custom cursor (desktop, fine pointer only)
   A small dot with a trailing ring. Over anything clickable the
   ring opens up and warms; over a product it becomes a
   "VIEW PRODUCT →" badge. Any element can override the label
   with data-cursor-label. Never runs on touch devices, and
   never hides the native cursor unless this has mounted.
   ============================================================ */

const INTERACTIVE = "a,button,[role=button],input,select,textarea,label,summary,[data-cursor]";

export default function CursorFx() {
  return null;
}
