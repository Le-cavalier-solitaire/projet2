import toast from "react-hot-toast";
import { EditButton } from "../../components";
import { UseControlModal } from "../../hooks";
import { useUpdateBranchMutation } from "../../slice/BranchApi";
import { useForm } from "react-hook-form";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";

interface BranchType {
  name: string;
  id: string;
  create_at: string;
}
interface Props {
  branch: BranchType;
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

const EditBranchModal = ({ branch }: Props) => {
  console.log(branch);
  const { isOpen, setIsOpen, openModal, handleBackdropClick, closeModal } =
    UseControlModal();
  const {
    // handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [updateBranch] = useUpdateBranchMutation();
  const [form] = Form.useForm();

  // Initialisation des valeurs
  useEffect(() => {
    if (branch) {
      form.setFieldsValue({
        name: branch.name, // Passez directement la propriété name
      });
    }
  }, [branch, form]);

  const onFinish = async (values: BranchType) => {
    try {
      // 1. Préparation des données
      const updatedData = {
        ...values,
        id: branch.id, // Conserver l'ID original
      };
      console.log("Updated data:", updatedData);

      // 2. Appel à l'API - RTK Query gère automatiquement le cache
      await updateBranch(updatedData).unwrap();

      // 3. Feedback et reset
      toast.success("branche mis à jour avec succès");
      form.resetFields(); // Vide tous les champs
      closeModal();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast.error(error.data?.message || "Échec de la mise à jour");
    }
  };

  return (
    <div className="bg-green h-auto">
      {/* Bouton d'ouverture */}

      <EditButton onClick={openModal} text="Edit branch" />

      {/* Overlay du modal */}
      <div
        onClick={handleBackdropClick}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        className={`fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        {/* Contenu du modal */}
        <div className="bg-white rounded-lg shadow-xl w-[600px] p-6 mx-4 relative">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-mono text-[28px] font-bold text-gray-800">
              Edit branch
            </h2>
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
            initialValues={{}}
            style={{ maxWidth: 600 }}
            scrollToFirstError
            className="text-md font-medium text-gray-700"
          >
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input className="uppercase h-[40px]" />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", height: "40px" }}
                size="large"
              >
                Update
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditBranchModal;
