"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui";
import { downloadCsv, toCsv } from "@/lib/csv";
import { getBranchName, type Customer } from "@/lib/types";

export function CustomerExport({ customers }: { customers: Customer[] }) {
  const rows = customers
    .filter((customer) => customer.status === "active" && customer.opt_in)
    .map((customer) => ({
      nombre: customer.name,
      whatsapp: customer.phone,
      sucursal: getBranchName(customer.branches),
      estado: customer.status,
      fecha_registro: new Date(customer.created_at).toLocaleString("es-AR")
    }));

  return (
    <Button
      type="button"
      onClick={() => downloadCsv("club-mercalito-clientes.csv", toCsv(rows))}
      disabled={!rows.length}
      className="min-h-10 px-3 py-2"
    >
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  );
}
