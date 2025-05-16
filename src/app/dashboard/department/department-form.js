"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useRouter,useSearchParams } from "next/navigation"

export default function DepartmentForm() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const workspace_id = searchParams.get('id');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
    const [selectedColor, setSelectedColor] = useState(null)
    const [workspaceData, setWorkspaceData] = useState({
        workspace_name : "",
        color : ""
    });

    const [formMode, setFormMode] = useState("create");

    useEffect(() => {
        if ( workspace_id ) {
          setFormMode("update");

          const fetchWorkspace = async () =>{
            try {
              const res = await fetch(`http://localhost:5000/api/workspaces/${workspace_id}`);
              const data = await res.json()
              console.log(data);
              setWorkspaceData(data.data);
              setSelectedColor({
                    bg: data.data.color,
                    text: "#ffffff"
                });
            } catch (error) {
              console.error("Error getting Workspace ", error);
            }
          };
    
          fetchWorkspace();

        } else {
          setFormMode("create");

        }
      }, [workspace_id]);
    

  // Tailwind color palette
  const colorPalette = [
    // Reds
    { bg: "#f87171", text: "#ffffff" },
    { bg: "#ef4444", text: "#ffffff" },
    { bg: "#dc2626", text: "#ffffff" },
    // Blues
    { bg: "#60a5fa", text: "#ffffff" },
    { bg: "#3b82f6", text: "#ffffff" },
    { bg: "#2563eb", text: "#ffffff" },
    // Greens
    { bg: "#4ade80", text: "#ffffff" },
    { bg: "#22c55e", text: "#ffffff" },
    { bg: "#16a34a", text: "#ffffff" },
    // Yellows
    { bg: "#fde047", text: "#1f2937" },
    { bg: "#facc15", text: "#1f2937" },
    { bg: "#eab308", text: "#1f2937" },
    // Purples
    { bg: "#a78bfa", text: "#ffffff" },
    { bg: "#8b5cf6", text: "#ffffff" },
    { bg: "#7c3aed", text: "#ffffff" },
    // Pinks
    { bg: "#f472b6", text: "#ffffff" },
    { bg: "#ec4899", text: "#ffffff" },
    { bg: "#db2777", text: "#ffffff" },
    // Grays
    { bg: "#d1d5db", text: "#1f2937" },
    { bg: "#9ca3af", text: "#ffffff" },
    { bg: "#6b7280", text: "#ffffff" },
    // Indigos
    { bg: "#818cf8", text: "#ffffff" },
    { bg: "#6366f1", text: "#ffffff" },
    { bg: "#4f46e5", text: "#ffffff" },
    // Teals
    { bg: "#2dd4bf", text: "#ffffff" },
    { bg: "#14b8a6", text: "#ffffff" },
    { bg: "#0d9488", text: "#ffffff" },
    { bg: "#bbdc00", text: "#ffffff" },
    ];



      // Create Employee
  const handleCreateWorkspace = (workspace) => {
      fetch('http://localhost:5000/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workspace),
      })
      .then(async (response) => {
        const text = await response.text();
        console.log('Response from Server:', text);
        return JSON.parse(text); 
      })
      .then((data) => {
        console.log('Workspace Created:', data);
      })
      .catch((error) => {
        console.error('Error Create Workspace:', error);
      })
      .finally(()=>{

      })
  };

  // Update Employee
  const handleUpdateWorkspace = (workspace) => {
      fetch('http://localhost:5000/api/workspaces', {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(workspace),
      })
      .then(async (response) => {
        const text = await response.text();
        console.log('Response from Server:', text);
        return JSON.parse(text); 
      })
      .then((data) => {
        console.log('Workspace Updated:', data);
      })
      .catch((error) => {
        console.error('Error Update Workspace:', error);
      })
      .finally(()=>{

      })
    };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === "create") {
      handleCreateWorkspace(workspaceData);
      router.push('/dashboard');
    } else {
      handleUpdateWorkspace(workspaceData);
      router.push('/dashboard');
    }
  };


  const handleCancel = () => {
     router.push('/dashboard');
  }

  return (
    <div className="!flex !min-h-screen !items-center !justify-center !bg-gray-100 !p-4">
        <div className="!w-full !max-w-md">
            {/* Header Button */}
            <div className="!mb-6 !overflow-hidden !rounded-md !border !border-gray-300 !bg-yellow-300">
            <button className="!w-full !py-4 !px-6 !text-center !text-lg !font-bold !text-gray-800">
                {formMode === "create" ? "REGISTER NEW DEPARTMENT" : "UPDATE DEPARTMENT"}
            </button>
            </div>

            {/* Form Container */}
            <div className="!overflow-hidden !rounded-md !border !border-gray-300 !bg-white !p-6 !flex !flex-col !space-y-6 !min-h-[350px]">
            <form onSubmit={handleSubmit} className="!flex !flex-col !flex-grow">
                {/* Name Input */}
                <div className="!mb-6">
                <input
                    type="text"
                    value={workspaceData.workspace_name}
                    onChange={(e) => setWorkspaceData((prev) => ({...prev, workspace_name: e.target.value,}))}
                    placeholder="Name"
                    className="!w-full !rounded-md !border !border-gray-300 !p-3 !focus:border-yellow-300 !focus:outline-none"
                    required
                />
                </div>

                {/* Color Picker */}
                <div className="!mb-8 !relative">
                <div
                    className="!flex !cursor-pointer !items-center !justify-between !rounded-md !border !border-gray-300 !p-3"
                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                >
                    <div className="!flex !items-center !gap-2">
                    {selectedColor ? (
                        <div
                        className="!h-5 !w-5 !rounded-full"
                        style={{ backgroundColor: selectedColor.bg }}
                        ></div>
                    ) : null}
                    <span
                        className={selectedColor ? "!text-gray-800" : "!text-gray-500"}
                    >
                        {selectedColor ? `Color ${selectedColor.bg}` : "Select Color"}
                    </span>
                    </div>


                    <div className="!flex !h-8 !w-8 !items-center !justify-center !rounded-full !bg-red-400">
                    <ChevronDown size={20} className="!text-gray-800" />
                    </div>
                </div>

                {/* Color Palette */}
                {isColorPickerOpen && (
                    <div className="!absolute !z-10 !mt-1 !w-full !rounded-md !border !border-gray-300 !bg-white !p-3 !shadow-lg !max-h-40 !overflow-y-auto">
                    <div className="!grid !grid-cols-6 !gap-2">
                        {colorPalette.map((color, index) => (
                        <div
                            key={index}
                            className="!h-8 !w-8 !cursor-pointer !rounded-full !flex !items-center !justify-center"
                            style={{
                            backgroundColor: color.bg,
                            boxShadow:
                                selectedColor && selectedColor.bg === color.bg
                                ? "0 0 0 2px white, 0 0 0 4px #6b7280"
                                : "none",
                            }}
                            onClick={() => {

                            setSelectedColor(color);
                            setIsColorPickerOpen(false);
                            setWorkspaceData( prev => ({
                                ...prev,
                                color: color.bg
                            }));
                            }}
                        >
                            {selectedColor && selectedColor.bg === color.bg ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="!h-4 !w-4"
                                viewBox="0 0 20 20"
                                fill={color.text}
                            >
                                <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                                />
                            </svg>
                            ) : null}
                        </div>
                        ))}
                    </div>
                    </div>
                )}
                </div>
                
                {/* Action Buttons */}
                <div className="!mt-auto !flex !justify-between !gap-4">
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