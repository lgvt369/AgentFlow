import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import 'antd/dist/reset.css';
const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      message.error('请输入有效的邮箱');
      return;
    }
    if (!verificationCode) {
      message.error('请输入验证码');
      return;
    }
    if (!password || password.length < 4 || password.length > 20) {
      message.error('密码长度应为4到20位');
      return;
    }
    if (password !== confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    console.log('Email:', email, 'Verification Code:', verificationCode, 'Password:', password);
    // 这里添加实际的注册逻辑，如发送请求到后端注册
  };

  const handleGetVerificationCode = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      message.error('请输入有效的邮箱以获取验证码');
      return;
    }
    // 这里添加获取验证码的逻辑
    message.success('验证码已发送到您的邮箱');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
      <Form onFinish={handleSubmit} style={{ width: 300 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 20 }}>注册</Title>
        <Form.Item>
          <Input
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="验证码"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            addonAfter={
              <Typography.Link onClick={handleGetVerificationCode}>
                获取验证码
              </Typography.Link>
            }
          />
        </Form.Item>
        <Form.Item>
          <Input
            type="password"
            placeholder="新密码(4~20位)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            type="password"
            placeholder="确认密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            确认注册
          </Button>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Typography.Link href="/login">已有账号，去登录</Typography.Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;