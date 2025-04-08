"use client";
import Link from "next/link"
import { Button } from "../ui/button"
import logo from "@/app/assets/images/logo.png"
import { motion } from "framer-motion";

export default function Navbar() {
  return <section className="bg-background">
        <motion.nav
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
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <motion.div className="flex items-center space-x-2">
            <img src={logo.src} alt="logo" className="flex h-10 w-30" />
          </motion.div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </motion.nav>
  </section>
}