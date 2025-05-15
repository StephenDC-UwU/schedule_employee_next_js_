import EmployeeDashboard from "./components/employee-dashboard"

export default async function Home() {
  try{
    const [employeesRes, workspacesRes] = await Promise.all([
      fetch('http://localhost:5000/api/employees', { cache: 'no-store' }),
      fetch('http://localhost:5000/api/workspaces', {cache: 'no-store'})
    ]);
    const rawEmployees = await employeesRes.json();
    const mappedEmployees = rawEmployees.map( emp => ({
      id: emp.employee_id,
      name: emp.employee_name,
      jobTitle: emp.job_title
    }));
    const mappedWorkspaces = await workspacesRes.json();

    console.log("Mapped Employees:", mappedEmployees);

    return (
      <main className="!min-h-screen !bg-gray-100">
        <EmployeeDashboard
          getEmployees={mappedEmployees}
          getWorkspaces={mappedWorkspaces}
        />
      </main>
    );
  } catch (error) {
    console.error('Error to get Data ', error);
  };
}
