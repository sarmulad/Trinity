import type { GridOptions } from "ag-grid-community";
import { toast } from "sonner";

const COPY_FEEDBACK_TOAST_ID = "ag-grid-copy-feedback";

function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Clipboard is not available in this environment."));
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.appendChild(textarea);
    textarea.select();

    try {
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!copied) {
        reject(new Error("Failed to copy."));
        return;
      }
      resolve();
    } catch (error) {
      document.body.removeChild(textarea);
      reject(error);
    }
  });
}

/**
 * Shared clipboard behavior for all AG Grid tables.
 * - Enables range selection for copy operations.
 * - Includes headers when users copy (Ctrl/Cmd + C).
 * - Keeps paste enabled (for editable cells/columns).
 * - Shows a visual "Copied" confirmation toast.
 */
export const AG_GRID_CLIPBOARD_OPTIONS: Pick<
  GridOptions,
  | "cellSelection"
  | "copyHeadersToClipboard"
  | "suppressClipboardPaste"
  | "sendToClipboard"
> = {
  cellSelection: true,
  copyHeadersToClipboard: true,
  suppressClipboardPaste: false,
  sendToClipboard: (params) => {
    const text = params.data;
    if (!text) return;

    void copyTextToClipboard(text)
      .then(() => {
        toast.success("Copied to clipboard", {
          id: COPY_FEEDBACK_TOAST_ID,
          description: "Selected row/item data has been copied.",
        });
      })
      .catch(() => {
        toast.error("Unable to copy", {
          id: COPY_FEEDBACK_TOAST_ID,
          description: "Please try copying again.",
        });
      });
  },
};

export const AG_GRID_MULTI_ROW_SELECTION: NonNullable<GridOptions["rowSelection"]> = {
  mode: "multiRow",
  checkboxes: false,
  headerCheckbox: false,
  enableClickSelection: true,
};

export const AG_GRID_MULTI_ROW_SELECTION_WITH_COPY: NonNullable<
  GridOptions["rowSelection"]
> = {
  ...AG_GRID_MULTI_ROW_SELECTION,
  copySelectedRows: true,
};
