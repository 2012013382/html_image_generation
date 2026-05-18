import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../store';
import type { ViewPerspective } from '../store';
import Chatbot from './Chatbot';

const agentMenuItems = [
  { key: 'chaomiao', label: '通用', icon: '🌐', desc: '章鱼大脑Agent', isMain: true },
  { key: 'jingyingjihua', label: '经营计划', icon: '📋', desc: '经营计划Agent' },
  { key: 'yunying', label: '运营', icon: '📊', desc: '运营专家Agent' },
];



export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, chatbotOpen, setChatbotOpen, viewPerspective, setViewPerspective } = useAppContext();
  const [activeAgent, setActiveAgent] = useState('yunying');

  const currentPath = location.pathname;

  const isAgentWorkspace = location.pathname === '/';

  const getPageTitle = () => {
    if (currentPath === '/') return '章鱼工作台';
    if (currentPath === '/home') return '首页';
    if (currentPath === '/tasks') return '任务列表';
    if (currentPath.startsWith('/task/')) return '任务详情';
    if (currentPath.startsWith('/strategy/')) return '策略详情';
    return '首页';
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/octopus-logo.svg" alt="章鱼" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        </div>

        <nav className="sidebar-menu">
          {agentMenuItems.map((item) => (
            <React.Fragment key={item.key}>
              <div
                className={`sidebar-menu-item ${activeAgent === item.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveAgent(item.key);
                  if (item.key === 'chaomiao') {
                    navigate('/');
                  }
                }}
              >
                <span className="menu-icon" style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.isMain && <div className="sidebar-menu-divider" />}
            </React.Fragment>
          ))}
        </nav>

        {/* 视角切换 */}
        <div className="view-switch-container">
          <div className="view-switch-toggle">
            <button
              className={`view-switch-btn ${viewPerspective === 'staff' ? 'view-switch-btn--active' : ''}`}
              onClick={() => setViewPerspective('staff')}
            >
              小二
            </button>
            <button
              className={`view-switch-btn ${viewPerspective === 'TL' ? 'view-switch-btn--active' : ''}`}
              onClick={() => setViewPerspective('TL')}
            >
              TL
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={`main-area ${chatbotOpen ? 'chatbot-open' : ''}`}>
        <header className="top-header">
          <div className="header-left">
            <span className="page-title">{getPageTitle()}</span>
          </div>
          <div className="header-right">
            <span className="header-username">👤 {user.name}</span>
          </div>
        </header>
        <div className="page-content fade-in">
          <Outlet />
        </div>
      </div>

      {/* Chatbot - 在工作台页面不显示 */}
      {!isAgentWorkspace && <Chatbot />}
    </div>
  );
}
