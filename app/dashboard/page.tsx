"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/dashboard/Sidebar";
import { Payment, columns } from "@/app/payments/columns";
import { DataTable } from "@/app/payments/data-table";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const [showWelcome, setShowWelcome] = React.useState(false);

  React.useEffect(() => {
    if (isSignedIn && user?.firstName) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, user?.firstName]);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 fixed h-screen">
        <Layout />
      </div>
      <div className="ml-64 flex-1 p-6">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              className="flex flex-col items-center justify-center h-[calc(100vh-3rem)]"
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              exit={fadeIn.exit}
              transition={fadeIn.transition}
            >
              <h1 className="text-3xl font-bold">Welcome {user?.firstName}.</h1>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              className="flex flex-col gap-6"
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={fadeIn.transition}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Dashboard</h1>
              </div>

              {/* Stat Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Total Invoices" value="£289,500" />
                <DashboardCard title="Clients" value="12" />
                <DashboardCard title="Pending" value="3" />
                <DashboardCard title="Paid" value="9" />
              </div>

              {/* Recent Activity */}
              <div>
                <DataTable columns={columns} data={[
                  {
                    id: "1",
                    amount: 100,
                    status: "pending" as const,
                    email: "m@example.com",
                  },
                  {
                    id: "2", 
                    amount: 250,
                    status: "success" as const,
                    email: "example@gmail.com",
                  },
                  {
                    id: "3",
                    amount: 500,
                    status: "processing" as const,
                    email: "test@example.com", 
                  }
                ]} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


const DashboardCard = ({
  title,
  value,
}: {
  title: string
  value: string | number
}) => (
  <div className="bg-white dark:bg-black rounded-lg shadow p-4 flex flex-col justify-between">
    <p className="text-sm text-muted-foreground">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
)
