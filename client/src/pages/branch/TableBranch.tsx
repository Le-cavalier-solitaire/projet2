import React, { useRef, useState, useEffect, useMemo } from "react";
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
import toast from "react-hot-toast";
import { DeleteButton } from "../../components";
import EditBranchModal from "../../components/branch/EditBranchModal";
import RegistrationBranchModal from "../../components/branch/RegistrationBranchModal";
import {
  useDeleteBranchMutation,
  useGetBranchsQuery,
} from "../../slice/BranchApi";

interface BranchType {
  name: string;
  id: string;
  create_at: string;
}

type DataIndex = keyof BranchType;
type TableRowSelection<T> = TableProps<T>["rowSelection"];
type TableParams = {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: "ascend" | "descend";
  filters?: Record<string, any>;
};

const TableBranch: React.FC = () => {
  // States pour la recherche
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
    data: branchsData,
    isLoading,
    isError,
    error,
  } = useGetBranchsQuery({
    page: tableParams.pagination?.current || 1,
    pageSize: tableParams.pagination?.pageSize || 5,
  });

  const [deleteBranch] = useDeleteBranchMutation();

  // Mettre à jour la pagination avec le totalCount
  useEffect(() => {
    if (branchsData?.totalCount !== undefined) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: branchsData.totalCount,
        },
      }));
    }
  }, [branchsData]);

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
  ): TableColumnType<BranchType> => ({
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

  const rowSelection: TableRowSelection<BranchType> = {
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
  const handleDeleteBranch = async (id: string) => {
    try {
      await deleteBranch(id).unwrap();
      toast.success("Branche supprimé avec succès");
    } catch (error) {
      toast.error("Échec de la suppression de la branche");
    }
  };

  // Gestion du changement de table (tri, pagination, filtres)
  const handleTableChange: TableProps<BranchType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters: { filters },
      sortField: (sorter as SorterResult<BranchType>).field as string,
      sortOrder: (sorter as SorterResult<BranchType>).order,
    });

    if (pagination.current !== tableParams.pagination?.current) {
      setSelectedRowKeys([]);
    }
  };

  // Configuration des colonnes
  const columns: TableColumnsType<BranchType> = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      width: "65%",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => `${text}`,
    },
    {
      title: "Create Date",
      dataIndex: "create_at",
      key: "create_at",
      width: "35%",
      sorter: (a, b) =>
        new Date(a.create_at).getTime() - new Date(b.create_at).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space size="small">
          {/* Modal d'édition */}
          <EditBranchModal branch={record} />
          <DeleteButton
            onClick={() => handleDeleteBranch(record.id)}
            text="Delete branch"
          />
        </Space>
      ),
    },
  ];

  // Gestion des erreurs
  if (isError) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  // Formatage des données
  const formattedbranchs =
    branchsData?.branchs?.map((branch) => ({
      ...branch,
      key: branch.id,
    })) || [];

  return (
    <main className="ml-6 p-8 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage branchs</h1>

        {/* <RegistrationBranchModal  /> */}
      </div>
      <div className="flex justify-center items-center">
        <Table
          className="w-[900px]"
          rowSelection={rowSelection}
          columns={columns}
          rowKey="id"
          dataSource={formattedbranchs}
          pagination={tableParams.pagination}
          loading={isLoading}
          onChange={handleTableChange}
          style={{ margin: "16px", zIndex: 1 }}
          // scroll={{ x: true }}
        />
      </div>
    </main>
  );
};

export default TableBranch;
