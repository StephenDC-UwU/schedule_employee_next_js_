"use client"
import { useEffect, useState } from "react"
import { useRouter,useSearchParams  } from 'next/navigation';

export default function EmployeeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');
  
  const [formMode, setFormMode] = useState("create");
  const [employeeData, setEmployeeData] = useState({
    employee_name: "",
    job_title: ""
  });
  
  useEffect(() => {
    if ( employeeId ) {
      setFormMode("update");
      const fetchEmployee = async () =>{
        try {
          const res = await fetch(`http://localhost:5000/api/employees/${employeeId}`);
          const data = await res.json()
          console.log(data);
          setEmployeeData(data.data);
        } catch (error) {
          console.error("Error getting Employee ", error);
        }
      };

      fetchEmployee();
    } else {
      setFormMode("create");

    }
  }, [employeeId]);


  // Create Employee
  const handleCreateEmployee = (employee) => {
      fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      })
      .then(async (response) => {
        const text = await response.text();
        console.log('Response from Server:', text);
        return JSON.parse(text); 
      })
      .then((data) => {
        console.log('Employee Created:', data);
      })
      .catch((error) => {
        console.error('Error Create Employee:', error);
      })
      .finally(()=>{

      })
  };

  // Update Employee
  const handleUpdateEmployee = (employee) => {
      fetch('http://localhost:5000/api/employees', {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(employee),
      })
      .then(async (response) => {
        const text = await response.text();
        console.log('Response from Server:', text);
        return JSON.parse(text); 
      })
      .then((data) => {
        console.log('Employee Updated:', data);
      })
      .catch((error) => {
        console.error('Error Update Employee:', error);
      })
      .finally(()=>{

      })
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === "create") {
      console.log("Creating employee:", employeeData);
      handleCreateEmployee(employeeData);
      router.push('/dashboard');
    } else {
      console.log("Updating employee:", employeeData);
      handleUpdateEmployee(employeeData);
      router.push('/dashboard');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  }

  return (
    <div className="!flex !min-h-screen !items-center !justify-center !bg-gray-100 !p-4">
      <div className="!w-full !max-w-lg">
        {/* Header Button */}
        <div className="!mb-6 !overflow-hidden !rounded-md !border !border-gray-300 !bg-yellow-300">
          <div className="!w-full !py-4 !px-6 !text-center !text-lg !font-bold !text-gray-800">
            {formMode === "create" ? "REGISTER NEW EMPLOYEE" : "UPDATE EMPLOYEE"}
          </div>
        </div>

        {/* Form Container */}
        <div className="!overflow-hidden !rounded-md !border !border-gray-300 !bg-white !p-6 !flex !flex-col !space-y-6 !min-h-[350px]">
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="!mb-6">
              <input
                type="text"
                value={employeeData.employee_name}
                onChange={(e) =>
                  setEmployeeData((prev) => ({
                    ...prev,
                    employee_name: e.target.value,
                  }))
                }
                placeholder="Name"
                className="!w-full !rounded-md !border !border-gray-300 !p-3 focus:!border-yellow-300 focus:!outline-none"
                required
              />
            </div>

            {/* Job Title Input */}
            <div className="!mb-6">
              <input
                type="text"
                value={employeeData.job_title}
                onChange={(e) =>
                  setEmployeeData((prev) => ({
                    ...prev,
                    job_title: e.target.value,
                  }))
                }
                placeholder="Job Title"
                className="!w-full !rounded-md !border !border-gray-300 !p-3 focus:!border-yellow-300 focus:!outline-none"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="!flex !justify-between !gap-4">
              <button
                type="submit"
                className="!flex-1 !rounded-md !bg-green-500 !py-3 !font-medium !text-white hover:!bg-green-600"
              >
                {formMode === "create" ? "Create" : "Update"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="!flex-1 !rounded-md !bg-red-500 !py-3 !font-medium !text-white hover:!bg-red-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
