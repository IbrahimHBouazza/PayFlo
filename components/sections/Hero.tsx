"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return <section className="bg-background">
    <motion.div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
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
        duration: 2,
      }}
      className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Professional Invoicing Made <span className="text-cyan-500">Simple</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Create, send, and manage invoices effortlessly. Get paid faster with our
          automated payment processing and client management system.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
      </motion.div>
    </motion.div>
  </section>
}
