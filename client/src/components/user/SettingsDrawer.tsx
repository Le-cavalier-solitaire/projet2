import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeSettingsDrawer } from "../../slice/UI/UiSlice";
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useUpdateUserPasswordMutation } from "../../slice/UsersApi";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Password } from "@mui/icons-material";
import { validate } from "uuid";

export const SettingsDrawer = () => {
  const [updateUser] = useUpdateUserPasswordMutation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const { settingsDrawerOpen } = useSelector((state) => state.ui);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords don't match");
      form.setFields([
        { name: "confirmPassword", errors: ["Passwords don't match"] },
      ]);
      throw new Error("Passwords don't match");
    }
    try {
      // 1. Préparation des données
      const updatedData = {
        newPassword: values.password,
        currentPassword: values.currentPassword,
        id: user.id, // Conserver l'ID original
      };
      console.log("Updated data:", updatedData);

      // 2. Appel à l'API - RTK Query gère automatiquement le cache
      const result = await updateUser(updatedData).unwrap();
      if (result.message == "Mot de passe actuel incorrect") {
        toast.error("current password is wrong!");
        form.setFields([
          { name: "currentPassword", errors: ["current password is wrong!"] },
        ]);
        return;
      }

      // 3. Feedback et reset
      toast.success("Password mis à jour avec succès");
      form.resetFields(); // Vide tous les champs
      dispatch(closeSettingsDrawer());
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast.error(error.data?.message || "Échec de la mise à jour");
    }
  };

  const validatePassword = (_, value) => {
    if (value && form.getFieldValue("password") !== value) {
      return Promise.reject("Passwords don't match");
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (!user) {
      console.log("Redirection vers /login car pas d'utilisateur");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Drawer
      title="Setting"
      placement="right"
      width={550}
      open={settingsDrawerOpen}
      onClose={() => {
        dispatch(closeSettingsDrawer());
        form.resetFields();
      }}
      destroyOnClose
    >
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">Configuration password</h3>
        {/* Ajoute ici ton contenu (formulaires, préférences, etc.) */}
        <div className="border-1 border-gray-400 mb-3"></div>
        <Form
          name="passwordForm"
          form={form}
          initialValues={{ remember: true }}
          style={{ maxWidth: 360, marginTop: 35 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="currentPassword"
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 6, message: " min 6 caractars!" },
            ]}
            // validateStatus={
            //   form.getFieldError("currentPassword").length > 0 ? "error" : ""
            // }
            // help={form.getFieldError("currentPassword")[0]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Current Password"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your new Password!" },
              { min: 6, message: " min 6 caractars!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your Password!" },
              { validator: validatePassword },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};
