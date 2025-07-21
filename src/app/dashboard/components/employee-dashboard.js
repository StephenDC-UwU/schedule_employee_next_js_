"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Settings, X, MoreVertical, Menu, ChevronLeft } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedUniqueValues,
  flexRender,
} from "@tanstack/react-table";

export default function EmployeeDashboard({ getEmployees, getWorkspaces }) {
  const router = useRouter();

  const [employees, setEmployees] = useState(getEmployees);
  const [workspaces, setWorkspaces] = useState(getWorkspaces);
  const [selectedWorkspace, setSelectedWorkspace] = useState(0);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");

  const handleDeleteEmployee = (id) => {
    fetch(`http://localhost:5000/api/employees?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const text = await response.text();
        console.log("Response from Server:", text);
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("Employee Deleted", data);
      })
      .catch((error) => {
        console.error("Error Delete Employee:", error);
      })
      .finally(() => {});
  };

  const handleDeleteWorkspace = (id) => {
    fetch(`http://localhost:5000/api/workspaces?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const text = await response.text();
        console.log("Response from Server:", text);
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("Workspace Deleted", data);
      })
      .catch((error) => {
        console.error("Error Delete Workspace:", error);
      })
      .finally(() => {});
  };

  const handleDeletedEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
    handleDeleteEmployee(id);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /* Managment Employee */
  const handleAddEmployee = () => {
    router.push("/dashboard/employee");
  };

  const handleUpdateEmployee = (id) => {
    router.push(`/dashboard/employee?id=${id}`);
  };

  /* Management Department */
  const handleUpdateDepartment = (id) => {
    router.push(`/dashboard/department?id=${id}`);
  };

  const handleDeletedDepartment = (id) => {
    setWorkspaces(
      workspaces.filter((department) => department.workspace_id !== id)
    );
    handleDeleteWorkspace(id);
  };

  const handleAddWorkspace = () => {
    router.push("/dashboard/department");
  };

  const handleReturnSchedule = () => {
    router.push("/");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "jobTitle",
        header: "Job Title",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const employee = row.original;
          return (
            <div className="!flex !gap-2 !justify-end">
              <button
                className="!rounded-full !bg-yellow-300 !p-2 hover:!bg-yellow-400"
                onClick={() => handleUpdateEmployee(employee.id)}
              >
                <Settings size={18} className="!text-gray-800" />
              </button>
              <button
                className="!rounded-full !bg-red-500 !p-2 hover:!bg-red-600"
                onClick={() => handleDeletedEmployee(employee.id)}
              >
                <X size={18} className="!text-white" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: employees,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="!flex !h-screen !w-full !flex-col md:!flex-row">
      {/* Mobile Header */}
      <div className="!flex !items-center !justify-between !border-b !border-gray-200 !bg-white !p-4 md:!hidden">
        <button
          onClick={toggleSidebar}
          className="!rounded-md !p-2 hover:!bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="!text-lg !font-bold">Employee Dashboard</h1>
        <div className="!w-8"></div>
      </div>

      {/* Left Sidebar */}
      <div
        className={`${
          sidebarOpen ? "!translate-x-0" : "!-translate-x-full"
        } !z-40 !bg-white !transition-transform !duration-300 !ease-in-out md:!relative md:!z-0 md:!translate-x-0 md:!transform-none md:!w-64 md:!border-r md:!border-gray-200 ${
          sidebarOpen ? "!fixed !inset-0" : "!fixed !inset-0 md:!static"
        }`}
      >
        <div className="!flex !items-center !justify-between !border-b !border-gray-200 !p-4 md:!hidden">
          <h2 className="!font-bold">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="!rounded-md !p-2 hover:!bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="!p-4">
          <button
            onClick={() => handleReturnSchedule()}
            className="!mb-6 !w-full !rounded-md !bg-yellow-300 !py-3 !px-4 !font-medium !text-gray-800 hover:!bg-yellow-400"
          >
            Schedule Employee
          </button>
          {workspaces.map((workspace, index) => (
            <div key={workspace.workspace_id} className="!relative !mb-3">
              <div
                className={`!flex !items-center !justify-between !rounded-full !border !border-gray-300 !px-4 !py-2 transition-colors duration-200 ${
                  selectedWorkspace === index ? "!bg-opacity-20" : ""
                }`}
                style={{
                  backgroundColor:
                    selectedWorkspace === index
                      ? workspace.color
                      : "transparent",
                }}
              >
                {/* Click aquí selecciona el workspace */}
                <div
                  className="!flex !items-center gap-2 !cursor-pointer"
                  onClick={() => setSelectedWorkspace(index)}
                >
                  <span
                    className="!inline-block !h-3 !w-3 !rounded-full"
                    style={{ backgroundColor: workspace.color }}
                  />
                  <span className="!text-gray-700">
                    {workspace.workspace_name}
                  </span>
                </div>

                {/* Click aquí abre/cierra el dropdown */}
                <MoreVertical
                  size={18}
                  className="!text-gray-500 !cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // evita que se dispare también el otro click
                    setOpenDropdownIndex(
                      openDropdownIndex === index ? null : index
                    );
                  }}
                />
              </div>

              {openDropdownIndex === index && (
                <div className="!absolute !right-0 !mt-1 !w-48 !rounded-md !border !border-gray-200 !bg-white !py-1 !shadow-lg !z-10">
                  <div
                    className="!px-4 !py-2 !text-sm !text-gray-700 hover:!bg-gray-100 !cursor-pointer"
                    onClick={() => {
                      handleUpdateDepartment(workspace.workspace_id);
                      setOpenDropdownIndex(null);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    Setting
                  </div>
                  <div
                    className="!px-4 !py-2 !text-sm !text-gray-700 hover:!bg-gray-100 !cursor-pointer"
                    onClick={() => {
                      handleDeletedDepartment(workspace.workspace_id);
                      setOpenDropdownIndex(null);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Button for add new Workspaces */}
          <button
            onClick={handleAddWorkspace}
            className="!rounded-md !bg-yellow-400 !px-4 !py-2 1font-medium !text-gray-800 !hover:bg-yellow-500 !flex !items-center !gap-2"
          >
            <span>Add New Department</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="!fixed !inset-0 !z-30 !bg-black !bg-opacity-50 md:!hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="!flex-1 !overflow-auto !p-4">
        <div className="!mb-4 !flex !items-center !justify-between">
          <button
            onClick={handleAddEmployee}
            className="!rounded-md !bg-yellow-400 !px-4 !py-2 1font-medium !text-gray-800 !hover:bg-yellow-500 !flex !items-center !gap-2"
          >
            <span>Add New Employee</span>
          </button>
        </div>

        <div className="!flex-1 !overflow-auto !p-4">
          <div className="!mb-4 !flex !items-center !justify-between !gap-4 !flex-wrap">
            <input
              type="text"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="!border !border-gray-300 !rounded-md !px-3 !py-2"
            />
          </div>

          <div className="!rounded-lg !border !border-gray-300 !bg-white">
            {/* Header */}
            <div className="!hidden md:!flex !border-b !border-gray-200 !p-4 !font-medium !bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className={`!px-2 ${
                      header.column.id === "id"
                        ? "!w-1/4"
                        : header.column.id === "name"
                        ? "!w-1/3"
                        : header.column.id === "jobTitle"
                        ? "!flex-1"
                        : header.column.id === "actions"
                        ? "!w-auto !flex !justify-end"
                        : "!w-auto"
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Rows */}
            <div className="!p-4">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <div
                    key={row.id}
                    className="!mb-2 !flex !flex-col md:!flex-row md:!items-center !rounded-md !border !border-gray-200 !p-3"
                  >
                    {/* Mobile layout */}
                    <div className="md:!hidden !mb-2 !rounded-md !border !border-gray-200 !p-3 !bg-white">
                      <div className="!mb-2">
                        <div>
                          <strong>ID:</strong> {row.original.id}
                        </div>
                        <div>
                          <strong>Name:</strong> {row.original.name}
                        </div>
                        <div>
                          <strong>Job Title:</strong> {row.original.jobTitle}
                        </div>
                      </div>
                      <div className="!flex !justify-end !gap-2">
                        <button
                          className="!rounded-full !bg-yellow-300 !p-2 hover:!bg-yellow-400"
                          onClick={() => handleUpdateEmployee(row.original.id)}
                        >
                          <Settings size={18} className="!text-gray-800" />
                        </button>
                        <button
                          className="!rounded-full !bg-red-500 !p-2 hover:!bg-red-600"
                          onClick={() => handleDeletedEmployee(row.original.id)}
                        >
                          <X size={18} className="!text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    {row.getVisibleCells().map((cell) => (
                      <div
                        key={cell.id}
                        className={`!hidden md:!block !px-2 ${
                          cell.column.id === "id"
                            ? "!w-1/4"
                            : cell.column.id === "name"
                            ? "!w-1/3"
                            : cell.column.id === "jobTitle"
                            ? "!flex-1"
                            : cell.column.id === "actions"
                            ? "!w-auto !flex !justify-end !gap-2"
                            : ""
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="!py-8 !text-center !text-gray-500">
                  No employees found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
