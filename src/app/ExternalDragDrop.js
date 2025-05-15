'use client'
import * as React from 'react';
import { useRef,useState} from 'react';
import { useRouter } from 'next/navigation';  
import { ScheduleComponent, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective, Inject, TimelineViews, Resize, DragAndDrop, TimelineMonth } from '@syncfusion/ej2-react-schedule';
import { closest, remove, addClass } from '@syncfusion/ej2-base';
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import dayjs from 'dayjs';
import IAForm from './inputIAForm'
import editorTemplate from './editorTemplate'

export default function ExternalDragDrop({employees, workSpaces, dateRegisters}) {
    
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const treeObj = useRef(null);
    let scheduleObj = useRef(null);
    let isTreeItemDropped = false;
    let draggedItemId = '';
    const allowDragAndDrops = true;

    // POST: Create a new Event
    const handleCreateEvent = (newEvent) => {
      fetch('http://localhost:5000/api/date_register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      })
      .then(async (response) => {
        const text = await response.text();
        console.log('Response from Server:', text);
        return JSON.parse(text); 
      })
      .then((data) => {
        console.log('Event Create:', data);
      })
      .catch((error) => {
        console.error('Error Create Event:', error);
      })
      .finally(()=>{

      })
    };

    // Update: Update an Event
    const handleUpdateEvent = (updateEvent) => {
      fetch('http://localhost:5000/api/date_register', {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json',

        },
        body: JSON.stringify(updateEvent),
      })
      .then(async (response) => {
        const text = await response.text();
        console.log('Response from Server:', text);
        return JSON.parse(text); 
      })
      .then((data) => {
        console.log('Update Event:', data);
      })
      .catch((error) => {
        console.error('Error Update Event:', error);
      })
      .finally(()=>{

      })
    };

      // Delete: Delete an Event
      const handleDeleteEvent = (id) => {
        fetch(`http://localhost:5000/api/date_register?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type' : 'application/json',
          },
        })
        .then(async (response) => {
          const text = await response.text();
          console.log('Response from Server:', text);
          return JSON.parse(text); 
        })
        .then((data) => {
          console.log('Delete Event:', data);
        })
        .catch((error) => {
          console.error('Error Delete Event:', error);
        })
        .finally(()=>{

        })
      };

      // Call to IA
      const handleScheduleSubmit = (message) => {
        setLoading(true);
        console.log("Text Sent:", message);
        fetch('http://localhost:5000/api/schedule/text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: message }),
        })
        .then(async (response) => {
          const text = await response.text();
          console.log('Response from Server:', text);
          return JSON.parse(text);
        })
        .then((data) => {
          console.log('Create Schedule by IA:', data);
        })
        .catch((error) => {
          console.error('Error Schedule Event:', error);
        })
        .finally(() => {
          setLoading(false);
          router.refresh(); 
        });
      };

    const onActionComplete = (args) => {
      console.log("Data inside args: ", args);     
      if (args.requestType === 'eventCreated') {
        const event = args.data[0]; 
        function formatToMySQL(dateString) {
          return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
        }
        const eventData = { 
          StartTime: formatToMySQL(event.StartTime),  
          EndTime: formatToMySQL(event.EndTime),      
          Description: event.Description || '',  
          DepartmentID: event.DepartmentID,  
          EmployeeId: event.EmployeeId || null
        };
        console.log("Array", event);
        console.log("Datos transformados", eventData);
        handleCreateEvent(eventData);
      }

      if (args.requestType === 'eventChanged') {
        const event = args.data[0]; 
        const currentEvents = scheduleObj.current.getEvents(); 
        console.log("OnActionComplete: ", currentEvents);

        const overlappingEvents = currentEvents.filter(existingEvent => {
          return (event.StartTime < existingEvent.EndTime && event.EndTime > existingEvent.StartTime) &&
                (event.EmployeeId === existingEvent.EmployeeId) &&
                (event.Id !== existingEvent.Id)&&
                (event.EmployeeId != null);
        });

        if (overlappingEvents.length > 0) {
          alert("Employee has a Task another Department in this Time");
          args.cancel = true;  
        } else {
          function formatToMySQL(dateString) {
            return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
          }
          const eventData = {
          StartTime: formatToMySQL(event.StartTime),  
          EndTime: formatToMySQL(event.EndTime),      
          Description: event.Description || '',  
          DepartmentID: event.DepartmentID,  
          EmployeeId: event.EmployeeId || null,
          Id: event.Id
          };
          console.log("On Update Array", event);
          console.log("On Update Datos transformados", eventData);
          handleUpdateEvent(eventData);
        }
      }

      if(args.requestType === 'eventRemoved') {
        const event = args.data[0];
        const Id = event.Id;
        console.log(Id);
        handleDeleteEvent(Id);
      }
    };
  

    const fields = {
      dataSource : employees, 
      id: 'employee_id',
      text: 'employee_name'
    };

    // Mapping empleados
    const employeeMap = {};
    for (let e of employees) {
    employeeMap[e.employee_id] = e.employee_name;
    }

    // Adaptando dateRegisters
    const dataRegisters = dateRegisters.map(item => ({
    Id: item.id,
    StartTime: item.start_time,
    EndTime: item.end_time,
    Description: item.description,
    EmployeeId: item.employee_id,
    DepartmentID: item.work_id,
    Subject: employeeMap[item.employee_id] || "Not Name"
    }));

    // Data Filter
    const [filters, setFilters] = useState({ departmentsId: null, employeesId: null, startTime:null, endTime:null});
    const [filteredEvents, setFilteredEvents] = useState(dataRegisters);

    
    //handler Filters
    const handleFilterSearch = () => {
      let filtered = dataRegisters;
      if (filters.departmentsId) {
        filtered = filtered.filter( ev => filters.departmentsId.includes(ev.DepartmentID));
      }
      if (filters.employeesId) {
        filtered = filtered.filter(ev => filters.employeesId.includes(ev.EmployeeId));
      }
      // filters date
      if(filters.startTime) {
        filtered = filtered.filter(ev => new Date(ev.StartTime) > filters.startTime);
      }  
      if(filters.endTime) {
        filtered = filtered.filter(ev => new Date(ev.EndTime) < filters.endTime);
      }
      setFilteredEvents(filtered);
      console.log("Events filtered", filtered);
    }

    //Clean Filters
    const handleFilterClear = () => {
      setFilteredEvents(dataRegisters);
      setFilters({ departmentId: null, employeeId: null, startTime:null, endTime:null});
    };


    const departmentData = workSpaces.map(workSpace => ({
      Text: workSpace.workspace_name,
      Id: workSpace.workspace_id,
      Color: workSpace.color
    }));

    const getConsultantName = (value) => {
        return value.resourceData[value.resource.textField];
    };

    const resourceHeaderTemplate = (props) => {
        return (<div className="template-wrap ">
        <div className="specialist-category">
          <div className="specialist-name"> {getConsultantName(props)}</div>
        </div>
      </div>);
    };

    // Configure Template
    const treeTemplate = (props) => {
        return (<div id="waiting">
        <div id="waitdetails">
          <div id="waitlist">{props.employee_name}</div>
          <div id="waitcategory">{props.job_title}</div>
        </div>
      </div>);
    };

    const onItemSelecting = (args) => {
        args.cancel = true;
    };

    const onTreeDrag = (event) => {
        if (scheduleObj.current.isAdaptive) {
            let classElement = scheduleObj.current.element.querySelector('.e-device-hover');
            if (classElement) {
                classElement.classList.remove('e-device-hover');
            }
            if (event.target.classList.contains('e-work-cells')) {
                addClass([event.target], 'e-device-hover');
            }
        }
    };
    
    const onActionBegin = (event) => {
        if (event.requestType === 'eventCreate' && isTreeItemDropped) {
            const newEvent = event.data[0];
            
            let treeViewData = treeObj.current.fields.dataSource;
            const employeeName = employees.find(e => e.employee_id === newEvent.EmployeeId)?.employee_name || 'Not Name';

            newEvent.Subject = employeeName;

            console.log("Creando un nuevo evento" , newEvent);

            const currentEvents = scheduleObj.current.getEvents();
            console.log("On Action Begin:", currentEvents);
            const filteredPeople = treeViewData.filter((item) => item.Id !== parseInt(draggedItemId, 10));
            treeObj.current.fields.dataSource = filteredPeople;
            
            const overlappingEvents = currentEvents.filter( existingEvent  => {
              return (newEvent.StartTime < existingEvent.EndTime && newEvent.EndTime > existingEvent.StartTime) &&
              (newEvent.EmployeeId === existingEvent.EmployeeId) 
            });

            if (overlappingEvents.length > 0) {
              alert("Employee has a Task another Department in this Time");
              event.cancel = true;  
            } else {
              let elements = document.querySelectorAll('.e-drag-item.treeview-external-drag');
              for (let i = 0; i < elements.length; i++) {
                remove(elements[i]);
              }
        }}
    };

    const onTreeDragStop = (event) => {
        let treeElement = closest(event.target, '.e-treeview');
        let classElement = scheduleObj.current.element.querySelector('.e-device-hover');
        if (classElement) {
            classElement.classList.remove('e-device-hover');
        }
        if (!treeElement) {
            event.cancel = true;
            let scheduleElement = closest(event.target, '.e-content-wrap');
            if (scheduleElement) {
                let treeviewData = treeObj.current.fields.dataSource;
                if (event.target.classList.contains('e-work-cells')) {
                    const filteredData = treeviewData.filter((item) => item.employee_id === parseInt(event.draggedNodeData.id, 10));
                    let cellData = scheduleObj.current.getCellDetails(event.target);
                    let resourceDetails = scheduleObj.current.getResourcesByIndex(cellData.groupIndex);
                    let eventData = {
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        Description: filteredData[0]?.Description || "", 
                        DepartmentID: resourceDetails.resourceData.Id,
                        EmployeeId : filteredData[0].employee_id 
                    };
                    scheduleObj.current.openEditor(eventData, 'Add', true);
                    isTreeItemDropped = true;
                    draggedItemId = event.draggedNodeData.id;
                    console.log("Despues de crearse el evento: ",eventData);
                }
            }
        }
        document.body.classList.remove('e-disble-not-allowed');
    };

    const onTreeDragStart = () => {
        document.body.classList.add('e-disble-not-allowed');
    };

    return (
    <div className='schedule-control-section'>
      <div className='col-lg-12 control-section'>
        <div className='control-wrapper drag-sample-wrapper'>
          <div className="schedule-container !ml-5">
            <div className="!title-container">
              <h1 className="!text-3xl !font-bold">Schedule <span className='text-green-700'>Employee </span> </h1>
            </div>
            <ScheduleComponent 
            ref={scheduleObj} 
            width='100%' 
            height='650px' 
            selectedDate={new Date()} 
            currentView='TimelineDay' 
            resourceHeaderTemplate={resourceHeaderTemplate} 
            eventSettings={{ 
              dataSource: filteredEvents,
            }}
            editorTemplate={(props) => editorTemplate({...props,workSpaces,employees})} 
            group={{ 
                resources: ['Departments']}}
            actionBegin={onActionBegin}
            actionComplete={onActionComplete}
            >
              <ResourcesDirective>
                <ResourceDirective 
                field='DepartmentID' 
                title='Department' 
                name='Departments' 
                allowMultiple={false} 
                dataSource={departmentData} 
                textField='Text' 
                idField='Id' 
                colorField='Color'/>
              </ResourcesDirective>
              <ViewsDirective>
                <ViewDirective option='TimelineDay'/>
                <ViewDirective option='TimelineMonth'/>
              </ViewsDirective>
              <Inject services={[TimelineViews, TimelineMonth, Resize, DragAndDrop]}/>
            </ScheduleComponent>
          </div>
          
          <div className="treeview-container !mx-5 !mb-4" >

            <div className="!title-container">
              <h1 className="!text-xl !font-bold">Waiting List</h1>
            </div>

            <div className="!h-[400px] scroll-container !overflow-y-auto !rounded-md !p-3 !shadow-sm">
              <TreeViewComponent  
                ref={treeObj} 
                cssClass='treeview-external-drag'
                className='!mb-4'
                dragArea=".drag-sample-wrapper" 
                nodeTemplate={treeTemplate} 
                fields={fields} 
                nodeDragStop={onTreeDragStop} 
                nodeSelecting={onItemSelecting} 
                nodeDragging={onTreeDrag} 
                nodeDragStart={onTreeDragStart} 
                allowDragAndDrop={allowDragAndDrops}
              />
            </div>

              <form className="!event-search" id="form-search">                
                <table id="property-specific" style={{ width: '100%' }}>
                  <tbody>
                    <tr className="!row" style={{ height: '45px' }}>
                      <td className="!property-panel-content" colSpan={2}>
                         <MultiSelectComponent  
                         value={filters.departmentsId}  
                         id="comboelement" 
                         dataSource={workSpaces} 
                         allowFiltering={true} 
                         fields={{text:'workspace_name', value:'workspace_id'}}
                         change={(e)=> setFilters(prev =>({...prev, departmentsId: e.value}))}                          
                         placeholder="Select Work Spaces" />
                      </td>
                    </tr>

                    <tr className="!row" style={{ height: '45px' }}>
                      <td className="!property-panel-content" colSpan={2}>
                         <MultiSelectComponent  
                         value={filters.employeesId}  
                         id="comboelement" 
                         dataSource={employees} 
                         allowFiltering={true} 
                         fields={{text: 'employee_name', value:'employee_id'}}
                         change={(e)=> setFilters(prev =>({...prev, employeesId: e.value}))}  
                         placeholder="Select Employee" />
                      </td>
                    </tr>
                    <tr className="!row" style={{ height: '45px' }}>
                      <td className="!property-panel-content" colSpan={2}>
                        <DatePickerComponent 
                        className="!search-field !e-start-time"
                        key={filters.startTime || 'start'} 
                        value={filters.startTime} 
                        data-name="StartTime" 
                        showClearButton={false} 
                        placeholder="Start Time"
                        change={(e)=> setFilters(prev =>({...prev, startTime: e.value}))}
                        >  
                        </DatePickerComponent>
                      </td>
                    </tr>
                    <tr className="!row" style={{ height: '45px' }}>
                      <td className="!property-panel-content" colSpan={2}>
                        <DatePickerComponent 
                        className="!search-field !e-end-time"
                        key={filters.endTime || 'end'} 
                        value={filters.endTime} 
                        data-name="EndTime" 
                        showClearButton={false} 
                        placeholder="End Time"
                        change={(e)=> setFilters(prev =>({...prev, endTime: e.value}))}
                        >
                        </DatePickerComponent>
                      </td>
                    </tr>
                    <tr className="!row" style={{ height: '45px' }}>
                     <td className="!e-field !button-customization" style={{ width: '50%', padding: '15px' }}>
                        <ButtonComponent cssClass='e-success' title='Search' type='button'  onClick={handleFilterSearch} >Search</ButtonComponent>
                      </td> 
                      <td className="!e-field !button-customization" style={{ width: '50%', padding: '15px' }}>
                        <ButtonComponent cssClass='e-danger' title='Clear' type='button' onClick={handleFilterClear} >Clear</ButtonComponent>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>


          </div>
        </div>
        <div className="!flex !justify-center !my-6">
          <IAForm loading={loading} onSubmit={handleScheduleSubmit} />
        </div>
      </div>
    </div>
  );
};
