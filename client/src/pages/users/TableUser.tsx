import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type {
  GetProp,
  InputRef,
  TableColumnsType,
  TableColumnType,
  TableProps,
  TablePaginationConfig,
} from "antd";
import { Button, Input, Space, Table, Tag } from "antd";
import type {
  FilterDropdownProps,
  SorterResult,
} from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import RegistrationModal from "../../components/user/RegistrationModal";
import EditUserModal from "../../components/user/EditUserModal";
import toast from "react-hot-toast";
import { DeleteButton } from "../../components";
import { useParams } from "react-router-dom";
import { useGetUsersQuery, useDeleteUserMutation } from "../../slice/UsersApi";
import dayjs from "dayjs";

interface Student {
  id: string;
  name: string;
  surname: string;
}

interface UserType {
  id: string;
  key: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: "Student" | "Parent" | "Teacher" | "Administrateur";
  birthday: string;
  branch?: string;
  studentArrayId?: string[];
  gender: "male" | "female";
  residence: string;
  prefix: string;
  students: Student[];
  branchName: string;
}

type DataIndex = keyof UserType;
type TableRowSelection<T> = TableProps<T>["rowSelection"];
type TableParams = {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: "ascend" | "descend";
  filters?: Record<string, any>;
};

const TableUser: React.FC = () => {
  // States pour la recherche
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const { role } = useParams();

  // States pour la pagination/tri
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  // State pour la sélection de lignes
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // RTK Query hooks
  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery({
    page: tableParams.pagination?.current || 1,
    pageSize: tableParams.pagination?.pageSize || 5,
    gender: tableParams.filters?.sexe?.join(","),
    role: role,
  });

  const [deleteUser] = useDeleteUserMutation();

  // Mettre à jour la pagination avec le totalCount
  useEffect(() => {
    if (usersData?.totalCount !== undefined) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: usersData.totalCount,
        },
      }));
    }
  }, [usersData]);

  // Fonctions pour la recherche
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<UserType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Fonctions pour la sélection de lignes
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<UserType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Rows",
        onSelect: (changeableRowKeys) => {
          const newSelectedRowKeys = changeableRowKeys.filter(
            (_, index) => index % 2 === 0
          );
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Rows",
        onSelect: (changeableRowKeys) => {
          const newSelectedRowKeys = changeableRowKeys.filter(
            (_, index) => index % 2 !== 0
          );
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error("Échec de la suppression de l'utilisateur");
    }
  };

  // Gestion du changement de table (tri, pagination, filtres)
  const handleTableChange: TableProps<UserType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters: { ...filters, role: role ? [role] : undefined },
      sortField: (sorter as SorterResult<UserType>).field as string,
      sortOrder: (sorter as SorterResult<UserType>).order,
    });

    if (pagination.current !== tableParams.pagination?.current) {
      setSelectedRowKeys([]);
    }
  };

  // Configuration des colonnes
  const columns: TableColumnsType<UserType> = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => `${text} ${record.surname}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Sexe",
      dataIndex: "gender",
      key: "residence",
      width: "15%",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
      ],
    },
    {
      title: "Address",
      dataIndex: "residence",
      key: "residence",
      width: "20%",
      ...getColumnSearchProps("residence"),
      render: (residenceArray) => residenceArray?.join(", ") || "-",
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
      key: "phone",
      width: "15%",
      ...getColumnSearchProps("phone"),
      render: (text, record) => `+${record.prefix} ${text}`,
    },
    ...(role === "Student"
      ? [
          {
            title: "Branch",
            dataIndex: "branchName",
            key: "branchName",
            width: "15%",
            ...getColumnSearchProps("branchName"),
            sorter: (a, b) => (a.branch || "").localeCompare(b.branch || ""),
          },
        ]
      : []),
    ...(role === "Parent"
      ? [
          {
            title: "Children Name",
            dataIndex: "students",
            key: "students",
            width: "15%",
            ...getColumnSearchProps("students"),
            render: (studentArray) => studentArray?.map(renderStudent),
          },
        ]
      : []),
    {
      title: "Date de naissance",
      dataIndex: "birthday",
      key: "birthday",
      width: "15%",
      render: (dateString) =>
        dateString ? dayjs(dateString).format("DD/MM/YYYY") : "-",
      sorter: (a, b) => dayjs(a.birthday).unix() - dayjs(b.birthday).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space size="small">
          <EditUserModal user={record} />
          <DeleteButton
            onClick={() => handleDeleteUser(record.id)}
            text="Delete user"
          />
        </Space>
      ),
    },
  ];

  const renderStudent = (student) => (
    <h3 key={student.id}>
      {student.name} {student.surname}
      {", "}
    </h3>
  );

  // Gestion des erreurs
  if (isError) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  // Formatage des données
  const formattedUsers =
    usersData?.users?.map((user) => ({
      ...user,
      key: user.id,
    })) || [];

  return (
    <main className="ml-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage {role}</h1>
      </div>

      <Table
        className="w-full"
        rowSelection={rowSelection}
        columns={columns}
        rowKey="id"
        dataSource={formattedUsers}
        pagination={tableParams.pagination}
        loading={isLoading}
        onChange={handleTableChange}
        style={{ margin: "16px", zIndex: 1 }}
      />
    </main>
  );
};

export default TableUser;
