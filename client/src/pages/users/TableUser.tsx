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
import axios from "axios";
import RegistrationModal from "../../components/user/RegistrationModal";
import EditUserModal from "../../components/user/EditUserModal";
import toast from "react-hot-toast";
import { DeleteButton } from "../../components";
import { BASE_URL } from "../../api";

interface UserType {
  id: string;
  key: string;
  name: string;
  surname: string;
  mail: string;
  telephone: string;
  role: "Student" | "Parent" | "Teacher" | "Administrateur";
  dob: string;
  brancnId?: string;
  studentArrayId?: string[];
  sexe: "male" | "female";
  adresse: string;
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

  // States pour la pagination/tri
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  // State pour la sélection de lignes
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
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

  //fonction pour supprimer un user
  const deleteUser = (id: string) => {
    axios
      .delete(`${BASE_URL}/api/deleteUser/${id}`)
      .then((response) => {
        setUsers(users.filter((user) => user.id !== id));
        toast.success("Utilisateur supprimé avec succès");
      })
      .catch((error) => {
        alert("Unable to delete User");
      });
  };

  // Fonction pour récupérer les données depuis l'API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { current, pageSize } = tableParams.pagination || {};
      const { sexe, role } = tableParams.filters || {};

      // Construire les paramètres de requête
      const params = {
        page: current,
        pageSize,
        ...(sexe && { gender: sexe.join(",") }), // Envoie les filtres genre
        ...(role && { role: role.join(",") }), // Et les rôles si besoin
      };

      const response = await axios(`${BASE_URL}/api/users`, {
        params,
      });

      const data = response.data.users;

      console.log(data);

      // Formater les données avec une clé unique
      const formattedUsers = data.map((user: any) => ({
        ...user,
        key: user.id, // Utilisation de l'id comme clé
      }));

      setUsers(formattedUsers);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.data.totalCount || data.length,
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(tableParams)]);

  // Gestion du changement de table (tri, pagination, filtres)
  const handleTableChange: TableProps<UserType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      sortField: (sorter as SorterResult<UserType>).field as string,
      sortOrder: (sorter as SorterResult<UserType>).order,
    });

    // Reset la sélection si la page change
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
      dataIndex: "mail",
      key: "mail",
      width: "20%",
      ...getColumnSearchProps("mail"),
    },
    {
      title: "Sexe",
      dataIndex: "sexe",
      key: "sexe",
      width: "15%",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
      ],
    },
    {
      title: "Address",
      dataIndex: "adresse",
      key: "adresse",
      width: "20%",
      ...getColumnSearchProps("adresse"),
    },
    {
      title: "Téléphone",
      dataIndex: "telephone",
      key: "telephone",
      width: "15%",
      ...getColumnSearchProps("telephone"),
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
      width: "15%",
      filters: [
        { text: "Étudiant", value: "Student" },
        { text: "Parent", value: "Parent" },
        { text: "Enseignant", value: "Teacher" },
        { text: "Administrateur", value: "Administrateur" },
      ],
      render: (role: UserType["role"]) => {
        let color = "";
        switch (role) {
          case "Student":
            color = "green";
            break;
          case "Parent":
            color = "blue";
            break;
          case "Teacher":
            color = "orange";
            break;
          case "Administrateur":
            color = "red";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: "Date de naissance",
      dataIndex: "dob",
      key: "dob",
      width: "15%",
      sorter: (a, b) => new Date(a.dob).getTime() - new Date(b.dob).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space size="small">
          {/* Modal d'édition */}
          <EditUserModal user={record} users={users} setUsers={setUsers} />
          <DeleteButton
            onClick={() => deleteUser(record.id)}
            text="Delete user"
          />
        </Space>
      ),
    },
  ];

  return (
    <main className="ml-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>

        <RegistrationModal users={users} setUsers={setUsers} />
      </div>

      <Table
        className="w-full"
        rowSelection={rowSelection}
        columns={columns}
        rowKey="id"
        dataSource={users}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        style={{ margin: "16px", zIndex: 1 }}
        // scroll={{ x: true }}
      />
    </main>
  );
};

export default TableUser;
