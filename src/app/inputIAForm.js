'use client'
import {useState,useRef,useEffect } from 'react';
import { ProgressButtonComponent } from '@syncfusion/ej2-react-splitbuttons';

export default function IAForm({onSubmit, loading}){
    const [textIA, setTextIA] = useState("");
    const progressBtnRef = useRef(null);

    const spinCenter = { position: 'Center' };
    const zoomOut = { effect: 'ZoomOut' };

    useEffect(() => {
      if(!loading) {
        setTextIA('');
      }
    }, [loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!textIA.trim()) return;
        onSubmit(textIA);
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

       <ProgressButtonComponent 
       ref={progressBtnRef}
       type='submit'
       disabled={loading}
       spinSettings={spinCenter} 
       animationSettings={zoomOut} 
       cssClass="e-round e-success"
       iconCss="e-btn-sb-icons e-play-icon"
       >
       </ProgressButtonComponent>
    </form>
  );

}