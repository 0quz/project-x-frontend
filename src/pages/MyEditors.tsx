import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { List, Space, Typography, Card, Button, message, Tag, Input, Drawer, Spin } from "antd";
import { DeleteOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash/debounce';

const { Title, Text } = Typography;
const { Search } = Input;

type Editor = {
  user_id: number;
  editor_id: number;
  name: string;
  key: number;
};

type User = {
  id: number;
  name: string;
};

const USERS_PER_PAGE = 20;

const App: React.FC = () => {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchEditors = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Editor[]>("http://localhost:8080/users/editors", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const editorsWithKey = res.data.map(editor => ({
        ...editor,
        key: editor.editor_id
      }));
      setEditors(editorsWithKey);
    } catch (err) {
      console.error("Failed to fetch editors", err);
      message.error("Failed to load editors");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (searchQuery: string = "", pageNum: number = 1) => {
    setUserSearchLoading(true);
    try {
      const res = await axios.get<User[]>("http://localhost:8080/users", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        params: {
          search: searchQuery,
          page: pageNum,
          limit: USERS_PER_PAGE
        }
      });
      
      if (pageNum === 1) {
        setUsers(res.data);
      } else {
        setUsers(prev => [...prev, ...res.data]);
      }
      
      setHasMore(res.data.length === USERS_PER_PAGE);
    } catch (err) {
      console.error("Failed to fetch users", err);
      message.error("Failed to load users");
    } finally {
      setUserSearchLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPage(1);
      fetchUsers(value, 1);
    }, 300),
    []
  );

  useEffect(() => {
    fetchEditors();
  }, []);

  const handleAddEditor = async (userId: number) => {
    try {
      const newEditorIds = [...editors.map(e => e.editor_id), userId];
      await axios.post(
        "http://localhost:8080/users/editors",
        { editors: newEditorIds },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      
      const selectedUser = users.find(u => u.id === userId);
      if (selectedUser) {
        setEditors(prev => [...prev, {
          user_id: 0,
          editor_id: userId,
          name: selectedUser.name,
          key: userId
        }]);
      }
      
      message.success("Editor added successfully");
    } catch (err) {
      console.error("Failed to add editor", err);
      message.error("Failed to add editor");
    }
  };

  const handleRemoveEditor = async (editorId: number) => {
    try {
      const newEditorIds = editors
        .filter(e => e.editor_id !== editorId)
        .map(e => e.editor_id);

      await axios.post(
        "http://localhost:8080/users/editors",
        { editors: newEditorIds },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      
      setEditors(prev => prev.filter(e => e.editor_id !== editorId));
      message.success("Editor removed successfully");
    } catch (err) {
      console.error("Failed to remove editor", err);
      message.error("Failed to remove editor");
    }
  };

  const loadMoreUsers = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(searchText, nextPage);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const availableUsers = users.filter(
    user => !editors.some(editor => editor.editor_id === user.id)
  );

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4}>My Editors ({editors.length})</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setDrawerVisible(true);
              setPage(1);
              fetchUsers("", 1);
            }}
          >
            Add Editor
          </Button>
        </Space>

        <List
          dataSource={editors}
          loading={loading}
          renderItem={editor => (
            <List.Item
              key={editor.editor_id}
              actions={[
                <Button 
                  type="text" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveEditor(editor.editor_id)}
                >
                  Remove
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<UserOutlined style={{ fontSize: '24px' }} />}
                title={<Text strong>{editor.name}</Text>}
                description={<Tag color="blue">Active</Tag>}
              />
            </List.Item>
          )}
        />

        <Drawer
          title="Add New Editor"
          placement="right"
          width={400}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Search
              placeholder="Search users..."
              onChange={e => handleSearch(e.target.value)}
              loading={userSearchLoading}
            />
            
            <div
              id="scrollableDiv"
              style={{
                height: 'calc(100vh - 200px)',
                overflow: 'auto',
                padding: '0 16px',
              }}
            >
              <InfiniteScroll
                dataLength={users.length}
                next={loadMoreUsers}
                hasMore={hasMore}
                loader={<Spin style={{ display: 'block', margin: '20px auto' }} />}
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={availableUsers}
                  renderItem={user => (
                    <List.Item
                      key={user.id}
                      actions={[
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleAddEditor(user.id)}
                        >
                          Add
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<UserOutlined />}
                        title={user.name}
                      />
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Space>
        </Drawer>
      </Space>
    </Card>
  );
};

export default App;
