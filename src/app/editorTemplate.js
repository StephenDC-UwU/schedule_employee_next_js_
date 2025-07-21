import React from "react";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

const editorTemplate = ({ workSpaces, employees, ...props }) => {
  console.log("Props recibidos:", props);
  return (
    <table
      className="custom-event-editor"
      style={{ width: "100%" }}
      cellPadding={5}
    >
      <tbody>
        <tr>
          <td className="e-textlabel">Department</td>
          <td colSpan={4}>
            <DropDownListComponent
              id="DepartmentID"
              placeholder="Select Department"
              data-name="DepartmentID"
              className="e-field"
              style={{ width: "100%" }}
              dataSource={workSpaces}
              fields={{ text: "workspace_name", value: "workspace_id" }}
            />
          </td>
        </tr>

        <tr>
          <td className="e-textlabel">Employee</td>
          <td colSpan={4}>
            <DropDownListComponent
              id="EmployeeId"
              placeholder="Select Employee"
              data-name="EmployeeId"
              className="e-field"
              style={{ width: "100%" }}
              dataSource={employees}
              fields={{ text: "employee_name", value: "employee_id" }}
            />
          </td>
        </tr>
        <tr>
          <td className="e-textlabel">From</td>
          <td colSpan={4}>
            <DateTimePickerComponent
              id="StartTime"
              format="dd/MM/yy hh:mm a"
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
              format="dd/MM/yy hh:mm a"
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
              style={{ width: "100%", height: "60px", resize: "vertical" }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default editorTemplate;
