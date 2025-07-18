import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Form, Input, Popconfirm, Table, Space, Typography, Card, Button, message, Divider, Skeleton, Select, Flex } from 'antd';
import { PlayCircleOutlined, DeleteOutlined, EditOutlined, SearchOutlined, OrderedListOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import axios from 'axios';
import AudioPlayerWithImage from '../components/AudioPlayer';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Title } = Typography;
const { Search } = Input;

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface MyMedia {
    id: string;
    name: string;
    url: string;
    audio_url: string;
    points: number;
    created_by: string;
    created_at: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof MyMedia;
  record: MyMedia;
  handleSave: (record: MyMedia) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type ColumnTypes = Exclude<TableProps<MyMedia>['columns'], undefined>;

const App: React.FC = () => {
    const [myMedia, setMyMedia] = useState<MyMedia[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('created_at DESC');

    const fetchMyMedia = async () => {
        setLoading(true);
        try {
            const res = await axios.get<MyMedia[]>('http://localhost:8080/media/my-media', {
                headers: {"Authorization" : `Bearer ${Cookies.get("token")}`},
                params: { 
                    lastTimestamp: myMedia.length > 0 ? myMedia[myMedia.length - 1].created_at : undefined,
                    search: searchTerm,
                    sort: sortOrder
                }
            });
            
            if (res.data.length === 0) {
                setHasMore(false);
            } else {
                setMyMedia(prev => sortOrder && prev.length === 0 ? res.data : [...prev, ...res.data]);
            }
        } catch (error) {
            message.error('Failed to fetch media');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setMyMedia([]); // Reset the media list
        setHasMore(true); // Reset pagination
    };

    const handleSort = (value: string) => {
        setSortOrder(value);
        setMyMedia([]); // Reset the media list
        setHasMore(true); // Reset pagination
    };

    useEffect(() => {
        fetchMyMedia();
    }, [searchTerm, sortOrder]);

    const loadMoreData = () => {
        if (loading) return;
        fetchMyMedia();
    };

    const handleDelete = async (id: string) => {
        try {
            const config = {
                headers: { "Authorization": `Bearer ${Cookies.get("token")}` },
                data: { id: id }
            };
            await axios.delete<{id: string}>('http://localhost:8080/media/my-media', config);
            const newData = myMedia.filter((item) => item.id !== id);
            setMyMedia(newData);
            message.success('Media deleted successfully');
        } catch (error) {
            message.error('Failed to delete media');
        }
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'Media',
            dataIndex: 'media',
            width: '200px',
            render: (_, record) =>
              myMedia.length >= 1 ? (
                <Card 
                  bodyStyle={{ padding: 8 }}
                  style={{ border: '1px solid #f0f0f0', borderRadius: 8 }}
                >
                  <AudioPlayerWithImage 
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      display: "block"
                    }} 
                    imageUrl={record.url}
                    audioUrl={record.audio_url}
                  />
                </Card>
              ) : null,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '25%',
            editable: true,
            render: (text) => <Typography.Text strong>{text}</Typography.Text>
        },
        {
            title: 'Created Date',
            dataIndex: 'created_at',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            render: (_, record) =>
                myMedia.length >= 1 ? (
                <Space size="middle">
                    <Button 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
                ) : null,
        },
    ];

    const handleSave = async (row: MyMedia) => {
        try {
            await axios.post<MyMedia>(
                'http://localhost:8080/media/my-media', 
                row, 
                {headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}}
            );
            console.log(row);
            const newData = [...myMedia];
            const index = newData.findIndex((item) => row.id === item.id);
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setMyMedia(newData);
            message.success('Media updated successfully');
        } catch (error) {
            message.error('Failed to update media');
        }
    };

    const components = {
        body: {
        row: EditableRow,
        cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
        return col;
        }
        return {
        ...col,
        onCell: (record: MyMedia) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
        }),
        };
    });

    return (
        <Card>
            <Title level={4} style={{ marginBottom: 24 }}>My Media Library</Title>
            
            <Flex 
                justify="space-between" 
                align="center" 
                style={{ marginBottom: 24 }}
                gap={16}
            >
                <Search
                    placeholder="Search by name..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    style={{ width: '60%' }}
                    onSearch={handleSearch}
                />
                
                <Select
                    size="large"
                    style={{ width: '35%' }}
                    placeholder="Sort by..."
                    suffixIcon={<OrderedListOutlined />}
                    defaultValue="created_at DESC"
                    options={[
                        { value: 'created_at DESC', label: 'Newest First' },
                        { value: 'created_at ASC', label: 'Oldest First' },
                        { value: 'name ASC', label: 'Name (A-Z)' },
                        { value: 'name DESC', label: 'Name (Z-A)' }
                    ]}
                    onChange={handleSort}
                />
            </Flex>

            <div
                id="scrollableDiv"
                style={{
                    height: '70vh',
                    overflow: 'auto',
                    padding: '0 16px',
                }}
            >
                <InfiniteScroll
                    dataLength={myMedia.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={<Divider plain>No more media to load</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    <Table<MyMedia>
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered={false}
                        dataSource={myMedia}
                        columns={columns as ColumnTypes}
                        pagination={false}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
                        }}
                    />
                </InfiniteScroll>
            </div>
        </Card>
    );
};

export default App;
