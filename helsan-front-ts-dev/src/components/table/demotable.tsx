import { useState } from "react";
import Table from ".";
import { PiPlusCircle } from "react-icons/pi";

// ------------ Example Usage ------------
export function DemoTable() {
  // ✅ 1. Added a 'description' field for expanded content
  type User = {
    id: number;
    name: string;
    email: string;
    age: number;
    role: "Admin" | "Editor" | "Viewer";
    description: string;
  };

  const data: User[] = Array.from({ length: 57 }).map((_, i) => {
    const role = ["Admin", "Editor", "Viewer"][i % 3] as User["role"];
    const name = `User ${i + 1}`;
    const age = 18 + ((i * 7) % 40);
    return {
      id: i + 1,
      name,
      email: `user${i + 1}@mail.com`,
      age,
      role,
      description: `This is a detailed bio for ${name}. They are ${age} years old and currently hold the role of ${role}. They have been with the company for ${
        (i % 5) + 1
      } years.`,
    };
  });

  const [selected, setSelected] = useState<React.Key[]>([]);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        User Management Table
      </h2>
      <Table<User>
        columns={[
          { key: "name", title: "Name", dataIndex: "name", sorter: true },
          { key: "email", title: "Email", dataIndex: "email", width: 240 },
          {
            key: "age",
            title: "Age",
            dataIndex: "age",
            align: "right",
            sorter: (a, b) => a.age - b.age,
            defaultSortOrder: "ascend",
          },
          {
            key: "role",
            title: "Role",
            dataIndex: "role",
            filters: [
              { text: "Admin", value: "Admin" },
              { text: "Editor", value: "Editor" },
              { text: "Viewer", value: "Viewer" },
            ],
            render: (role) => {
              const color =
                role === "Admin"
                  ? "bg-red-100 text-red-800"
                  : role === "Editor"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800";
              return (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}
                >
                  {role}
                </span>
              );
            },
          },
          {
            key: "action",
            title: "Action",
            render: (_, r) => (
              <button
                className="text-blue-600 hover:underline"
                onClick={() => alert(`Edit ${r.name}`)}
              >
                Edit
              </button>
            ),
          },
        ]}
        dataSource={data}
        rowKey="id"
        stickyHeader
        bordered
        hoverable
        hoverColor="blue"
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: [5, 8, 10, 20],
        }}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: (keys) => setSelected(keys),
        }}
        expandable={{
          expandedRowRender: () => (
            <Table
              dataSource={[
                {
                  fatherName: "gg",
                },
              ]}
              columns={[
                {
                  key: "fatherName",
                  title: "fatherName",
                  dataIndex: "fatherName",
                },
              ]}
              pagination={false}
            />
          ),
          rowExpandable: (record) => record.role !== "Viewer",
          expandIcon: <PiPlusCircle />,
        }}
        styles={{
          expandedCell: "!bg-transparent p-2",
          
          // Using default styles now, but you can override if needed
          // headerRow: "!bg-gray-200 dark:!bg-gray-800",
          // tr: "dark:!bg-zinc-900",
        }}
        onChange={({ pagination, sorter, filters }) => {
          // You can sync states here if needed
          console.log({ pagination, sorter, filters });
        }}
      />
    </div>
  );
}
