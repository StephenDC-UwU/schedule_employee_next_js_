'use client'
import {useState} from 'react';

export default function IAForm({onSubmit, loading}){

    const [textIA, setTextIA] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!textIA.trim()) return;
        onSubmit(textIA);
        setTextIA("");
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="!bg-white !px-4 !py-4 !rounded !shadow-sm !flex !items-center !space-x-2 !mb-8 !w-full !max-w-3xl"
    >
      <textarea
        placeholder="Write Your Schedule"
        rows={3}
        className="!bg-gray-50 !border !border-gray-300 !rounded-lg !p-3 !w-full !h-16 !text-sm !shadow-sm !focus:outline-none !focus:ring-2 !focus:ring-blue-400 !leading-normal !resize-none"
        onChange={(e) => setTextIA(e.target.value)}
        value={textIA}
      ></textarea>

      <button
        type="submit"
        disabled={loading}
        className={`!px-6 !py-2 !rounded !w-24 !text-black ${loading ? '!bg-gray-400' : '!bg-green-600 hover:!bg-green-700'}`}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );

}