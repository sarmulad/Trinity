"use client";
import React from "react";
import { AgGridReact } from "ag-grid-react";

interface UseTableExportOptions {
  fileName: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useTableExport<T>(
  gridRef: React.RefObject<AgGridReact<T> | null>,
  { fileName, containerRef }: UseTableExportOptions,
) {
  const exportCsv = React.useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({
      fileName: `${fileName}.csv`,
      allColumns: true,
    });
  }, [gridRef, fileName]);

  const exportOds = React.useCallback(async () => {
    const XLSX = await import("xlsx");

    const api = gridRef.current?.api;
    if (!api) return;

    const rows: Record<string, unknown>[] = [];
    api.forEachNode((node) => {
      if (node.data) rows.push(node.data as Record<string, unknown>);
    });

    const columns = api.getColumns() ?? [];
    const headers = columns.map(
      (col) => col.getColDef().headerName ?? col.getColId(),
    );
    const fields = columns.map(
      (col) => col.getColDef().field ?? col.getColId(),
    );

    const wsData = [
      headers,
      ...rows.map((row) => fields.map((f) => row[f] ?? "")),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Write as ODS
    XLSX.writeFile(wb, `${fileName}.ods`, { bookType: "ods" });
  }, [gridRef, fileName]);

  const exportPng = React.useCallback(async () => {
    if (!containerRef.current) return;

    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(containerRef.current, {
      backgroundColor: null,
      scale: 2, // retina quality
      useCORS: true,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [containerRef, fileName]);

  return { exportCsv, exportOds, exportPng };
}
