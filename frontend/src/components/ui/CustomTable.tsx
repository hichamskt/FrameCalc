import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";


interface TableData {
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Define the interface for table columns
interface TableColumn {
  key: string;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: TableData) => React.ReactNode;

}

// Define the props for the CustomTable component

interface CustomTableProps {
  data: TableData[];
  columns: TableColumn[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  selectable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteFunction : (quotationIds: (number | string )[]) => Promise<any>;

}

const CustomTable: React.FC<CustomTableProps> = ({
  data,
  columns,
  onSelectionChange,
  selectable = true,
  deleteFunction,
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map(row => row.id);
      setSelectedRows(new Set(allIds));
      onSelectionChange?.(allIds);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleRowSelect = (id: string | number, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <div className="w-full overflow-x-auto ">
      <table className="min-w-full bg-white border border-gray-600 rounded-lg shadow-sm">
        <thead className="bg-[#000842]">
          <tr>
            {selectable && (
              <th className="px-4 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[#000842] divide-y divide-gray-600">
          {data.map((row) => (
            <tr
              key={row.id}
              className={`hover:bg-[#37446B] transition-colors ${
                selectedRows.has(row.id) ? 'bg-[#37446B]' : ''
              }`}
            >
              {selectable && (
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-white">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRows.size > 0 && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg flex items-center justify-between">
          <p className="text-sm text-blue-800">
            {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
          </p>

          <div className='text-3xl text-red-400 cursor-pointer hover:text-red-600 transition-colors' onClick={()=>deleteFunction([...selectedRows])}>
          <MdDelete />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable ;