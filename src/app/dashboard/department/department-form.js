"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function DepartmentForm() {
  const [name, setName] = useState("")
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)

  // Tailwind color palette
  const colorPalette = [
    // Reds
    { bg: "bg-red-400", text: "text-white" },
    { bg: "bg-red-500", text: "text-white" },
    { bg: "bg-red-600", text: "text-white" },
    // Blues
    { bg: "bg-blue-400", text: "text-white" },
    { bg: "bg-blue-500", text: "text-white" },
    { bg: "bg-blue-600", text: "text-white" },
    // Greens
    { bg: "bg-green-400", text: "text-white" },
    { bg: "bg-green-500", text: "text-white" },
    { bg: "bg-green-600", text: "text-white" },
    // Yellows
    { bg: "bg-yellow-300", text: "text-gray-800" },
    { bg: "bg-yellow-400", text: "text-gray-800" },
    { bg: "bg-yellow-500", text: "text-gray-800" },
    // Purples
    { bg: "bg-purple-400", text: "text-white" },
    { bg: "bg-purple-500", text: "text-white" },
    { bg: "bg-purple-600", text: "text-white" },
    // Pinks
    { bg: "bg-pink-400", text: "text-white" },
    { bg: "bg-pink-500", text: "text-white" },
    { bg: "bg-pink-600", text: "text-white" },
    // Grays
    { bg: "bg-gray-300", text: "text-gray-800" },
    { bg: "bg-gray-400", text: "text-white" },
    { bg: "bg-gray-500", text: "text-white" },
    // Indigos
    { bg: "bg-indigo-400", text: "text-white" },
    { bg: "bg-indigo-500", text: "text-white" },
    { bg: "bg-indigo-600", text: "text-white" },
    // Teals
    { bg: "bg-teal-400", text: "text-white" },
    { bg: "bg-teal-500", text: "text-white" },
    { bg: "bg-teal-600", text: "text-white" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Department created: ${name}, Color: ${selectedColor ? selectedColor.bg : "None"}`)
  }

  const handleCancel = () => {
    setName("")
    setSelectedColor(null)
    setIsColorPickerOpen(false)
  }

  return (
    <div className="!flex !min-h-screen !items-center !justify-center !bg-gray-100 !p-4">
        <div className="!w-full !max-w-md">
            {/* Header Button */}
            <div className="!mb-6 !overflow-hidden !rounded-md !border !border-gray-300 !bg-yellow-300">
            <button className="!w-full !py-4 !px-6 !text-center !text-lg !font-bold !text-gray-800">
                REGISTER NEW DEPARTMENT
            </button>
            </div>

            {/* Form Container */}
            <div className="!overflow-hidden !rounded-md !border !border-gray-300 !bg-white !p-6 !flex !flex-col !space-y-6 !min-h-[350px]">
            <form onSubmit={handleSubmit} className="!flex !flex-col !flex-grow">
                {/* Name Input */}
                <div className="!mb-6">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                        <div className={`!h-5 !w-5 !rounded-full ${selectedColor.bg}`}></div>
                    ) : null}
                    <span className={selectedColor ? "!text-gray-800" : "!text-gray-500"}>
                        {selectedColor ? "Color selected" : "Select Color"}
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
                            className={`!h-8 !w-8 !cursor-pointer !rounded-full ${color.bg} !flex !items-center !justify-center ${
                            selectedColor && selectedColor.bg === color.bg
                                ? "!ring-2 !ring-offset-2 !ring-gray-500"
                                : ""
                            }`}
                            onClick={() => {
                            setSelectedColor(color);
                            setIsColorPickerOpen(false);
                            }}
                        >
                            {selectedColor && selectedColor.bg === color.bg ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`!h-4 !w-4 ${color.text}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
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
                    Create
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