import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";

/**
 * AdminShortcutListener component
 * Listens for global keyboard shortcuts to open the Executive Admin Suite:
 * - Ctrl + Shift + A (or Cmd + Shift + A on Mac)
 * - Alt + A (or Option + A on Mac)
 */
export default function AdminShortcutListener() {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    function handleKeyDown(e) {
      // Check if user pressed Ctrl+Shift+A, Cmd+Shift+A, or Alt+A / Option+A
      const isCtrlShiftA = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "a" || e.key === "A");
      const isAltA = e.altKey && (e.key === "a" || e.key === "A");

      if (isCtrlShiftA || isAltA) {
        // Do not interrupt if user is actively typing in a form input or textarea
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isEditable = document.activeElement?.isContentEditable;
        
        if (!isCtrlShiftA && (activeTag === "input" || activeTag === "textarea" || isEditable)) {
          return;
        }

        e.preventDefault();
        toast("👑 Opening Executive Admin Suite…");
        navigate("/admin");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, toast]);

  return null;
}
