import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { EditButton } from "../../components";
import { UseControlModal, useGetStudentDataArray } from "../../hooks";
import { useForm } from "react-hook-form";
import { Button, Cascader, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import {
  useGetStudentsUsersQuery,
  useUpdateUserMutation,
} from "../../slice/UsersApi";
import { useGetAllBranchsQuery } from "../../slice/BranchApi";

interface User {
  id: number;
  name: string;
  surname: string;
  role: string;
  branch?: string;
  birthday: string;
  email: string;
  phone: string;
  studentArrayId?: string[];
  gender: string;
  residence: string[];
  password: string;
  prefix: string;
}

type UserComponentProps = {
  user: User;
  users: User[];
  setUsers: (newUsers: User[]) => void;
};

const { Option } = Select;

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const { RangePicker } = DatePicker;
const config = {
  rules: [
    { type: "object" as const, required: true, message: "Please select time!" },
  ],
};

const EditUserModal = ({ user }: UserComponentProps) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedstudentDataArrat, setSelectedstudentDataArrat] = useState([]);

  const {
    // handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [form] = Form.useForm();

  const {
    data: branchsData,
    isLoading: isLoadingBranchs,
    isError: isErrorBranchs,
    error: branchsError,
  } = useGetAllBranchsQuery();
  const branchs = branchsData;
  const {
    data: studentUsersDAtas,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
    error: studentsError,
  } = useGetStudentsUsersQuery();
  const studentDataArrat = studentUsersDAtas;
  const [updateUser] = useUpdateUserMutation();
  const { isOpen, setIsOpen, openModal, handleBackdropClick, closeModal } =
    UseControlModal();
  const roles = ["Student", "Administrateur", "Teacher", "Parent"];

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="237">+237</Option>
      </Select>
    </Form.Item>
  );

  const residences: CascaderProps<DataNodeType>["options"] = [
    {
      value: "Yaounde",
      label: "Yaounde",
      children: [
        {
          value: "Soa",
          label: "Soa",
          children: [
            {
              value: "Rue Hysacam",
              label: "University",
            },
          ],
        },
      ],
    },
    {
      value: "Yaounde",
      label: "Yaounde",
      children: [
        {
          value: "Nlongkak",
          label: "Nlongkak",
          children: [
            {
              value: "Sous-prefecture",
              label: "Service du gouverneur",
            },
          ],
        },
      ],
    },
  ];
  console.log(user);
  // Initialisation des valeurs
  useEffect(() => {
    if (user) {
      // Trouver la branche correspondante si Student
      const initialBranch =
        user.role === "Student" && user.branch
          ? branchs?.find((b) => b.id === user.branch) || null
          : null;

      // Trouver les étudiants correspondants si Parent
      const initialstudentDataArrat =
        user.role === "Parent" && user.studentArrayId
          ? studentDataArrat?.filter((s) => user.studentArrayId?.includes(s.id))
          : [];

      form.setFieldsValue({
        ...user,
        birthday: user.birthday ? dayjs(user.birthday) : null, // Conversion pour DatePicker
      });

      setSelectedRole(user.role);
      setSelectedBranch(initialBranch);
      setSelectedstudentDataArrat(initialstudentDataArrat);
    }
  }, [user, branchs, studentDataArrat, form]);

  const onFinish = async (values: User) => {
    try {
      // 1. Préparation des données
      const updatedData = {
        ...values,
        id: user.id, // Conserver l'ID original
        password: user.password,
        birthday: values.birthday?.format("YYYY-MM-DD") || null, // Formatage sécurisé
        ...(selectedRole === "Student" && { branch: selectedBranch?.id }),
        ...(selectedRole === "Parent" && {
          studentArrayId: selectedstudentDataArrat.map((s) => s.id),
        }),
      };
      console.log("Updated data:", updatedData);

      // 2. Appel à l'API - RTK Query gère automatiquement le cache
      await updateUser(updatedData).unwrap();

      // 3. Feedback et reset
      toast.success("Utilisateur mis à jour avec succès");
      form.resetFields(); // Vide tous les champs
      closeModal();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast.error(error.data?.message || "Échec de la mise à jour");
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    // Reset les sélections quand le rôle change
    setSelectedBranch(null);
    setSelectedstudentDataArrat([]);
    form.setFieldsValue({
      brancnId: undefined,
      studentArrayId: undefined,
    });
  };

  if (isLoadingBranchs || isLoadingStudents) return <div>Loading...</div>;
  if (isErrorBranchs || isErrorStudents) return <div>Error loading data</div>;

  return (
    <div className="bg-green h-auto">
      {/* Bouton d'ouverture */}

      <EditButton onClick={openModal} text="Edit user" />

      {/* Overlay du modal */}
      <div
        style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-opacity-50 flex items-center justify-center ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Edit</h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{ gender: "Male", prefix: "237" }}
            style={{ maxWidth: 600 }}
            scrollToFirstError
            className="text-md font-medium text-gray-700"
          >
            {/* Section Informations de base */}

            <Form.Item
              name="surname"
              label="Surname"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="residence"
              label="Habitual Residence"
              rules={[
                {
                  type: "array",
                  required: true,
                  message: "Please select your habitual residence!",
                },
              ]}
            >
              <Cascader options={residences} />
            </Form.Item>

            <Form.Item
              name="birthday"
              label="Birthday"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone number"
              rules={[{ required: true }]}
            >
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            </Form.Item>

            {/* Section Rôle et champs conditionnels */}
            <Form.Item name="role" label="Rôle" rules={[{ required: true }]}>
              <Select
                onChange={handleRoleChange}
                placeholder="Sélectionner un rôle"
              >
                {roles.map((role) => (
                  <Select.Option key={role} value={role}>
                    {role}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Champ conditionnel pour Student */}
            {selectedRole === "Student" && (
              <Form.Item label="Branch" required>
                <Autocomplete
                  options={branchs}
                  getOptionLabel={(option) => option.name}
                  value={selectedBranch}
                  onChange={(event, newValue) => {
                    setSelectedBranch(newValue);
                    form.setFieldsValue({ branch: newValue?.id });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Branch"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
                {/* Champ caché pour la valeur brancnId */}
                <Form.Item name="branch" noStyle>
                  <Input type="hidden" />
                </Form.Item>
              </Form.Item>
            )}

            {/* Champ conditionnel pour Parent */}
            {selectedRole === "Parent" && (
              <Form.Item label="Children" required>
                <Autocomplete
                  multiple
                  options={studentDataArrat}
                  getOptionLabel={(option) =>
                    `${option.name} ${option.surname}`
                  }
                  value={selectedstudentDataArrat}
                  onChange={(event, newValue) => {
                    setSelectedstudentDataArrat(newValue);
                    form.setFieldsValue({
                      studentArrayId: newValue.map((s) => s.id),
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Children"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
                {/* Champ caché pour la valeur studentArrayId */}
                <Form.Item name="studentArrayId" noStyle>
                  <Input type="hidden" />
                </Form.Item>
              </Form.Item>
            )}

            {/* Champ Sexe */}
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                size="large"
              >
                Edit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
