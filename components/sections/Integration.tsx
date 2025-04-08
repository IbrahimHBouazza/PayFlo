"use client"
import { Fragment } from "react";
import Image from "next/image";
import Paypal from "../../app/assets/images/paypal.webp";
import Zapier from "../../app/assets/images/zapier.png";
import Quickbooks from "../../app/assets/images/quickbooks.jpg";
import Xero from "../../app/assets/images/xero.png";
import { motion } from "framer-motion";

  const logos = [
    { src: Paypal, alt: "Paypal", width: 100, height: 100 },
    { src: Zapier, alt: "Zapier", width: 100, height: 100 },
    { src: Quickbooks, alt: "Quickbooks", width: 100, height: 100 },
    { src: Xero, alt: "Xero", width: 100, height: 100 },
  ];

  export default function Integration() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container">
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {logos.map((logo, index) => (
                            <motion.div
                                key={logo.alt}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-lg border bg-card p-6 shadow-sm flex items-center justify-center h-[150px] w-full">
                                    <div className="rounded-lg bg-white p-4 w-[120px] h-[120px] flex items-center justify-center">
                                        <Image
                                            src={logo.src}
                                            alt={logo.alt}
                                            width={80}
                                            height={80}
                                            className="object-contain rounded-full"
                                        />
                                    </div>
                                </div>
                                <p className="mt-4 text-center text-muted-foreground">
                                    {`Connect your business with ${logo.alt} for seamless integration`}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
