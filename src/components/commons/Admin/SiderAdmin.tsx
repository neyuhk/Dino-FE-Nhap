import { Menu, MenuProps } from 'antd'
import { BookOutlined, LaptopOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const SiderAdmin = () => {
    const navigate = useNavigate()

   const items: MenuProps['items'] = [
    {
        key: '1',
        icon: <LaptopOutlined />,
        label: 'Projects List',
        onClick: () => navigate('/admin/projects'),
    },
    {
        key: '3',
        icon: <UserOutlined />,
        label: 'Users List',
        onClick: () => navigate('/admin/users'),
    },
    {
        key: '5',
        icon: <BookOutlined />,
        label: 'Courses List',
        onClick: () => navigate('/admin/courses'),
    },
    {
        key: '7',
        icon: <BookOutlined />,
        label: 'Forum List',
        onClick: () => navigate('/admin/forum'),
    },
];

    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
        />
    )
}

export default SiderAdmin
