import { Avatar, Button, Dropdown, Menu, type MenuProps, Modal } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { PATHS } from '../../../router/path.ts'
import '../styles/header.css'
import React, { useState } from 'react'
import { logout } from '../../../stores/authSlice.ts'
import { AppDispatch } from '../../../stores'
import { Link, useNavigate } from 'react-router-dom'

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));
const HeaderAdmin = () => {
    const { isAuthenticated } = useSelector((state: any) => state.auth)
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const confirmLogout = () => {
        setShowLogoutModal(true);
    };
    const handleLogout = async () => {
        console.log('Logout')
        dispatch(logout());
        setShowLogoutModal(false);
        window.location.href = PATHS.AUTH;
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const navLeft = (
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items1}
            style={{ flex: 1, minWidth: 0 }}
        />
    )
    const menu = (
        <Menu>
            <Menu.Item key="profile">
                <a href="/profile">Trang cá nhân</a>
            </Menu.Item>
            <Menu.Item key="logout">
                <a
                    onClick={confirmLogout}
                >
                    Đăng xuất
                </a>
            </Menu.Item>
        </Menu>
    )
    return (
        <div className="header-content">
            <h2
                style={{
                    color: '#F26526',
                }}
            >
                Logo
            </h2>
            {navLeft}
            <div>
                {isAuthenticated ? (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div
                            className="user-info"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Avatar icon={<UserOutlined />} />
                            <span className="username white-text">Amin</span>
                        </div>
                    </Dropdown>
                ) : (
                    <Link
                        to="/auth"
                        className="sign-in-btn"
                        onClick={(e) => {
                            e.preventDefault()
                            navigate('/auth')
                        }}
                    >
                        Đăng nhập
                    </Link>
                )}
            </div>
            <Modal
                open={showLogoutModal}
                onCancel={cancelLogout}
                footer={null}
                centered
                closable={false}
                width={400}
                className="logout-confirmation"
            >
                <div className="logout-modal">
                    <div className="modal-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 12H3.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3>Xác nhận đăng xuất</h3>
                    <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
                    <div className="modal-actions">
                        <Button className="cancel-btn" onClick={cancelLogout}>
                            Hủy
                        </Button>
                        <Button type="primary" className="confirm-btn" onClick={handleLogout}>
                            Đồng ý
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default HeaderAdmin
