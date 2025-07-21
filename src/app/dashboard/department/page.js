"use client";
import { Suspense } from "react";
import DepartmentForm from "./department-form";

export default function Home() {
  S;
  return (
    <main className="!min-h-screen">
      <Suspense fallback={<div>Loading form...</div>}>
        <DepartmentForm />
      </Suspense>
    </main>
  );
}
