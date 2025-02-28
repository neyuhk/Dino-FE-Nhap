import React, { useEffect, useState } from 'react'
import { Space, Table, Input, Tooltip, Modal, Form, Select, Button, message } from 'antd'
import type { TableProps } from 'antd'
import { getUsers, changeRole } from '../../../services/user.ts'
import { User } from '../../../model/model.ts'
import moment from 'moment'
import './ListUser.css'
import { Link } from 'react-router-dom'
import { AlignLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ROLES } from '../../../enum/role.ts'

const { Search } = Input

const ListUserManagement: React.FC = () => {
    const [data, setData] = useState<User[]>([])
    const [isLoading, setLoading] = useState(true)
    const [filteredData, setFilteredData] = useState<User[]>([])
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [form] = Form.useForm()

    useEffect(() => {
        const fetchData = async () => {
            const users = await getUsers()
            setLoading(false)
            setData(users)
            setFilteredData(users)
        }

        fetchData()
    }, [])

    const showEditModal = (user: User) => {
        setSelectedUser(user)
        setIsEditModalVisible(true)
        form.setFieldsValue({ role: user.role })
    }

    const handleEdit = async (values: any) => {
        if (selectedUser) {
            try {
                await changeRole({ userId: selectedUser._id, role: values.role })
                message.success('User role updated successfully')
                setIsEditModalVisible(false)
                form.resetFields()
                const updatedUsers = await getUsers()
                setData(updatedUsers)
                setFilteredData(updatedUsers)
            } catch (error) {
                message.error('Failed to update user role')
            }
        }
    }

    const handleCancel = () => {
        setIsEditModalVisible(false)
        form.resetFields()
    }

    const handleSearch = (value: string) => {
        const filtered = data.filter(user =>
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredData(filtered)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearch(e.target.value)
    }

    const columns: TableProps<User>['columns'] = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            className: 'center-column',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            className: 'center-column',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            className: 'center-column ',
            render: (text) => text ? <img className={'avt-column'} src={text} alt="avatar" style={{ width: '40px', height: '40px' }} />
                : <img src={'/MockData/avt-def.jpg'} alt="avatar-default" style={{ width: '40px', height: '40px' }} />,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            className: 'center-column',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: 'center-column',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            className: 'center-column',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            className: 'center-column',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <Link style={{color: 'black'}} to={`/admin/user/detail/${record._id}`}><AlignLeftOutlined/></Link>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <EditOutlined
                            onClick={() => showEditModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined
                            // onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search users"
                    onChange={handleInputChange}
                />
            </Space>
            <div style={{ overflow: 'auto' }}>
                <Table
                    <User>
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                console.log(record)
                            },
                        }
                    }}
                />
            </div>
            <Modal
                title="Edit User Role"
                visible={isEditModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEdit}
                >
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select the role!' }]}
                    >
                        <Select>
                            {Object.entries(ROLES).map(([key, value]) => (
                                <Select.Option key={value} value={value}>{key}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ListUserManagement
