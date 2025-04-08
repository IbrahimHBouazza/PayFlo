"use client";

import { Fragment } from "react";
import Image from "next/image";
import Meta from "../app/assets/images/meta.svg";
import Airbnb from "../app/assets/images/airbnb.png";
import Monzo from "../app/assets/images/monzo.png";
import Wise from "../app/assets/images/wise.png";
import Zego from "../app/assets/images/zego.webp";
import Freetrade from "../app/assets/images/freetrade.svg";
import { motion } from "framer-motion";

  const logos = [
    { src: Meta, alt: "Meta", width: 180, height: 40 },
    { src: Airbnb, alt: "Airbnb", width: 180, height: 40 },
    { src: Monzo, alt: "Monzo", width: 180, height: 40 },
    { src: Wise, alt: "Wise", width: 180, height: 40 },
    { src: Zego, alt: "Zego", width: 180, height: 40 },
    { src: Freetrade, alt: "Freetrade", width: 180, height: 40 },
  ];

  export default function LogoCarousel() {
    return (
        <section className="py-14 overflow-x-clip justify-center items-center">
            <motion.div 
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
              }}
              className="container mx-auto flex flex-col items-center">
                <h3 className="text-center text-2xl font-bold">
                    Trusted by
                </h3>
                <p className="text-center text-gray-500">
                    We've helped these companies manage their money
                </p>
            </motion.div>
            <div className="flex">
                <div className="flex overflow-hidden mt-12 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <motion.div 
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                      x: "-100%",
                    }}
                    transition={{
                        duration: 150,
                        ease: "linear",
                        repeat: Infinity,
                        opacity: {
                          duration: 1,
                        }
                    }}
                    className="flex flex-none gap-24 pr-24">
                        {Array.from({length: 10}).map((_, index) => (
                            <Fragment key={index}>
                                {logos.map((logo, logoIndex) => (
                                    <Image
                                        key={`${index}-${logoIndex}`}
                                        src={logo.src}
                                        alt={logo.alt}
                                        width={180}
                                        height={40}
                                        className="grayscale object-contain"
                                    />
                                ))}
                            </Fragment>
                        ))}
                    </motion.div>
                </div>
            </div>

        </section>
    );
}