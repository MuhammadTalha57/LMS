"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { formatFieldName, formatFieldValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function NonEditableDialog({
  title,
  description,
  dialogOpen,
  handleDialogClose,
  dialogData,
}: {
  title: string;
  description: string;
  dialogOpen: boolean;
  handleDialogClose: () => void;
  dialogData: Record<string, any> | null;
}) {
  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {dialogData ? (
            <>
              {Object.entries(dialogData).map(([key, value], index) => (
                <div key={key}>
                  <div className="flex flex-col space-y-1">
                    <Label className="text-sm font-semibold text-gray-700">
                      {formatFieldName(key)}
                    </Label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                      {formatFieldValue(key, value)}
                    </div>
                  </div>
                  {index < Object.entries(dialogData).length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading details...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleDialogClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
