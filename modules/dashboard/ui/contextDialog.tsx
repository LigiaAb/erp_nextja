"use client";

import React from "react";
import DynamicIcon from "@/components/custom/DynamicIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ContextForm from "@/modules/context/contextForm";
import { useSelector } from "react-redux";
import { selectcontext } from "@/store/context/contextSlice";

const ContextDialog = () => {
  const [open, setOpen] = React.useState(false);
  const ctx = useSelector(selectcontext);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex group has-[:hover]:bg-secondary/20 has-[:hover]:rounded px-1 space-x-3 justify-center items-center flex-nowrap">
          <Button variant="ghost">
            <DynamicIcon name="briefcase-business" className="size-7" />
          </Button>
          <div className="flex text-nowrap max-w-50 lg:max-w-full overflow-hidden">
            {[ctx?.paisId?.nombre_pais, ctx?.empresaId?.nombre_emp, ctx?.centroCostoId?.nombre_cc].filter(Boolean).join(" - ")}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-none w-full! md:w-[60vw]!" // quita el sm:max-w-lg del componente
        style={{ width: "60vw", maxWidth: "none" }}
        showCloseButton={false}
      >
        <DialogTitle></DialogTitle>
        <ContextForm
          onDone={() => {
            setOpen(false);
            // router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContextDialog;
