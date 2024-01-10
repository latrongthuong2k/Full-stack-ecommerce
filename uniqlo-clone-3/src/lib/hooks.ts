import { useActiveSectionContext } from "@/context/active-section-context";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import type { SectionName } from "./types";

export function useSectionInView(sectionName: SectionName, threshold = 0.75) {
  const { ref, inView } = useInView({
    threshold,
  });
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionName);
    }
  }, [inView, setActiveSection, timeOfLastClick, sectionName]);

  return {
    ref,
  };
}

export function useSectionWhenTrigger(
  sectionName: SectionName,
  threshold = 0.75,
) {
  const { setShowInNavBar, timeOfLastClick } = useActiveSectionContext();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const isActive =
          rect.top <= window.innerHeight * threshold && rect.bottom >= 0;

        if (isActive && Date.now() - timeOfLastClick > 1000) {
          if (sectionName === "content") {
            setShowInNavBar(true);
          } else if (sectionName === "outContent") {
            setShowInNavBar(false);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionName, threshold, setShowInNavBar, timeOfLastClick]);

  return { ref };
}
