// import { LockOutlined, UserOutlined } from '@ant-design/icons';
// import { Button, Checkbox, Form, Input, Flex } from 'antd';
// import { login } from '../components/AuthService';



// type FieldType = {
//   email?: string;
//   password?: string;
//   remember?: string;
// };

// const onFinish = async (values: { email: string; password: string }) => {
//   console.log("Received values:", values);

//   try {
//     const response = await login(values); // Call async function
//     console.log("Login Successful:", response);
//     // Handle success (store token, navigate, etc.)
//   } catch (error) {
//     console.error("Login failed:", error);
//   }
// };


// const Login: React.FC = () => (
//     <Form
//       name="login"
//       initialValues={{ remember: true }}
//       style={{ maxWidth: 360 }}
//       onFinish={onFinish}
//     >
//       <Form.Item<FieldType>
//         name="email"
//         rules={[{ required: true, message: 'Please input your Username!' }]}
//       >
//         <Input prefix={<UserOutlined />} placeholder="Username" />
//       </Form.Item>
//       <Form.Item<FieldType>
//         name="password"
//         rules={[{ required: true, message: 'Please input your Password!' }]}
//       >
//         <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
//       </Form.Item>
//       <Form.Item>
//         <Flex justify="space-between" align="center">
//           <Form.Item<FieldType> name="remember" valuePropName="checked" noStyle>
//             <Checkbox>Remember me</Checkbox>
//           </Form.Item>
//           <a href="">Forgot password</a>
//         </Flex>
//       </Form.Item>

//       <Form.Item>
//         <Button block type="primary" htmlType="submit">
//           Log in
//         </Button>
//         or <a href="register">Register now!</a>
//       </Form.Item>
//     </Form>
// );

// export default Login;

// import React from "react";
// import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
// import axios from "axios";

// const clientId = "1078855318957-r0h6o0pshoqos0mjdkuoppsv3775s4dq.apps.googleusercontent.com";

// interface AuthResponse {
//   token: string;
// }

// const GoogleAuth: React.FC = () => {
//   const handleSuccess = async (credentialResponse: any) => {
//     try {
//       // Send token to backend for verification
//       const res = await axios.post<AuthResponse>(
//         "http://localhost:8080/auth/login",
//         { token: credentialResponse.credential },
//         { withCredentials: true }
//       );

//       // Save JWT token from backend
//       localStorage.setItem("token", res.data.token);
//       window.location.href = "/discover";
//     } catch (error) {
//       console.error("Login error", error);
//     }
//   };

//   const handleFailure = () => {
//     console.error("Google Login Failed");
//   };

//   return (
//     <GoogleOAuthProvider clientId={clientId}>
//       <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
//     </GoogleOAuthProvider>
//   );
// };

// export default GoogleAuth;
