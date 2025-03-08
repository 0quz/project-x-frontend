import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Form, Input, Popconfirm, Table } from 'antd';
import Cookies from 'js-cookie';
import axios from 'axios';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface MyMedia {
    id: string;
    name: string;
    price: number;
    created_by: string;
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

    useEffect(() => {
        const fetchMyMedia = async() => {
            const res = await axios.get<MyMedia[]>('http://localhost:8080/users/my-media', 
                {headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}}
            );
            setMyMedia(res.data);
            console.log(res.data);
        }
        fetchMyMedia();
    }, []);

    const handleDelete = async (id: string) => {
        console.log(id);
        const config = {
            headers: { "Authorization": `Bearer ${Cookies.get("token")}` },
            data: { id: id }
          };
        const res = await axios.delete<{id: string}>('http://localhost:8080/users/my-media', config);
        console.log(res.data);
        const newData = myMedia.filter((item) => item.id !== id);
        setMyMedia(newData);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        },
        {
            title: 'price',
            dataIndex: 'price',
            editable: true,
        },
        {
            title: 'Created Date',
            dataIndex: 'created_at',
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
            },
        {
        title: 'operation',
        dataIndex: 'operation',
        render: (_, record) =>
            myMedia.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                <a>Delete</a>
            </Popconfirm>
            ) : null,
        },
    ];

    const handleSave = async (row: MyMedia) => {
        const res = await axios.post<MyMedia>('http://localhost:8080/users/my-media', row, 
            {headers: {"Authorization" : `Bearer ${Cookies.get("token")}`}}
        )
        const newData = [...myMedia];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        console.log(row)
        newData.splice(index, 1, {
        ...item,
        ...row,
        });
        setMyMedia(newData);
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
        <div>
        <Table<MyMedia>
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={myMedia}
            columns={columns as ColumnTypes}
        />
        </div>
    );
};

export default App;