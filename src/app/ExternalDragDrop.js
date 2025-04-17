'use client'
import * as React from 'react';
import { useRef } from 'react';
import { ScheduleComponent, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective, Inject, TimelineViews, Resize, DragAndDrop, TimelineMonth } from '@syncfusion/ej2-react-schedule';
import { closest, remove, addClass } from '@syncfusion/ej2-base';
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import dayjs from 'dayjs';


export default function ExternalDragDrop({employees, workSpaces, dateRegisters}) {
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
      })};

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
      })};

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
        })};



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


    const departmentData = workSpaces.map(workSpace => ({
      Text: workSpace.workspace_name,
      Id: workSpace.workspace_id,
      Color: workSpace.color
    }));

    const getConsultantName = (value) => {
        return value.resourceData[value.resource.textField];
    };
    const getConsultantImage = (value) => {
        return getConsultantName(value).toLowerCase();
    };
    const getConsultantDesignation = (value) => {
        return value.resourceData.Designation;
    };
    const resourceHeaderTemplate = (props) => {
        return (<div className="template-wrap">
        <div className="specialist-category">
          <div className={"specialist-image " + getConsultantImage(props)}></div>
          <div className="specialist-name"> {getConsultantName(props)}</div>
          <div className="specialist-designation">{getConsultantDesignation(props)}</div>
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

    const editorTemplate = (props) => {
      console.log("Props recibidos:", props);
      return (
        <table className="custom-event-editor" style={{ width: '100%' }} cellPadding={5}>
        <tbody>

          <tr>
            <td className="e-textlabel">Department</td>
            <td colSpan={4}>
              <DropDownListComponent 
                id="DepartmentID" 
                placeholder='Select Department' 
                data-name='DepartmentID' 
                className="e-field"
                style={{ width: '100%' }} 
                dataSource={workSpaces}
                fields={{text:'workspace_name', value:'workspace_id'}}
              />
            </td>
          </tr>

          <tr>
            <td className="e-textlabel">Employee</td>
            <td colSpan={4}>
              <DropDownListComponent 
                id="EmployeeId"
                placeholder='Select Employee' 
                data-name='EmployeeId' 
                className="e-field" 
                style={{ width: '100%' }} 
                dataSource={employees} 
                fields={{text: 'employee_name', value:'employee_id'}}
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">From</td>
            <td colSpan={4}>
              <DateTimePickerComponent 
                id="StartTime" 
                format='dd/MM/yy hh:mm a' 
                data-name="StartTime"
                className="e-field" 
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">To</td>
            <td colSpan={4}>
              <DateTimePickerComponent 
                id="EndTime" 
                format='dd/MM/yy hh:mm a' 
                data-name="EndTime" 
                className="e-field"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Description</td>
            <td colSpan={4}>
              <textarea 
                id="Description" 
                className="e-field e-input" 
                name="Description" 
                rows={3} 
                cols={50} 
                style={{ width: '100%', height: '60px', resize: 'vertical' }} 
              />
            </td>
          </tr>
        </tbody>
      </table>
      );
    };
    
    return (
    <div className='schedule-control-section'>
      <div className='col-lg-12 control-section'>
        <div className='control-wrapper drag-sample-wrapper'>
          <div className="schedule-container">
            <div className="title-container">
              <h1 className="title-text text-2xl font-semibold">Schedule <span className='test-color'>Employee </span> </h1>
            </div>
            <ScheduleComponent 
            ref={scheduleObj} 
            cssClass='schedule-drag-drop' 
            width='100%' 
            height='650px' 
            selectedDate={new Date(2025, 3, 4)} 
            currentView='TimelineDay' 
            resourceHeaderTemplate={resourceHeaderTemplate} 
            eventSettings={{ 
              dataSource: dataRegisters,
            }}
            editorTemplate={editorTemplate} 
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
          <div className="treeview-container">
            <div className="title-container">
              <h1 className="title-text">Waiting List</h1>
            </div>
            <TreeViewComponent 
              ref={treeObj} 
              cssClass='treeview-external-drag'
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
        </div>
      </div>
    </div>
  );
};
