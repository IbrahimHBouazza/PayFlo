"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { columns, Client } from "./columns";
import { DataTable } from "./data-table";
import Layout from "@/components/dashboard/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchClients = async () => {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) console.error("Fetch error:", error.message);
    else setClients(data as Client[]);
  };

  const handleCreateClient = async () => {
    const { error } = await supabase.from("clients").insert([{ name, email }]);
    if (error) {
      console.error("Insert error:", error.message);
    } else {
      setName("");
      setEmail("");
      fetchClients();
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 fixed h-screen">
        <Layout />
      </div>
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Clients</h1>
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          <Input
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Input
            placeholder="Client Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Button onClick={handleCreateClient}>Add Client</Button>
        </div>
        <DataTable columns={columns} data={clients} />
      </div>
    </div>
  );
}
