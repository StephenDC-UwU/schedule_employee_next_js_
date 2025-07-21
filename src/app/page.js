import ExternalDragDrop from "./ExternalDragDrop";

export default async function SchedulePage() {
  try {
    const [employeesRes, workSpacesRes, dateRegistersRes] = await Promise.all([
      fetch("http://localhost:5000/api/employees", { cache: "no-store" }),
      fetch("http://localhost:5000/api/workspaces", { cache: "no-store" }),
      fetch("http://localhost:5000/api/date_register", { cache: "no-store" }),
    ]);

    const [employees, workSpaces, dateRegisters] = await Promise.all([
      employeesRes.json(),
      workSpacesRes.json(),
      dateRegistersRes.json(),
    ]);

    return (
      <ExternalDragDrop
        employees={employees}
        workSpaces={workSpaces}
        dateRegisters={dateRegisters}
      />
    );
  } catch (error) {
    console.error("Error to get Data:", error);
  }
}
