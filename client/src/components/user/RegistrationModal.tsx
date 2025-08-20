import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../../assets/registrationuser.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useGetStudentDataArray } from "../../hooks";
import { BASE_URL } from "../../api";
import { useForm } from "react-hook-form";
import { Button, Cascader, DatePicker, Form, Input, Select } from "antd";
import {
  useAddUserMutation,
  useGetStudentsUsersQuery,
  useLazyCheckExistingUserQuery,
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
  prefix: string;
}
type UserComponentProps = {
  users: User[];
  setUsers: () => void;
};
interface Branch {
  id: string;
  name: string;
  create_at: string;
}
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

const RegistrationModal = () => {
  const {
    // handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [checkExistingUser] = useLazyCheckExistingUserQuery();
  const [createUser] = useAddUserMutation();

  const onFinish = async (values: any) => {
    const formData = {
      ...values,
      ...(selectedRole === "Student" && { brancnId: selectedBranch?.id }),
      ...(selectedRole === "Parent" && {
        studentArrayId: selectedStudents.map((s) => s.id),
      }),
    };
    console.log("Received values of form: ", values);
    try {
      // 1. Vérification de l'existence de l'email/téléphone
      const checkResult = await checkExistingUser({
        email: values.email,
        telephone: values.phone,
      }).unwrap();

      if (checkResult.exists) {
        if (checkResult.existingField === "email") {
          toast.error("Cet email est déjà utilisé");
          form.setFields([{ name: "email", errors: ["Email déjà utilisé"] }]);
        }
        if (checkResult.existingField === "phone") {
          toast.error("Ce numéro de téléphone est déjà utilisé");
          form.setFields([
            { name: "phone", errors: ["Téléphone déjà utilisé"] },
          ]);
        }
        return;
      }

      // 2. Envoi des données
      const response = await createUser(values).unwrap();

      toast.success("Utilisateur créé avec succès!");
      form.resetFields();
      setSelectedBranch(null);
      setSelectedStudents([]);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Une erreur est survenue lors de la création");
    }
  };

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
  const roles = ["Student", "Administrateur", "Teacher", "Parent"];

  if (isLoadingBranchs || isLoadingStudents) return <div>Loading...</div>;
  if (isErrorBranchs || isErrorStudents) return <div>Error loading data</div>;

  return (
    <div className=" h-full space-y-4">
      {/* Contenu du modal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4 borderstyle"
          style={{
            backgroundColor: "#f6f8fa",
          }}
        >
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          </div>

          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              residence: ["Yaounde", "Nlongkak", "Sous-prefecture"],
              prefix: "237",
            }}
            style={{ maxWidth: 600 }}
            scrollToFirstError
            className="text-md font-medium text-gray-700"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                  whitespace: true,
                },
              ]}
            >
              <Input className="uppercase" />
            </Form.Item>

            <Form.Item
              name="surname"
              label="Surname"
              rules={[
                {
                  required: true,
                  message: "Please input your surname!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="birthday"
              label="Birthday"
              {...config}
              rules={[
                {
                  type: "date",
                  message: "The input is not valid Date!",
                },
                {
                  required: true,
                  message: "Please input your birthDay!",
                },
              ]}
            >
              <DatePicker className="w-full" size="large" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
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
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select placeholder="select your gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role!" }]}
            >
              <Select
                placeholder="select your role"
                onChange={(value) => {
                  setSelectedRole(value);
                  // Reset les sélections quand le rôle change
                  setSelectedBranch(null);
                  setSelectedStudents([]);
                }}
              >
                <Select.Option value="">Sélectionner un rôle</Select.Option>
                {roles.map((role) => (
                  <Select.Option value={role} key={role}>
                    {role}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Champ conditionnel pour Student */}
            {selectedRole === "Student" && (
              <Form.Item
                label="Branche"
                name="branch"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une branche",
                  },
                ]}
              >
                <Autocomplete
                  disablePortal
                  options={branchs}
                  getOptionLabel={(option) => option.name}
                  value={selectedBranch || null}
                  onChange={(event, newBranch) => {
                    setSelectedBranch(newBranch);
                    form.setFieldsValue({ branch: newBranch?.id || null });
                  }}
                  sx={{ marginTop: 0 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Branch"
                      variant="outlined"
                    />
                  )}
                />
              </Form.Item>
            )}

            {/* Champ conditionnel pour Parent */}

            {selectedRole === "Parent" && (
              <Form.Item
                label="Children"
                name="children"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner au moins un enfant",
                  },
                ]}
              >
                <Autocomplete
                  multiple
                  limitTags={2}
                  id="multiple-limit-tags"
                  options={studentDataArrat}
                  getOptionLabel={(option) =>
                    `${option.name} ${option.surname}`
                  }
                  value={selectedStudents || null}
                  onChange={(event, newValue) => {
                    setSelectedStudents(newValue);
                    form.setFieldsValue({
                      children: newValue.map((student) => student.id),
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="children"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Form.Item>
            )}

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                size="large"
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="fontcustom"></div>
      </div>
    </div>
  );
};

export default RegistrationModal;
