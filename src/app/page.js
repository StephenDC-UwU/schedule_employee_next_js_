'use client'
import { useEffect, useState } from "react";
import { registerSyncfusion } from "../../lib/syncfusion-license";

import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
} from "@syncfusion/ej2-react-schedule";


export default function Home() {

  useEffect( () => {
    registerSyncfusion();
  }, []);

   const [events, setEvents] = useState([
    {
      Id: 1,
      Subject: "Reunión de equipo",
      StartTime: new Date(2024, 3, 5, 10, 0),
      EndTime: new Date(2024, 3, 5, 11, 0),
      CategoryColor: "#FF5733" // Rojo
    },
    {
      Id: 2,
      Subject: "Llamada con cliente",
      StartTime: new Date(2024, 3, 6, 14, 0),
      EndTime: new Date(2024, 3, 6, 15, 30),
      CategoryColor: "#33FF57" // Verde
    },
    {
      Id: 3,
      Subject: "Entrega de proyecto",
      StartTime: new Date(2024, 3, 7, 9, 0),
      EndTime: new Date(2024, 3, 7, 10, 30),
      CategoryColor: "#337BFF" // Azul
    }
  ]);

  const onDragStop = (args) => {
    const updatedEvent = {
      Id: events.length + 1,
      Subject: args.data.Subject,
      StartTime: args.event.startTime,
      EndTime: args.event.endTime,
    };

    setEvents([...events, updatedEvent]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Contenedor con borde de color y sombra */}
      <div className="relative w-[450px] p-1 bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl shadow-xl border-2 border-gray-300">
        {/* Contenedor interno con fondo blanco */}
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-center text-gray-700 mb-4">
            📅 Calendario Compacto
          </h2>
          <ScheduleComponent
            height="600px" 
            width="900px" 
            selectedDate={new Date(2024, 3, 5)}
            eventSettings={{ dataSource: events }}
            dragStop={onDragStop}
          >
            <ViewsDirective>
              <ViewDirective option="Day" />
              <ViewDirective option="Week" />
              <ViewDirective option="WorkWeek" />
              <ViewDirective option="Month" />
              <ViewDirective option="Agenda" />
            </ViewsDirective>
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
          </ScheduleComponent>
        </div>
      </div>
    </div>
  );
}