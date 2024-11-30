import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Username:', username, 'Password:', password, 'Remember me:', rememberMe);
    // 这里添加实际的登录逻辑，如发送请求到后端验证
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
      <Form onFinish={handleSubmit} style={{ width: 300 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 20 }}>登录</Title>
        <Form.Item>
          <Input
            prefix={<i className="anticon anticon-user" />}
            placeholder="用户名/邮箱"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            prefix={<i className="anticon anticon-lock" />}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
            记住我
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={() => navigate('/register')} block>
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;