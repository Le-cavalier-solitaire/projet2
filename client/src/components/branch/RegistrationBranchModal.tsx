import toast from "react-hot-toast";
import "../../assets/registrationuser.css";
import { useForm } from "react-hook-form";
import { Button, Form, Input } from "antd";
import {
  useAddBranchMutation,
  useLazyCheckExistingBranchQuery,
} from "../../slice/BranchApi";

interface Branch {
  id: string;
  name: string;
  create_at: string;
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

const RegistrationBranch = () => {
  const {
    // handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [form] = Form.useForm();
  const [checkExistingBranch] = useLazyCheckExistingBranchQuery();
  const [createBranch] = useAddBranchMutation();

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    try {
      // 1. Vérification de l'existence du nom de la branche
      const checkResult = await checkExistingBranch({
        name: values.name,
      }).unwrap();

      if (checkResult.exists) {
        if (checkResult.existingField === "name") {
          toast.error("branche déjà existante");
          form.setFields([
            { name: "name", errors: ["branche déjà existante"] },
          ]);
        }
        return;
      }

      // 2. Envoi des données
      const response = await createBranch(values).unwrap();

      toast.success("Branch créée avec succès!");
      form.resetFields();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Une erreur est survenue lors de la création");
    }
  };

  return (
    <div className=" flex justify-center items-center fontBranch">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4 borderstyle"
        style={{
          backgroundColor: "#f6f8fa",
        }}
      >
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create Branch</h2>
        </div>

        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{}}
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
            <Input className="uppercase h-[40px]" />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", height: "40px" }}
              size="large"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegistrationBranch;
