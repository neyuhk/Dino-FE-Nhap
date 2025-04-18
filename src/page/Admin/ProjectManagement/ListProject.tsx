import React, { useEffect, useState } from 'react';
import { Select, Space, Table, Modal, Button, Form, Input, message, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { getProjects, changeProjectType, deleteProjectById } from '../../../services/project.ts';
import { Project } from '../../../model/model.ts';
import Search from 'antd/es/input/Search';
import { Link } from 'react-router-dom';
import { PROJECT_TYPE } from '../../../enum/projectType.ts';
import './ListProject.css';
import { AlignLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const ListProjectManagement: React.FC = () => {
    const [data, setData] = useState<Project[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState<Project[]>([]);
    const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchName, setSearchName] = useState<string>('');

    const fetchData = async (page: number, perPage: number, name: string, type?: string) => {
        setLoading(true);
        try {
            const projects = await getProjects(page, perPage, name, type || '');
            setData(projects.data);
            setFilteredData(projects.data);
            setPagination({ current: page, pageSize: perPage, total: projects.total });
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, searchName, selectedType);
    }, []);

    const handleSearch = (value: string) => {
        setSearchName(value);
        fetchData(1, pagination.pageSize, value, selectedType);
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        fetchData(1, pagination.pageSize, searchName, value);
    };

    const handleTableChange = (pagination: any) => {
        fetchData(pagination.current, pagination.pageSize, searchName, selectedType);
    };

    const showModal = (project: Project) => {
        setSelectedProject(project);
        setIsModalVisible(true);
        form.setFieldsValue({ type: project.project_type });
    };

    const changeType = async () => {
        try {
            const values = await form.validateFields();
            await changeProjectType(selectedProject?._id ?? '', values.type);
            setIsModalVisible(false);
            fetchData(pagination.current, pagination.pageSize, searchName, selectedType);
        } catch (error) {
            console.error('Failed to update project type:', error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showDeleteModal = (id: string) => {
        setProjectToDelete(id);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setProjectToDelete(null);
    };

    const handleDeleteProject = async () => {
        if (!projectToDelete) return;
        try {
            await deleteProjectById(projectToDelete);
            message.success('Project deleted successfully');
            fetchData(pagination.current, pagination.pageSize, searchName, selectedType);
            setIsDeleteModalVisible(false);
            setProjectToDelete(null);
        } catch (error) {
            message.error('Failed to delete project');
            console.error('Failed to delete project:', error);
        }
    };

    const columns: TableProps<Project>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (text ? <a>{text}</a> : 'Unknown'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (text ? text : 'Unknown'),
        },
        {
            title: 'Type',
            dataIndex: 'project_type',
            key: 'project_type',
            render: (text) => (text ? text : 'Unknown'),
        },
        {
            title: <span className="center-align">Image</span>,
            key: 'images',
            render: (record) => (
                <div className="center-align">
                    {record.images[0] ? (
                        <img
                            src={record.images[0]}
                            alt={record.name}
                            style={{ width: '100px', maxHeight: '100px' }}
                        />
                    ) : (
                        <img
                            src={'/MockData/flapybird.jpg'}
                            alt={record.name}
                            style={{ width: '100px', maxHeight: '100px' }}
                        />
                    )}
                </div>
            ),
        },
        {
            title: <span className="center-align">User</span>,
            key: 'user_id',
            render: (record) => (
                <div className="center-align">
                    {record.user_id ? (
                        <Link to={''} style={{ color: 'black' }}>
                            {record.user_id.username}
                        </Link>
                    ) : (
                        'Unknown'
                    )}
                </div>
            ),
        },
        {
            title: <span className="center-align">Action</span>,
            key: 'action',
            render: (record) => (
                <div className="center-align">
                    <Space size="middle">
                        <Tooltip title="View">
                            <Link style={{ color: 'black' }} to={`/admin/project/detail/${record._id}`}>
                                <AlignLeftOutlined />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Change Project Type">
                            <EditOutlined onClick={() => showModal(record)} />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <DeleteOutlined onClick={() => showDeleteModal(record._id)} />
                        </Tooltip>
                    </Space>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Search placeholder="Search projects" onSearch={handleSearch} enterButton />
                <Select
                    placeholder="Select Type"
                    onChange={handleTypeChange}
                    allowClear
                    style={{ width: 200 }}
                >
                    {Object.values(PROJECT_TYPE).map((type) => (
                        <Option key={type} value={type}>
                            {type}
                        </Option>
                    ))}
                </Select>
            </Space>
            <div style={{ overflow: 'auto' }}>
                <Table<Project>
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    className="my-table"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                    }}
                />
            </div>
            <Modal
                title="Change Project Type"
                visible={isModalVisible}
                onOk={changeType}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select a type' }]}
                    >
                        <Select>
                            {Object.values(PROJECT_TYPE).map((type) => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirm Delete"
                visible={isDeleteModalVisible}
                onOk={handleDeleteProject}
                onCancel={handleDeleteCancel}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this project?</p>
            </Modal>
        </div>
    );
};

export default ListProjectManagement;
