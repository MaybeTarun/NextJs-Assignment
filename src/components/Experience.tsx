"use client";

import Image from "next/image";
import data from "../data/experience.json";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface ExperienceItem {
  image: string;
  title: string;
  duration: string;
}

export default function Experiences() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [canHorizontalScroll, setCanHorizontalScroll] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 200, damping: 30, mass: 0.4 });

  const isInView = useInView(sectionRef, { amount: 0.4 });

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  const getArchMarginBottom = (index: number): number => {
    if (!scrollContainerRef.current) return 0;
    const container = scrollContainerRef.current;
    const itemWidth = 286;
    const containerWidth = container.clientWidth;
    const itemLeft = index * itemWidth;
    const itemCenter = itemLeft + 140;
    const viewportCenter = container.scrollLeft + containerWidth / 2;

    const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
    const maxDistance = containerWidth / 2;

    const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
    const marginBottom = 80 * (1 - normalizedDistance);
    return marginBottom;
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const updateProgress = () => {
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const ratio = maxScroll > 0 ? container.scrollLeft / maxScroll : 0;
      rawProgress.set(clamp01(ratio));
      setScrollPosition(container.scrollLeft);
      rafId = null;
    };

    const onScroll = () => {
      if (rafId == null) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });

    updateProgress();

    const ro = new ResizeObserver(() => updateProgress());
    ro.observe(container);

    return () => {
      container.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [rawProgress]);

  useEffect(() => {
    if (!isInView) {
      rawProgress.set(0);
    } else {
      const c = scrollContainerRef.current;
      if (c) {
        const maxScroll = c.scrollWidth - c.clientWidth;
        const ratio = maxScroll > 0 ? c.scrollLeft / maxScroll : 0;
        rawProgress.set(clamp01(ratio));
      }
    }
  }, [isInView, rawProgress]);

  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      const sectionEl = sectionRef.current;
      const container = scrollContainerRef.current;
      if (!sectionEl || !container) return;

      const sectionRect = sectionEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isSectionActive = sectionRect.top <= 0 && sectionRect.bottom >= windowHeight;

      if (!isSectionActive) {
        setCanHorizontalScroll(false);
        return;
      }

      const isAtStart = container.scrollLeft <= 5;
      const isAtEnd =
        container.scrollLeft >= container.scrollWidth - container.clientWidth - 5;

      if (e.deltaY > 0) {
        if (!canHorizontalScroll) {
          setCanHorizontalScroll(true);
          e.preventDefault();
          return;
        }
        if (!isAtEnd) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        } else {
          setCanHorizontalScroll(false);
        }
      } else if (e.deltaY < 0) {
        if (canHorizontalScroll && !isAtStart) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        } else if (isAtStart) {
          setCanHorizontalScroll(false);
        }
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleGlobalWheel);
  }, [canHorizontalScroll]);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const container = scrollContainerRef.current;
    if (!sectionEl || !container) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.scrollTo({ left: 0, behavior: "auto" });
            setCanHorizontalScroll(false);
            rawProgress.set(0);
          } else {
            setCanHorizontalScroll(false);
            rawProgress.set(0);
          }
        });
      },
      { threshold: 0.5 }
    );

    io.observe(sectionEl);
    return () => io.disconnect();
  }, [rawProgress]);

  return (
    <motion.section
      ref={sectionRef}
      className="w-full flex flex-col items-center h-screen justify-start relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-full pt-20 px-12 md:px-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-black text-3xl italic mb-2">Signature Travel Experiences</h2>
        <h3 className="text-black text-lg leading-5 italic w-[80%] md:w-[35%]">
          Tailored journeys for every kind of explorer - from romantic escapes to thrill-filled adventures.
        </h3>
      </motion.div>

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto scrollbar-hide flex-1 flex items-start py-16"
      >
        <div className="flex gap-6 min-w-max px-12 md:px-32 items-end">
          {data.map((item: ExperienceItem, index: number) => {
            const marginBottom = getArchMarginBottom(index);
            return (
              <motion.div
                key={index}
                className="relative flex-shrink-0 w-[280px] h-[350px] rounded-lg overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
                style={{
                  marginBottom: `${marginBottom}px`,
                  transition: "margin-bottom 0.3s ease-out",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-white text-sm max-w-[50%] leading-tight">{item.title}</h3>
                  <p className="text-gray-200 text-xs ml-2 whitespace-nowrap">{item.duration}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[220px] h-[4px] bg-gray-300 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-black origin-left"
          style={{ scaleX: smoothProgress }}
          aria-hidden
        />
      </div>

      <motion.button className="mb-10 px-6 py-2 bg-[#312E29] text-white rounded-full text-sm hover:bg-black transition cursor-pointer">
        View All Experiences
      </motion.button>
    </motion.section>
  );
}
