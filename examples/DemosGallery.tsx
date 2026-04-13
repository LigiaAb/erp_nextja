"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomComponentsDemos } from "@/examples/components-custom/CustomComponentsDemos";
import { LoggingDemos } from "@/examples/logging/LoggingDemos";
import { UseFetchDemos } from "@/examples/tanstack/UseFetchDemos";

export function DemosGallery() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold">Demos Funcionales</h1>
        <p className="text-sm text-muted-foreground">Ejemplos ejecutables de logging, hooks useFetch y components/custom.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logging</CardTitle>
          <CardDescription>Boton cliente con log y Link server-side con redirect.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoggingDemos />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>TanStack useFetch</CardTitle>
          <CardDescription>Estado de hooks, refetch y mutation con el nuevo factory.</CardDescription>
        </CardHeader>
        <CardContent>
          <UseFetchDemos />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Components Custom</CardTitle>
          <CardDescription>Stepper, InputField, AutoCompleteField y EditableTable con metadata.</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomComponentsDemos />
        </CardContent>
      </Card>
    </div>
  );
}
