import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AppProvider } from './store';
import Layout from './components/Layout';
import AgentWorkspace from './pages/AgentWorkspace';
import Home from './pages/Home';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import StrategyDetail from './pages/StrategyDetail';
import './styles/global.css';

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#00B578',
        borderRadius: 6,
        colorBgContainer: '#ffffff',
        colorText: '#1A1A2E',
        colorTextSecondary: '#6B7280',
        colorBorder: '#E2E7F3',
        fontFamily: "'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
      },
    }}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<AgentWorkspace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/task/:id" element={<TaskDetail />} />
              <Route path="/strategy/:id" element={<StrategyDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ConfigProvider>
  );
}
