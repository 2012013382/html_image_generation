import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RobotOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { useAppContext } from '../store';
import type { Task, TaskDetailData } from '../mock/data';

export default function Chatbot() {
  const navigate = useNavigate();
  const { chatbotOpen, setChatbotOpen, addDynamicTask, addDynamicTaskDetail, editingStrategy, setEditingStrategy } = useAppContext();
  const [input, setInput] = useState('');

  if (!chatbotOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    const taskId = `t-new-${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const createTime = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${timeStr}`;

    const newTask: Task = {
      id: taskId,
      title: userMessage.length > 20 ? userMessage.substring(0, 20) + '...' : userMessage,
      description: userMessage,
      status: 'inprogress',
      source: 'chatbot',
      sourceDetail: 'Chatbot发起',
      createTime,
      progress: 0,
    };

    // 构建完整的多Agent交互消息链
    const newDetail: TaskDetailData = {
      overview: {
        goal: userMessage,
        currentPhase: 'AI分析中',
        nextStep: '等待AI分析结果',
        risk: '暂无',
      },
      contextMessages: [
        {
          id: `msg-${Date.now()}-1`,
          time: timeStr,
          role: 'user' as const,
          roleName: '用户',
          content: userMessage,
          category: 'instruction' as const,
        },
        {
          id: `msg-${Date.now()}-2`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '章鱼Agent',
          content: `已理解您的需求：「${userMessage}」\n\n我将协调多个专家Agent进行深度分析，请稍候...`,
          actions: ['确认目标', '修改目标'],
          category: 'judgment' as const,
        },
        {
          id: `msg-${Date.now()}-3`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '章鱼Agent',
          content: '🔍 正在调用「数据分析Agent」获取相关数据...',
          category: 'execution' as const,
        },
        {
          id: `msg-${Date.now()}-4`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '数据分析Agent',
          content: '数据分析完成，已获取关键指标数据摘要。\n\n• 核心指标已采集完成\n• 同比/环比趋势已生成\n• 异常数据已标注',
          evidence: ['关键指标数据', '趋势分析报告'],
          category: 'execution' as const,
        },
        {
          id: `msg-${Date.now()}-5`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '章鱼Agent',
          content: '收到数据分析结果，正在进行深度归因...\n\n🔍 正在调用「品类运营Agent」进行品类维度归因...',
          category: 'judgment' as const,
        },
        {
          id: `msg-${Date.now()}-6`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '品类运营Agent',
          content: '品类归因分析完成：\n\n已识别出核心影响品类及对应贡献度，建议优先关注TOP影响因子。',
          evidence: ['品类归因数据'],
          category: 'execution' as const,
        },
        {
          id: `msg-${Date.now()}-7`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '章鱼Agent',
          content: '🔍 正在调用「渠道分析Agent」评估渠道表现...',
          category: 'execution' as const,
        },
        {
          id: `msg-${Date.now()}-8`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '渠道分析Agent',
          content: '渠道归因分析完成，已锁定主要流量变化渠道和影响路径。',
          evidence: ['渠道归因数据'],
          category: 'execution' as const,
        },
        {
          id: `msg-${Date.now()}-9`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '章鱼Agent',
          content: `✅ 所有专家Agent分析已完成。\n\n综合各方数据，我已为您生成完整的策略方案，包含问题归因和执行建议。\n\n是否需要我立即执行该策略？`,
          actions: ['立即执行', '调整方案', '暂不执行'],
          category: 'judgment' as const,
        },
      ],
      lineage: { upstream: [], downstream: [] },
      generatedFiles: [],
      executionMetrics: [],
      conclusions: {
        mainCause: '分析中...',
        recommendedAction: '等待AI分析',
        pendingConfirmation: '任务目标确认',
      },
    };

    addDynamicTask(newTask);
    addDynamicTaskDetail(taskId, newDetail);

    setInput('');
    setChatbotOpen(false);
    setEditingStrategy(null);
    navigate(`/task/${taskId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-panel">
      <div className="chatbot-header">
        <h3><RobotOutlined /> AI 智能助手</h3>
        <button className="chatbot-close" onClick={() => { setChatbotOpen(false); setEditingStrategy(null); }}>
          <CloseOutlined />
        </button>
      </div>
      <div className="chatbot-messages">
        <div className="chatbot-welcome">
          <div className="chatbot-welcome-icon">🐙</div>
          <p className="chatbot-welcome-title">你好！我是AI智能助手</p>
          <p className="chatbot-welcome-desc">输入你的需求，我将为你创建任务并开始执行</p>
        </div>
      </div>
      {editingStrategy && (
        <div className="chatbot-editing-banner">
          <div className="chatbot-editing-icon">✏️</div>
          <div className="chatbot-editing-info">
            <div className="chatbot-editing-label">正在修改策略</div>
            <div className="chatbot-editing-name">{editingStrategy}</div>
          </div>
          <button className="chatbot-editing-close" onClick={() => setEditingStrategy(null)}>✕</button>
        </div>
      )}
      <div className="chatbot-input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={editingStrategy ? '请描述您希望的修改...' : '描述你的需求，创建新任务...'}
        />
        <button onClick={handleSend}><SendOutlined /></button>
      </div>
    </div>
  );
}
