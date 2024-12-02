import React, { useEffect } from "react";
import { Layout, Input, Button, Table, Switch, Modal, Form, notification, Avatar, Collapse } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

// Define the Agent interface
interface Agent {
  id: number | null;
  code: string;
  url: string;
  description: string;
  type: string;
  channel: string;
  is_active: boolean;
  api_key: string;
}

const Agents: React.FC = () => {
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalAgents, setTotalAgents] = React.useState(0);
  const [searchParams, setSearchParams] = React.useState({
    code: "",
    url: "",
    description: "",
    type: "",
    channel: "",
    data_schema: "",
    is_active: undefined,
  });
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [currentAgent, setCurrentAgent] = React.useState<Agent | null>(null);
  const [currentPageContent, setCurrentPageContent] = React.useState("agents"); // 新增状态来管理当前页面

  const fetchAgents = async (page: number, params = {}) => {
    try {
      const response = await fetch("http://localhost:5000/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, per_page: 10, ...params }),
      });

      const data = await response.json();
      setAgents(data.tools);
      setTotalAgents(data.total);
      setCurrentPage(data.page);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    }
  };
  const handleSearch = () => {
    fetchAgents(1, searchParams);
  };

  // 新增 useEffect 来初始化加载数据
  useEffect(() => {
    fetchAgents(currentPage, searchParams); // Fetch agents on component mount
  }, []); // Empty dependency array means this runs once when the component mounts

  // 定义表格列
  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
    },
    {
      title: '是否激活',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (text: boolean, record: Agent) => (
        <Switch 
          checked={text} 
          onChange={(checked) => handleToggleActive(record.id ?? 0, checked)} 
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: Agent) => (
        <>
          <Button onClick={() => handleEdit(record.id ?? 0)}>修改</Button>
          <Button onClick={() => handleDelete(record.id ?? 0)} danger style={{ marginLeft: 8 }}>删除</Button>
        </>
      ),
    },
  ];

  // 添加处理函数
  const handleToggleActive = async (id: number, isActive: boolean) => {
    // 发送请求以更新激活状态
    await fetch(`http://localhost:5000/api/tools/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_active: isActive }),
    });
    fetchAgents(currentPage, searchParams); // 刷新代理列表
  };

  const handleEdit = (id: number) => {
    const agentToEdit = agents.find(agent => agent.id === id);
    setCurrentAgent(agentToEdit || null); // Set the agent to edit
    setIsModalVisible(true); // Show modal
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个代理吗？',
      onOk: async () => {
        // 调用删除接口
        await fetch(`http://localhost:5000/api/tools/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }), // Send the tool ID in the request body
        });
        fetchAgents(currentPage, searchParams); // 刷新代理列表
        notification.success({ // 使用 notification 组件
          message: '删除成功！', // 提示删除成功
          placement: 'bottomRight', // 设置提示位置
        });
      },
    });
  };

  const handleAdd = () => {
    setCurrentAgent({ // 设置为包含默认值的对象
        id: null,
        code: "",
        url: "",
        description: "",
        type: "",
        channel: "",
        is_active: false,
        api_key: "", // Initialize api_key for new agent
    }); // Reset for adding a new agent
    setIsModalVisible(true); // Show modal
  };

  const handleModalOk = async () => {
    const agentData = {
        id: currentAgent?.id || null,
        code: currentAgent?.code || "",
        url: currentAgent?.url || "",
        description: currentAgent?.description || "",
        type: currentAgent?.type || "",
        channel: currentAgent?.channel || "",
        is_active: currentAgent?.is_active || false,
        api_key: currentAgent?.api_key || "", // Add api_key here
    };

    try {
        const response = await fetch(`http://localhost:5000/api/tools/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(agentData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchAgents(currentPage, searchParams);
        setIsModalVisible(false);
        
        // 新增或修改成功提示
        notification.success({
            message: currentAgent?.id ? '修改成功！' : '新增成功！', // 根据是否有 id 来判断是新增还是修改
            placement: 'bottomRight', // 设置提示位置
        });
    } catch (error) {
        console.error("Failed to save agent:", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Close modal
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 20px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentPageContent === "agents" ? (
            <>
              <h2 style={{ margin: 0 }}>Agents配置</h2>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  placeholder="请输入code"
                  style={{ width: 120, marginRight: 10 }}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, code: e.target.value })
                  }
                />
                <Input
                  placeholder="请输入url"
                  style={{ width: 120, marginRight: 10 }}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, url: e.target.value })
                  }
                />
                <Input
                  placeholder="请输入描述"
                  style={{ width: 120, marginRight: 10 }}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, description: e.target.value })
                  }
                />
                <Input
                  placeholder="请输入类型"
                  style={{ width: 120, marginRight: 10 }}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, type: e.target.value })
                  }
                />
                <Input
                  placeholder="请输入渠道"
                  style={{ width: 120, marginRight: 10 }}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, channel: e.target.value })
                  }
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()} style={{ marginLeft: 10 }}>
                  新增
                </Button>
              </div>
            </>
          ) : (
            <h2 style={{ margin: 0 }}>聊天页面</h2>
          )}
        </Header>
        {/* 右侧展示区域 */}
        <Content style={{ padding: 20 }}>
          {currentPageContent === "agents" ? (
            <Table
              dataSource={agents}
              columns={columns}
              pagination={{
                current: currentPage,
                total: totalAgents,
                pageSize: 10,
                onChange: (page) => fetchAgents(page, searchParams),
                pageSizeOptions: ['5', '10', '20', '50'],
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  fetchAgents(1, { ...searchParams, per_page: size });
                },
              }}
              rowKey="id" // 设置唯一键
            />
          ) : (
            <div>
              {/* 聊天页面内容 */}
              <p>这里是聊天页面内容</p>
            </div>
          )}
        </Content>
      </Layout>
      <Modal
        title={currentAgent ? "修改agent" : "新增agent"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Code">
            <Input
              placeholder="请输入code"
              value={currentAgent?.code || ""}
              onChange={(e) => currentAgent && setCurrentAgent({ ...currentAgent, code: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="URL">
            <Input
              placeholder="请输入url"
              value={currentAgent?.url || ""}
              onChange={(e) => currentAgent && setCurrentAgent({ ...currentAgent, url: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="描述">
            <Input
              placeholder="请输入描述"
              value={currentAgent?.description || ""}
              onChange={(e) => currentAgent && setCurrentAgent({ ...currentAgent, description: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="类型">
            <Input
              placeholder="请输入类型"
              value={currentAgent?.type || ""}
              onChange={(e) => currentAgent && setCurrentAgent({ ...currentAgent, type: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="渠道">
            <Input
              placeholder="请输入渠道"
              value={currentAgent?.channel || ""}
              onChange={(e) => currentAgent && setCurrentAgent({ ...currentAgent, channel: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="API Key">
            <Input
              placeholder="请输入API Key"
              value={currentAgent?.api_key || ""}
              onChange={(e) => currentAgent && setCurrentAgent({ ...currentAgent, api_key: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="是否激活">
            <Switch
                checked={currentAgent?.is_active}
                onChange={(checked) =>
                    currentAgent &&
                    setCurrentAgent({
                        ...currentAgent,
                        is_active: checked,
                        id: currentAgent.id || 0, // 确保 id 始终是 number
                    })
                }
            />
            </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Agents;
