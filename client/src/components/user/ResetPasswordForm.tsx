import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, message, Spin, Typography } from "antd";
import {
  MailOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useLazyCheckExistingUserQuery } from "../../slice/UsersApi";
import { useResetPasswordAccountMutation } from "../../slice/UsersApi";
import { Footers } from "../layout/Footers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../assets/registrationuser.css";

export const ResetPasswordForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [checkExistingUser] = useLazyCheckExistingUserQuery();
  const [resetPassword] = useResetPasswordAccountMutation();
  const Title = Typography;
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const checkResult = await checkExistingUser({
        email: values.email,
      }).unwrap();

      if (checkResult.existingField === "email") {
        setEmailExists(true);
        setVerifiedEmail(values.email);
        message.success("Compte trouvé !");
      } else {
        toast.error("Aucun compte trouvé avec cette adresse email");
      }
    } catch (error) {
      console.error("Erreur de vérification:", error);
      message.error("Erreur lors de la vérification");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setEmailExists(false);
    setVerifiedEmail("");
  };

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      // Appel correct de la mutation avec l'email vérifié
      const result = await resetPassword({ email: verifiedEmail }).unwrap();
      message.success("Un email de réinitialisation a été envoyé !");
      toast.success("Un email de réinitialisation a été envoyé !");
      handleReset();
      navigate("/login");
    } catch (error) {
      console.error("Erreur de réinitialisation:", error);
      message.error("Erreur lors de la réinitialisation");
      toast.error("Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLoginForm = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundColor: "#dce2e8",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "0 0",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "500px",
          margin: "auto 0",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          marginTop: "24px",
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontSize: 32,
            fontWeight: "bold",
          }}
        >
          {emailExists
            ? " Réinitialisation du mot de passe"
            : "Vérification du compte"}
        </Title>
        <div
          style={{
            width: "100%",
            padding: "24px",
            backgroundColor: "#f6f8fa",
            borderRadius: "3px",
          }}
          className="borderstyle shadow-xl"
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            disabled={loading}
            title="Reset Password"
          >
            <Form.Item
              name="email"
              label="Adresse email"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir une adresse email",
                },
                { type: "email", message: "Adresse email invalide" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="saisir@email.com"
                disabled={emailExists}
                size="large"
                suffix={
                  emailExists ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : null
                }
              />
            </Form.Item>

            <Form.Item>
              {loading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, color: "blue" }}
                      spin
                    />
                  }
                />
              ) : emailExists ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button
                    type="primary"
                    onClick={handlePasswordReset}
                    style={{ flex: 1 }}
                  >
                    Réinitialiser le mot de passe
                  </Button>
                  <Button onClick={handleReset}>Changer</Button>
                  <Button onClick={handleGoToLoginForm}>login Form</Button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button type="primary" htmlType="submit" style={{ flex: 1 }}>
                    Vérifier
                  </Button>
                  <Button onClick={handleGoToLoginForm}>login Form</Button>
                </div>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <Footers />
      </div>
    </div>
  );
};
