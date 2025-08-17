"use client"

import Journey from '../components/Journey';
import Experience from '../components/Experience';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, -550]);

  return (
    <>
      <div
        ref={ref}
        className="bg-white w-full min-h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.h1
          style={{ y }}
          className="text-black/10 font-bold text-center w-full"
        >
          <span className="block md:hidden text-[7rem] leading-none">
            Scroll <br /> Down
          </span>
          <span className="hidden md:inline text-[15rem] leading-none">
            Scroll Down
          </span>
        </motion.h1>
      </div>

      <div className="text-xl bg-[#F7F4EB] w-full h-fit py-20 px-12 md:px-32">
        <motion.h2
          className="text-black text-3xl italic"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Not just travel. A journey curated for you.
        </motion.h2>
        <motion.div
          className="mt-12 flex justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Journey />
        </motion.div>
      </div>

      <div className="bg-white w-full h-dvh">
        <div className="mt-12 flex justify-center items-center">
          <Experience />
        </div>
      </div>
    </>
  );
}
