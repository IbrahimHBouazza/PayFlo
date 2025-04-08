"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { DataTable } from "./data-table"; // Import the DataTable
import { columns, Invoice } from "./columns"; // Import column definitions
import Layout from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2 } from "lucide-react";

export default function InvoicesPage() {
  const supabase = createClient();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // Fetch invoices
  const fetchInvoices = async () => {
    const { data, error } = await supabase.from("invoices").select("*");
    if (error) console.error("Fetch error:", JSON.stringify(error, null, 2));
    else setInvoices(data as Invoice[]);
  };

  // Create a new invoice
  const handleCreateInvoice = async () => {
    const { error } = await supabase.from("invoices").insert([
      {
        client_id: 1, // Placeholder: replace with actual client_id
        user_id: 1, // Placeholder: replace with actual logged-in user_id
        invoice_number: invoiceNumber,
        total_amount: parseFloat(totalAmount),
        status,
        due_date: dueDate,
      },
    ]);
    if (error) {
      console.error("Insert error:", JSON.stringify(error, null, 2));
    } else {
      setInvoiceNumber("");
      setTotalAmount("");
      setStatus("Pending");
      setDueDate("");
      setIsCreateModalOpen(false);
      fetchInvoices();
    }
  };

  // Update an invoice
  const handleUpdateInvoice = async () => {
    if (!currentInvoice) return;

    const { error } = await supabase
      .from("invoices")
      .update({
        invoice_number: invoiceNumber,
        total_amount: parseFloat(totalAmount),
        status,
        due_date: dueDate,
      })
      .eq("invoice_id", currentInvoice.invoice_id);

    if (error) {
      console.error("Update error:", JSON.stringify(error, null, 2));
    } else {
      setInvoiceNumber("");
      setTotalAmount("");
      setStatus("Pending");
      setDueDate("");
      setIsEditModalOpen(false);
      fetchInvoices();
    }
  };

  // Delete an invoice
  const handleDeleteInvoice = async (id: number) => {
    const { error } = await supabase.from("invoices").delete().eq("invoice_id", id);
    if (error) console.error("Delete error:", JSON.stringify(error, null, 2));
    else fetchInvoices();
  };

  // Open edit modal with current invoice data
  const openEditModal = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setInvoiceNumber(invoice.invoice_number);
    setTotalAmount(invoice.total_amount.toString());
    setStatus(invoice.status);
    setDueDate(invoice.due_date);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 fixed h-screen">
        <Layout />
      </div>
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 w-4 h-4" /> New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateInvoice();
                }}
                className="flex flex-col gap-4"
              >
                <Input
                  placeholder="Invoice Number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                />
                <Input
                  placeholder="Total Amount"
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                />
                <Input
                  placeholder="Due Date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <Button type="submit">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={invoices}
          onDelete={handleDeleteInvoice}
          onEdit={openEditModal}
        />
      </div>

      {/* Edit Invoice Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="mr-2 w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateInvoice();
            }}
            className="flex flex-col gap-4"
          >
            <Input
              placeholder="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
            <Input
              placeholder="Total Amount"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
            <Input
              placeholder="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
            <Button type="submit">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
