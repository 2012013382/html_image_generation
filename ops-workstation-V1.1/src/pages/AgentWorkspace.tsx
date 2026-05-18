import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Modal, message, Progress, Button, Empty } from 'antd';
import {
  BarChartOutlined, ApartmentOutlined, FileTextOutlined,
  FileExcelOutlined, FileWordOutlined, FilePdfOutlined,
  SyncOutlined, DownloadOutlined, SendOutlined,
  UserOutlined, RobotOutlined, ClockCircleOutlined, TeamOutlined,
  ExperimentOutlined, BulbOutlined, PlusOutlined,
  DashboardOutlined, AlertOutlined, RiseOutlined,
  EyeOutlined, ThunderboltOutlined, LinkOutlined,
  EditOutlined, CheckCircleOutlined, ArrowLeftOutlined,
} from '@ant-design/icons';
import { useAppContext } from '../store';
import { mockTasks, mockTaskDetails, mockPrimaryMetrics, mockStrategies, mockStrategyDetails, getPrimaryMetricsForManager, mockUpcomingTasks } from '../mock/data';
import type { Task, TaskDetailData, MetricTimeRange, PrimaryMetric, Strategy, StrategyDetailSection, UpcomingTask } from '../mock/data';

const lineageStatusColor: Record<string, string> = {
  done: 'green',
  inprogress: 'blue',
  pending: 'orange',
  pending_confirm: 'orange',
  todo: 'default',
  adopted: 'green',
  failed: 'red',
};

const fileIconMap: Record<string, React.ReactNode> = {
  xlsx: <FileExcelOutlined style={{ color: '#10B981' }} />,
  docx: <FileWordOutlined style={{ color: '#3B82F6' }} />,
  pdf: <FilePdfOutlined style={{ color: '#DC2626' }} />,
};

const statusLabel: Record<string, string> = { pending: '待采纳', adopted: '已采纳', expired: '已过期' };

const AgentWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { user, dynamicTasks, dynamicTaskDetails, addDynamicTask, addDynamicTaskDetail, setChatbotOpen, editingStrategy, setEditingStrategy, viewPerspective } = useAppContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<'current' | 'all'>('current');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_confirm' | 'inprogress' | 'done' | 'failed'>('all');
  const [delegatedFilter, setDelegatedFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [lineageModalOpen, setLineageModalOpen] = useState(false);
  const [executionModalOpen, setExecutionModalOpen] = useState(false);
  const [filesModalOpen, setFilesModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>({ ai: true, task: true });
  const msgEndRef = useRef<HTMLDivElement>(null);

  // 引导页状态：业务指标 + AI策略
  const [metricTimeRange, setMetricTimeRange] = useState<MetricTimeRange>('MTD');
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [strategyTab, setStrategyTab] = useState<'all' | 'pending' | 'adopted' | 'fullAuto' | 'expired'>('pending');
  const [strategyFilter, setStrategyFilter] = useState<'pending' | 'adopted' | 'expired'>('pending');
  const [modalStrategy, setModalStrategy] = useState<Strategy | null>(null);
  const [modalChatOpen, setModalChatOpen] = useState(false);
  const [modalChatInput, setModalChatInput] = useState('');
  const [modalChatMessages, setModalChatMessages] = useState<{id: string; role: 'user' | 'agent'; content: string}[]>([]);
  const [modalChatSending, setModalChatSending] = useState(false);
  const [upcomingTaskModal, setUpcomingTaskModal] = useState<UpcomingTask | null>(null);

  const strategySectionRef = useRef<HTMLDivElement>(null);

  const handleDownload = (fileName: string) => {
    message.success(`正在下载：${fileName}`);
  };

  // 获取当前角色的任务列表
  const allTasks = [...(mockTasks[user.role] || []), ...dynamicTasks];

  // 获取选中任务的详情
  const detail: TaskDetailData | null = selectedTaskId
    ? (mockTaskDetails[selectedTaskId] || dynamicTaskDetails[selectedTaskId] || null)
    : null;

  // 不再默认选中第一个任务，默认显示引导页

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTaskId, detail?.contextMessages.length]);

  const selectedTask = allTasks.find(t => t.id === selectedTaskId);

  // ===== 业务指标逻辑 =====
  const currentRole = user.role;
  const showMetrics = currentRole === 'jiaojin' || currentRole === 'jiaojinD';
  const showStrategy = currentRole === 'jiaojin' || currentRole === 'jiaojinD';
  const showKeyTasks = currentRole === 'jiaojinD' || currentRole === 'xiaoer';

  const currentMetrics = mockPrimaryMetrics;

  const getStrategyCountForMetric = (metricId: string) => {
    return mockStrategies.filter(s => s.relatedMetricId === metricId).length;
  };

  const handleMetricCardClick = (pm: PrimaryMetric) => {
    if (!pm.expandable) return;
    setExpandedMetric(prev => prev === pm.id ? null : pm.id);
  };

  const handleStrategyLink = (e: React.MouseEvent, metricId: string) => {
    e.stopPropagation();
    if (selectedMetricId === metricId) {
      setSelectedMetricId(null);
    } else {
      setSelectedMetricId(metricId);
      setTimeout(() => {
        strategySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  let filteredStrategies = strategyTab === 'all'
    ? mockStrategies
    : strategyTab === 'fullAuto'
    ? mockStrategies.filter(s => s.isFullAuto)
    : mockStrategies.filter(s => s.status === strategyTab);
  if (selectedMetricId) {
    filteredStrategies = filteredStrategies.filter(s => s.relatedMetricId === selectedMetricId);
  }

  const getRateClass = (rate: number) => {
    if (rate >= 90) return 'success';
    if (rate >= 75) return 'warning';
    return 'danger';
  };

  // ===== 创建任务逻辑（复用 Chatbot handleSend） =====
  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
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

    const newDetail: TaskDetailData = {
      overview: {
        goal: userMessage,
        currentPhase: 'AI分析中',
        nextStep: '等待AI分析结果',
        risk: '暂无',
      },
      contextMessages: [
        { id: `msg-${Date.now()}-1`, time: timeStr, role: 'user' as const, roleName: '用户', content: userMessage, category: 'instruction' as const },
        { id: `msg-${Date.now()}-2`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: `已理解您的需求：「${userMessage}」\n\n我将协调多个专家Agent进行深度分析，请稍候...`, actions: ['确认目标', '修改目标'], category: 'judgment' as const },
        { id: `msg-${Date.now()}-3`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: '🔍 正在调用「数据分析Agent」获取相关数据...', category: 'execution' as const },
        { id: `msg-${Date.now()}-4`, time: timeStr, role: 'agent' as const, roleName: '数据分析Agent', content: '数据分析完成，已获取关键指标数据摘要。\n\n• 核心指标已采集完成\n• 同比/环比趋势已生成\n• 异常数据已标注', evidence: ['关键指标数据', '趋势分析报告'], category: 'execution' as const },
        { id: `msg-${Date.now()}-5`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: '收到数据分析结果，正在进行深度归因...\n\n🔍 正在调用「品类运营Agent」进行品类维度归因...', category: 'judgment' as const },
        { id: `msg-${Date.now()}-6`, time: timeStr, role: 'agent' as const, roleName: '品类运营Agent', content: '品类归因分析完成：\n\n已识别出核心影响品类及对应贡献度，建议优先关注TOP影响因子。', evidence: ['品类归因数据'], category: 'execution' as const },
        { id: `msg-${Date.now()}-7`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: '🔍 正在调用「渠道分析Agent」评估渠道表现...', category: 'execution' as const },
        { id: `msg-${Date.now()}-8`, time: timeStr, role: 'agent' as const, roleName: '渠道分析Agent', content: '渠道归因分析完成，已锁定主要流量变化渠道和影响路径。', evidence: ['渠道归因数据'], category: 'execution' as const },
        { id: `msg-${Date.now()}-9`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: `✅ 所有专家Agent分析已完成。\n\n综合各方数据，我已为您生成完整的策略方案，包含问题归因和执行建议。\n\n是否需要我立即执行该策略？`, actions: ['立即执行', '调整方案', '暂不执行'], category: 'judgment' as const },
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
    setInputValue('');
    navigate(`/task/${taskId}`, { state: { animate: true } });
  };

  // ===== 策略采纳创建任务 =====
  const handleAdopt = (strategyId: string) => {
    const strategy = mockStrategies.find(s => s.id === strategyId);
    if (!strategy) return;

    const taskId = `t-strategy-${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const createTime = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${timeStr}`;

    const newTask: Task = {
      id: taskId,
      title: strategy.title,
      description: strategy.strategySummary,
      status: 'inprogress',
      source: 'strategy',
      sourceDetail: strategy.title,
      createTime,
      progress: 0,
      strategyId: strategy.id,
    };

    const newDetail: TaskDetailData = {
      overview: {
        goal: `执行策略：${strategy.title}`,
        currentPhase: '策略拆解中',
        nextStep: '确认任务分配',
        risk: '暂无',
      },
      contextMessages: [
        { id: `msg-${Date.now()}-1`, time: timeStr, role: 'user' as const, roleName: '用户', content: `采纳并执行策略「${strategy.title}」`, category: 'instruction' as const },
        { id: `msg-${Date.now()}-2`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: `已收到策略执行指令：「${strategy.title}」\n\n正在进行策略拆解和可行性评估...`, category: 'judgment' as const },
        { id: `msg-${Date.now()}-3`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: '🔍 正在调用「数据分析Agent」验证策略基础数据...', category: 'execution' as const },
        { id: `msg-${Date.now()}-4`, time: timeStr, role: 'agent' as const, roleName: '数据分析Agent', content: '数据验证完成：\n\n• 策略关联指标数据已确认\n• 历史趋势与策略假设一致\n• 执行条件满足', evidence: ['指标验证报告', '趋势分析'], category: 'execution' as const },
        { id: `msg-${Date.now()}-5`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: '🔍 正在调用「品类运营Agent」进行任务拆解...', category: 'execution' as const },
        { id: `msg-${Date.now()}-6`, time: timeStr, role: 'agent' as const, roleName: '品类运营Agent', content: `任务拆解完成：\n\n已根据策略方案「${strategy.strategySummary.substring(0, 30)}...」拆解为多个可执行子任务，并匹配对应负责人。`, evidence: ['任务拆解方案'], category: 'execution' as const },
        { id: `msg-${Date.now()}-7`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: '🔍 正在调用「投流Agent」评估资源投入和预期收益...', category: 'execution' as const },
        { id: `msg-${Date.now()}-8`, time: timeStr, role: 'agent' as const, roleName: '投流Agent', content: '资源评估完成：\n\n• 预计投入资源在可控范围内\n• ROI 预估符合预期\n• 风险等级：低', evidence: ['ROI测算', '资源评估'], category: 'execution' as const },
        { id: `msg-${Date.now()}-9`, time: timeStr, role: 'agent' as const, roleName: '章鱼Agent', content: `✅ 所有专家Agent分析已完成，策略「${strategy.title}」的拆解和评估已就绪。\n\n📋 策略摘要：${strategy.strategySummary.substring(0, 60)}...\n\n• 子任务已拆解完成\n• 资源评估通过\n• 负责人已匹配\n\n是否需要我立即执行该策略？`, actions: ['立即执行', '调整方案', '暂不执行'], category: 'judgment' as const },
      ],
      lineage: { upstream: [], downstream: [] },
      generatedFiles: [],
      executionMetrics: [],
      conclusions: {
        mainCause: '策略分析中...',
        recommendedAction: '等待任务拆解完成',
        pendingConfirmation: '任务分配确认',
      },
    };

    addDynamicTask(newTask);
    addDynamicTaskDetail(taskId, newDetail);
    navigate(`/task/${taskId}`, { state: { animate: true } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ===== 策略弹窗内对话 =====
  const handleModalChatSend = () => {
    const text = modalChatInput.trim();
    if (!text || modalChatSending) return;
    const userMsg = { id: `mu-${Date.now()}`, role: 'user' as const, content: text };
    setModalChatMessages(prev => [...prev, userMsg]);
    setModalChatInput('');
    setModalChatSending(true);

    setTimeout(() => {
      setModalChatMessages(prev => [
        ...prev,
        { id: `ma-${Date.now()}`, role: 'agent' as const, content: `已收到修改指令，正在调整策略方案...` },
      ]);
      setTimeout(() => {
        setModalChatMessages(prev => [
          ...prev,
          { id: `ma2-${Date.now()}`, role: 'agent' as const, content: `策略已更新，主要调整：根据您的要求「${text}」，已对策略方案进行针对性优化。` },
        ]);
        setModalChatSending(false);
      }, 1500);
    }, 1000);
  };

  // ===== 血缘树构建 =====
  interface TreeNode {
    id: string;
    title: string;
    owner: string;
    status: string;
    statusLabel: string;
    isCurrent: boolean;
    isStrategy?: boolean;
    children: TreeNode[];
    tier?: string;
  }

  const buildLineageTree = (): TreeNode | null => {
    if (!selectedTask) return null;
    const allTasksFlat = [...Object.values(mockTasks).flat(), ...dynamicTasks];

    let rootTask = selectedTask;
    let parentTask = allTasksFlat.find(t => t.children?.includes(rootTask!.id));
    while (parentTask) {
      rootTask = parentTask;
      parentTask = allTasksFlat.find(t => t.children?.includes(rootTask!.id));
    }

    const tierMap: Record<number, string> = {
      0: '焦进 · 宏观',
      1: '焦进D · 中观',
      2: '一线小二 · 微观',
    };

    const buildNode = (t: typeof selectedTask, depth: number = 0): TreeNode => {
      const childTasks = (t!.children || [])
        .map(cid => allTasksFlat.find(at => at.id === cid))
        .filter(Boolean);

      const statusLabelMap: Record<string, string> = {
        todo: '待执行', inprogress: '进行中', done: '已完成', running: '进行中', pending_confirm: '待确认', failed: '失败',
      };

      return {
        id: t!.id,
        title: t!.title,
        owner: t!.delegator || user.name,
        status: t!.status,
        statusLabel: statusLabelMap[t!.status] || t!.status,
        isCurrent: t!.id === selectedTaskId,
        children: childTasks.map(ct => buildNode(ct!, depth + 1)),
        tier: tierMap[depth] || '一线小二 · 微观',
      };
    };

    if (!rootTask) return null;

    const rootNode = buildNode(rootTask);
    if (rootTask.source === 'strategy' && rootTask.sourceDetail) {
      return {
        id: rootTask.strategyId || 'strategy',
        title: rootTask.sourceDetail,
        owner: 'AI 策略',
        status: 'adopted',
        statusLabel: '策略',
        isCurrent: false,
        isStrategy: true,
        children: [rootNode],
      };
    }

    return rootNode;
  };

  const lineageTree = buildLineageTree();

  const renderTreeNode = (node: TreeNode, _isLast: boolean = true, depth: number = 0) => (
    <div className="lt-node-wrapper" key={node.id} style={{ animationDelay: `${depth * 0.1}s` }}>
      <div
        className={`lt-node ${node.isCurrent ? 'lt-node-current' : ''} ${node.isStrategy ? 'lt-node-strategy' : ''}`}
        onClick={() => {
          if (node.isCurrent) return;
          setLineageModalOpen(false);
          if (node.isStrategy) {
            navigate(`/strategy/${node.id}`);
          } else {
            navigate(`/task/${node.id}`);
          }
        }}
      >
        {node.isStrategy && <div className="lt-node-badge">AI 策略</div>}
        {node.isCurrent && <div className="lt-node-badge lt-badge-current">当前任务</div>}
        <div className="lt-node-title">{node.isStrategy ? '📋 ' : ''}{node.title}</div>
        <div className="lt-node-meta">
          {!detail?.isFullAuto && <span className="lt-node-owner">👤 {node.owner}</span>}
          <Tag
            color={node.isStrategy ? 'green' : lineageStatusColor[node.status] || 'default'}
            style={{ fontSize: 10, lineHeight: '18px', padding: '0 6px' }}
          >
            {node.statusLabel}
          </Tag>
        </div>
        {!node.isCurrent && !node.isStrategy && (
          <div className="lt-node-hint">点击查看详情 →</div>
        )}
      </div>
      {node.children.length > 0 && (
        <>
          <div className="lt-trunk-line" />
          {node.children.length > 1 && <div className="lt-branch-bar" />}
          <div className="lt-children">
            {node.children.map((child, idx) => (
              <div className="lt-child-branch" key={child.id}>
                {node.children.length > 1 && <div className="lt-branch-stub" />}
                {node.children.length === 1 && <div className="lt-connector"><div className="lt-connector-line" /></div>}
                {renderTreeNode(child, idx === node.children.length - 1, depth + 1)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // ===== 引导页：关键任务渲染（小二 / 焦进D） =====
  const tasks = mockTasks[user.role] || [];
  const delegatedTasks = tasks.filter(t => t.source === 'delegated');

  // ===== 渲染 =====
  return (
    <div className="agent-workspace">
      {/* 左栏 - 任务列表 */}
      <div className="aw-left" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="aw-left-header">
          <h3>任务列表</h3>
        </div>
        <div style={{ padding: '8px 12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F3F4F6',
              borderRadius: 8,
              padding: '6px 10px',
              flex: 1,
            }}>
              <span style={{ marginRight: 6, fontSize: 14 }}>🔍</span>
              <input
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="搜索任务..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 13,
                  color: '#374151',
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  border: (statusFilter !== 'all' || delegatedFilter !== 'all') ? '1px solid #10B981' : '1px solid #D1D5DB',
                  borderRadius: 8,
                  background: (statusFilter !== 'all' || delegatedFilter !== 'all') ? '#ECFDF5' : '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  position: 'relative',
                }}
                title="按状态筛选"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                {(statusFilter !== 'all' || delegatedFilter !== 'all') && (
                  <span style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                )}
              </button>
              {showFilterDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 36,
                  right: 0,
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  border: '1px solid #E5E7EB',
                  zIndex: 100,
                  minWidth: 140,
                  padding: '8px 0',
                }}>
                  {/* 任务状态分组 */}
                  <div style={{ padding: '4px 16px 6px', fontSize: 12, color: '#6B7280', fontWeight: 700 }}>任务状态</div>
                  {[
                    { key: 'all' as const, label: '全部状态' },
                    { key: 'pending_confirm' as const, label: '待确认' },
                    { key: 'inprogress' as const, label: '进行中' },
                    { key: 'done' as const, label: '已完成' },
                    { key: 'failed' as const, label: '已失败' },
                  ].map(item => (
                    <div
                      key={item.key}
                      onClick={() => { setStatusFilter(item.key); }}
                      style={{
                        padding: '6px 16px',
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: statusFilter === item.key ? '#F0FDF4' : 'transparent',
                        color: statusFilter === item.key ? '#10B981' : '#374151',
                        fontWeight: statusFilter === item.key ? 600 : 400,
                      }}
                      onMouseEnter={e => { if (statusFilter !== item.key) (e.currentTarget as HTMLDivElement).style.background = '#F9FAFB'; }}
                      onMouseLeave={e => { if (statusFilter !== item.key) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <span style={{ width: 14, height: 14, borderRadius: '50%', border: statusFilter === item.key ? '4px solid #10B981' : '2px solid #D1D5DB', boxSizing: 'border-box' }} />
                      {item.label}
                    </div>
                  ))}
                  {/* 分割线 */}
                  <div style={{ height: 1, background: '#E5E7EB', margin: '8px 0' }} />
                  {/* 是否被委派分组 */}
                  <div style={{ padding: '4px 16px 6px', fontSize: 12, color: '#6B7280', fontWeight: 700 }}>是否被委派</div>
                  {[
                    { key: 'all' as const, label: '全部' },
                    { key: 'yes' as const, label: '是' },
                    { key: 'no' as const, label: '否' },
                  ].map(item => (
                    <div
                      key={item.key}
                      onClick={() => { setDelegatedFilter(item.key); }}
                      style={{
                        padding: '6px 16px',
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: delegatedFilter === item.key ? '#F0FDF4' : 'transparent',
                        color: delegatedFilter === item.key ? '#10B981' : '#374151',
                        fontWeight: delegatedFilter === item.key ? 600 : 400,
                      }}
                      onMouseEnter={e => { if (delegatedFilter !== item.key) (e.currentTarget as HTMLDivElement).style.background = '#F9FAFB'; }}
                      onMouseLeave={e => { if (delegatedFilter !== item.key) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <span style={{ width: 14, height: 14, borderRadius: '50%', border: delegatedFilter === item.key ? '4px solid #10B981' : '2px solid #D1D5DB', boxSizing: 'border-box' }} />
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="aw-task-filter">
          <button
            className={`aw-filter-btn ${taskFilter === 'current' ? 'active' : ''}`}
            onClick={() => setTaskFilter('current')}
          >
            当前任务({allTasks.filter(t => t.status === 'inprogress' || t.status === 'in_progress' || t.status === 'pending_confirm' || t.status === 'failed').length})
          </button>
          <button
            className={`aw-filter-btn ${taskFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTaskFilter('all')}
          >
            全部({allTasks.length})
          </button>
        </div>
        <div className="aw-task-list" style={{ flex: 1, overflowY: 'auto' }}>
          {(() => {
            const filtered = allTasks.filter(t => {
              if (taskFilter === 'current') return t.status === 'inprogress' || t.status === 'in_progress' || t.status === 'pending_confirm' || t.status === 'failed';
              return true;
            }).filter(t => {
              if (!searchKeyword.trim()) return true;
              return t.title.toLowerCase().includes(searchKeyword.trim().toLowerCase());
            }).filter(t => {
              if (statusFilter === 'all') return true;
              if (statusFilter === 'inprogress') return t.status === 'inprogress' || t.status === 'in_progress';
              if (statusFilter === 'done') return t.status === 'done' || t.status === 'completed';
              return t.status === statusFilter;
            }).filter(t => {
              if (delegatedFilter === 'all') return true;
              if (delegatedFilter === 'yes') return t.source === 'delegated';
              return t.source !== 'delegated';
            });
            const aiTasks = filtered.filter(t => t.source === 'strategy');
            const userTasks = filtered.filter(t => t.source !== 'strategy');

            const renderTaskItem = (t: typeof allTasks[0]) => (
              <div
                key={t.id}
                className={`aw-task-item ${selectedTaskId === t.id ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/task/${t.id}`)}
              >
                <div className="aw-task-item-header">
                  <span className="aw-task-title">{t.title}</span>
                  <span className={`aw-task-status aw-status-${t.status}`}>
                    {t.status === 'pending_confirm' ? '待确认' : t.status === 'todo' ? '待执行' : t.status === 'inprogress' ? '进行中' : t.status === 'failed' ? '失败' : '已完成'}
                  </span>
                </div>
                <div className="aw-task-desc">{t.description}</div>
                <div className="aw-task-meta">
                  <span>{t.createTime}</span>
                </div>
              </div>
            );

            return (
              <>
                {aiTasks.length > 0 && (
                  <div className="task-group-container">
                    <div
                      className="task-group-header"
                      onClick={() => setGroupExpanded(prev => ({ ...prev, ai: !prev.ai }))}
                    >
                      <span className="task-group-arrow">{groupExpanded.ai ? '▼' : '▶'}</span>
                      <span className="task-group-title">🤖 AI托管</span>
                      <span className="task-group-count">{aiTasks.length}</span>
                    </div>
                    {groupExpanded.ai && (
                      <div className="task-group-items">
                        {aiTasks.map(renderTaskItem)}
                      </div>
                    )}
                  </div>
                )}
                {aiTasks.length > 0 && userTasks.length > 0 && (
                  <div className="task-group-divider" />
                )}
                {userTasks.length > 0 && (
                  <div className="task-group-container">
                    <div
                      className="task-group-header"
                      onClick={() => setGroupExpanded(prev => ({ ...prev, task: !prev.task }))}
                    >
                      <span className="task-group-arrow">{groupExpanded.task ? '▼' : '▶'}</span>
                      <span className="task-group-title">📝 我发起</span>
                      <span className="task-group-count">{userTasks.length}</span>
                    </div>
                    {groupExpanded.task && (
                      <div className="task-group-items">
                        {userTasks.map(renderTaskItem)}
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>
        <div style={{ padding: '10px 12px', borderTop: '1px solid #E5E7EB', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setSelectedTaskId(null)}
            style={{
              width: 'auto',
              background: '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            + 新对话
          </button>
        </div>
      </div>

      {/* 中栏 - Chatbot 上下文 / 引导页 */}
      <div className="aw-center">
        {selectedTaskId && detail ? (
          <>
            {/* 状态B：任务对话视图 */}
            <div className="aw-center-header">
              <button className="aw-back-btn" onClick={() => setSelectedTaskId(null)}>
                <ArrowLeftOutlined /> 返回
              </button>
              <h3><BulbOutlined style={{ marginRight: 8 }} />{selectedTask?.isFullAuto ? 'AI 自治执行记录' : 'Chatbot 上下文'}</h3>
            </div>
            <div className="aw-messages">
              {detail.contextMessages.map((msg) => (
                <div key={msg.id} className={`context-msg ${msg.role}`}>
                  <div className="context-msg-row">
                    <div className={`context-msg-avatar ${msg.role === 'user' ? 'user-avatar' : msg.roleName === '章鱼Agent' ? 'octopus-avatar' : msg.role === 'system' ? 'system-avatar' : 'expert-avatar'} ${msg.roleName === '数据分析Agent' ? 'expert-data' : msg.roleName === '品类运营Agent' ? 'expert-category' : msg.roleName === '招商Agent' ? 'expert-merchant' : msg.roleName === '渠道分析Agent' ? 'expert-channel' : msg.roleName === '投流Agent' ? 'expert-invest' : ''}`}>
                      {msg.role === 'user' ? <UserOutlined /> : msg.role === 'system' ? <ClockCircleOutlined /> : msg.roleName === '章鱼Agent' ? '🐙' : msg.roleName === '数据分析Agent' ? '📊' : msg.roleName === '品类运营Agent' ? '🏷️' : msg.roleName === '招商Agent' ? '🤝' : msg.roleName === '渠道分析Agent' ? '📈' : msg.roleName === '投流Agent' ? '💰' : <TeamOutlined />}
                    </div>
                    <div className="context-msg-body">
                      <div className="context-msg-meta">
                        <span className="context-msg-name">{msg.roleName}</span>
                        <span className="context-msg-time">{msg.time}</span>
                      </div>
                      <div className="context-msg-bubble">
                        <div className="context-msg-content">{msg.content}</div>
                        {msg.evidence && msg.evidence.length > 0 && (
                          <div className="context-msg-evidence">
                            <ExperimentOutlined style={{ marginRight: 4 }} />
                            证据：{msg.evidence.join('、')}
                          </div>
                        )}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="context-msg-actions">
                            {msg.actions.map(action => (
                              <button key={action} className="context-msg-action">{action}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
          </>
        ) : (
         <>
            {/* 状态A：引导页 */}
            <div className="aw-welcome">
              <div className="aw-welcome-bar">
                <img src="/octopus-logo.svg" alt="章鱼" className="aw-welcome-logo-sm" />
                <div className="aw-welcome-tentacle-wrap">
                  <div className="aw-welcome-subtitle-sm">
                    hi，昌粟，我是你的24小时AI助理。
                  </div>
                </div>
              </div>

             {viewPerspective === 'TL' ? (
                <>
                  {/* 业务指标 - 3×2卡片网格 */}
                  <section className="aw-briefing-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="aw-briefing-title" style={{ marginBottom: 0 }}>📊 业务指标</div>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: 6, padding: 2 }}>
                        {(['MTD', 'T-1', '实时'] as MetricTimeRange[]).map(range => (
                          <button
                            key={range}
                            onClick={() => setMetricTimeRange(range)}
                            style={{
                              border: 'none',
                              outline: 'none',
                              cursor: 'pointer',
                              padding: '4px 12px',
                              borderRadius: 4,
                              fontSize: 12,
                              fontWeight: metricTimeRange === range ? 600 : 400,
                              color: metricTimeRange === range ? '#fff' : '#6B7280',
                              background: metricTimeRange === range ? '#00B578' : 'transparent',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="metric-card-grid">
                      {[
                        { id: 'mc1', name: '核心品类确收', target: '8.5亿', achieved: '9.2亿', rate: 108.2, unit: '亿' },
                        { id: 'mc2', name: '闪购父订单量', target: '125万', achieved: '118万', rate: 94.4, unit: '万' },
                        { id: 'mc3', name: '投流托管消耗额', target: '3200万', achieved: '3580万', rate: 111.9, unit: '万' },
                        { id: 'mc4', name: '88VIP&高购用户AAC', target: '45万', achieved: '42万', rate: 93.3, unit: '万' },
                        { id: 'mc5', name: '爆款链接数', target: '8650', achieved: '9120', rate: 105.4, unit: '' },
                        { id: 'mc6', name: 'AI招盘投GMV', target: '2.8亿', achieved: '3.1亿', rate: 110.7, unit: '亿' },
                      ].map((item, idx) => (
                        <div key={item.id} className={`metric-card-item ${idx === 0 ? 'metric-card-highlight' : ''}`}>
                          <div className="metric-card-header">
                            <span className="metric-card-dot" />
                            <span className="metric-card-name">{item.name}</span>
                          </div>
                          <div className="metric-card-divider" />
                          <div className="metric-card-data">
                            <div className="metric-card-data-item">
                              <span className="metric-card-label">目标</span>
                              <span className="metric-card-value">{item.target}</span>
                            </div>
                            <div className="metric-card-data-item">
                              <span className="metric-card-label">达成</span>
                              <span className="metric-card-value">{item.achieved}</span>
                            </div>
                            <div className="metric-card-data-item">
                              <span className="metric-card-label">达成率</span>
                              <span className={`metric-card-rate ${item.rate >= 100 ? 'metric-card-rate-ok' : 'metric-card-rate-warn'}`}>{item.rate}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* AI策略 - 全宽独占一行 */}
                  <section className="aw-briefing-section">
                    <div className="aw-briefing-title">🐙 AI策略</div>
                    <div className="aw-strategy-tabs">
                      {(['pending', 'adopted', 'expired'] as const).map(tab => (
                        <button
                          key={tab}
                          className={`aw-strategy-tab-btn ${strategyFilter === tab ? 'active' : ''}`}
                          onClick={() => setStrategyFilter(tab)}
                        >
                          {{ pending: '待采纳', adopted: '已采纳', expired: '已过期' }[tab]}
                          <span className="aw-strategy-tab-count">
                            {mockStrategies.filter(s => s.status === tab).length}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="aw-strategy-compact">
                      {mockStrategies.filter(s => s.status === strategyFilter).length === 0 ? (
                        <div className="aw-strategy-empty">暂无{({ pending: '待采纳', adopted: '已采纳', expired: '已过期' } as Record<string, string>)[strategyFilter]}策略</div>
                      ) : (
                        mockStrategies.filter(s => s.status === strategyFilter).map(s => (
                          <div
                            key={s.id}
                            className={`aw-strategy-row ${strategyFilter === 'pending' ? 'aw-strategy-pending' : ''}`}
                            style={strategyFilter === 'expired' ? { opacity: 0.7 } : undefined}
                          >
                            <span className="aw-strategy-row-icon">💡</span>
                            <div className="aw-strategy-row-content">
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span className="aw-strategy-row-title">{s.title}</span>
                              </div>
                              <div className="aw-strategy-row-detail">
                                <span className="aw-strategy-row-label">问题归因：</span>{s.problemSummary}
                              </div>
                              <div className="aw-strategy-row-detail">
                                <span className="aw-strategy-row-label">策略方案：</span>{s.strategySummary}
                              </div>

                            </div>
                            {strategyFilter === 'pending' && (
                              <button
                                className="aw-strategy-task-btn"
                                onClick={(e) => { e.stopPropagation(); if (s.linkedTaskId) { navigate(`/task/${s.linkedTaskId}`); } else { setModalStrategy(s); } }}
                                style={{
                                  border: 'none',
                                  color: '#fff',
                                  background: '#00B578',
                                  padding: '4px 12px',
                                  borderRadius: 4,
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#009960')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#00B578')}
                              >
                                去处理
                              </button>
                            )}
                            {strategyFilter === 'adopted' && s.linkedTaskId && (
                              <button
                                className="aw-strategy-task-btn"
                                onClick={(e) => { e.stopPropagation(); navigate(`/task/${s.linkedTaskId}`); }}
                                style={{
                                  border: 'none',
                                  color: '#fff',
                                  background: '#00B578',
                                  padding: '4px 12px',
                                  borderRadius: 4,
                                  fontSize: 12,
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#009960')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#00B578')}
                              >
                                任务详情
                              </button>
                            )}
                            {strategyFilter === 'expired' && (
                              <span className="aw-strategy-status aw-status-expired">已过期</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </>
              ) : (
                 <>
                  {/* 工作结果 + 待确认 + 将要执行 三列布局 */}
                  <section className="aw-briefing-section">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'stretch', width: '100%' }}>
                      {/* 左侧：工作结果 */}
                      <div style={{
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 240,
                        minWidth: 0,
                        overflow: 'hidden',
                      }}>
                        {/* 卡片头部 */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>📊 工作结果</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, letterSpacing: 1 }}>WORK RESULTS</div>
                        </div>

                        {/* 内容区 */}
                        <div style={{ flex: 1 }}>
                          {[
                            { id: 'wr1', name: '百亿补贴运营计划生成', time: '04-19', result: '5月运营计划已生成，覆盖4大品类' },
                            { id: 'wr2', name: '渠道进度播报', time: '04-20', result: '今日播报已推送，家清品类需关注' },
                            { id: 'wr3', name: '竞品价格监控', time: '04-20', result: '发现3个品类价格异常，已标记预警' },
                            { id: 'wr4', name: '周度复盘报告生成', time: '04-21', result: '第16周复盘已生成，GMV环比+8.3%' },
                          ].map((item, idx, arr) => (
                            <div
                              key={item.id}
                              style={{
                                padding: '8px 0',
                                borderBottom: idx < arr.length - 1 ? '1px solid #F3F4F6' : 'none',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.name}</span>
                                <span style={{ color: '#9CA3AF', fontSize: 11, flexShrink: 0, marginLeft: 8 }}>{item.time} 完成</span>
                              </div>
                              <div style={{ marginTop: 4, fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.result}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 底部统计 */}
                        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #F3F4F6', fontSize: 12, color: '#9CA3AF' }}>
                          共 4 项已完成
                        </div>
                      </div>

                      {/* 中间：待确认 */}
                      {(() => {
                        const xiaoerTasks = [...(mockTasks['xiaoer'] || []), ...dynamicTasks];
                        const pendingConfirmTasks = xiaoerTasks.filter(t => t.status === 'pending_confirm');
                        const delegatedGroup = pendingConfirmTasks.filter(t => t.source === 'delegated');
                        const aiGroup = pendingConfirmTasks.filter(t => t.source !== 'delegated');
                        return (
                          <div style={{
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
                            padding: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 240,
                            minWidth: 0,
                            overflow: 'hidden',
                          }}>
                            {/* 卡片头部 */}
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>📋 待确认</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, letterSpacing: 1 }}>PENDING CONFIRMATION</div>
                            </div>

                            {/* 内容区 */}
                            <div style={{ flex: 1 }}>
                              {pendingConfirmTasks.length === 0 ? (
                                <div style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', paddingTop: 32 }}>暂无待确认任务</div>
                              ) : (
                                <>
                                  {/* 被委派分组 */}
                                  {delegatedGroup.length > 0 && (
                                    <div style={{ marginBottom: aiGroup.length > 0 ? 12 : 0 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <div style={{ width: 3, height: 12, borderRadius: 2, background: '#3B82F6' }} />
                                        <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>被委派</span>
                                      </div>
                                      {delegatedGroup.slice(0, 2).map((task, idx, arr) => (
                                        <div
                                          key={task.id}
                                          style={{
                                            padding: '8px 0',
                                            borderBottom: idx < arr.length - 1 ? '1px solid #F3F4F6' : 'none',
                                            transition: 'background 0.15s',
                                          }}
                                          onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{task.title}</span>
                                            <button
                                              onClick={() => navigate(`/task/${task.id}`)}
                                              style={{
                                                border: 'none',
                                                background: '#F0FDF4',
                                                color: '#00B578',
                                                fontSize: 12,
                                                fontWeight: 500,
                                                padding: '3px 10px',
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                marginLeft: 8,
                                                transition: 'background 0.15s',
                                              }}
                                              onMouseEnter={e => (e.currentTarget.style.background = '#DCFCE7')}
                                              onMouseLeave={e => (e.currentTarget.style.background = '#F0FDF4')}
                                            >
                                              去处理
                                            </button>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, overflow: 'hidden' }}>
                                            <span style={{ fontSize: 12, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.createTime}</span>
                                            {task.delegator && (
                                              <span style={{ fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>委派人：{task.delegator}</span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                      {delegatedGroup.length > 2 && (
                                        <div
                                          onClick={() => {
                                            setTaskFilter('current');
                                            setStatusFilter('pending_confirm');
                                            setDelegatedFilter('yes');
                                          }}
                                          style={{
                                            paddingTop: 8,
                                            fontSize: 12,
                                            color: '#00B578',
                                            cursor: 'pointer',
                                            textAlign: 'right',
                                          }}
                                          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                                          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                                        >
                                          查看更多({delegatedGroup.length - 2}) &gt;
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* AI主动发起分组 */}
                                  {aiGroup.length > 0 && (
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <div style={{ width: 3, height: 12, borderRadius: 2, background: '#10B981' }} />
                                        <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>AI主动发起</span>
                                      </div>
                                      {aiGroup.slice(0, 2).map((task, idx, arr) => (
                                        <div
                                          key={task.id}
                                          style={{
                                            padding: '8px 0',
                                            borderBottom: idx < arr.length - 1 ? '1px solid #F3F4F6' : 'none',
                                            transition: 'background 0.15s',
                                          }}
                                          onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{task.title}</span>
                                            <button
                                              onClick={() => navigate(`/task/${task.id}`)}
                                              style={{
                                                border: 'none',
                                                background: '#F0FDF4',
                                                color: '#00B578',
                                                fontSize: 12,
                                                fontWeight: 500,
                                                padding: '3px 10px',
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                marginLeft: 8,
                                                transition: 'background 0.15s',
                                              }}
                                              onMouseEnter={e => (e.currentTarget.style.background = '#DCFCE7')}
                                              onMouseLeave={e => (e.currentTarget.style.background = '#F0FDF4')}
                                            >
                                              去处理
                                            </button>
                                          </div>
                                          <div style={{ marginTop: 4, overflow: 'hidden' }}>
                                            <span style={{ fontSize: 12, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.createTime}</span>
                                          </div>
                                        </div>
                                      ))}
                                      {aiGroup.length > 2 && (
                                        <div
                                          onClick={() => {
                                            setTaskFilter('current');
                                            setStatusFilter('pending_confirm');
                                            setDelegatedFilter('no');
                                          }}
                                          style={{
                                            paddingTop: 8,
                                            fontSize: 12,
                                            color: '#00B578',
                                            cursor: 'pointer',
                                            textAlign: 'right',
                                          }}
                                          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                                          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                                        >
                                          查看更多({aiGroup.length - 2}) &gt;
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            {/* 底部统计 */}
                            {pendingConfirmTasks.length > 0 && (
                              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #F3F4F6', fontSize: 12, color: '#9CA3AF' }}>
                                共 {pendingConfirmTasks.length} 项待确认
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* 右侧：将要执行 */}
                      <div style={{
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 240,
                        minWidth: 0,
                        overflow: 'hidden',
                      }}>
                        {/* 卡片头部 */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>📅 将要执行</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, letterSpacing: 1 }}>UPCOMING TASKS</div>
                        </div>

                        {/* 内容区 */}
                        <div style={{ flex: 1 }}>
                          {mockUpcomingTasks.length === 0 ? (
                            <div style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', paddingTop: 32 }}>暂无将要执行的任务</div>
                          ) : (
                            mockUpcomingTasks.map((item, idx) => (
                              <div
                                key={item.id}
                                onClick={() => setUpcomingTaskModal(item)}
                                style={{
                                  padding: '8px 0',
                                  cursor: 'pointer',
                                  borderBottom: idx < mockUpcomingTasks.length - 1 ? '1px solid #F3F4F6' : 'none',
                                  transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.name}</span>
                                  <span style={{ color: '#9CA3AF', fontSize: 11, flexShrink: 0, marginLeft: 8 }}>{item.date}</span>
                                </div>
                                {item.prompt && (
                                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.prompt}</div>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* 底部统计 */}
                        {mockUpcomingTasks.length > 0 && (
                          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #F3F4F6', fontSize: 12, color: '#9CA3AF' }}>
                            共 {mockUpcomingTasks.length} 项待执行
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </>
              )}


            </div>

          </>
        )}

        {/* 统一底部输入框 - 常驻显示 */}
        <div className="aw-input-area aw-input-area-fixed">
          {editingStrategy && (
            <div className="aw-editing-context-bar">
              <span className="aw-editing-context-icon">✏️</span>
              <span className="aw-editing-context-text">正在修改：{editingStrategy}</span>
              <button className="aw-editing-context-close" onClick={() => setEditingStrategy(null)}>✕</button>
            </div>
          )}
          <div className="context-input-area" style={{ border: 'none', padding: 0 }}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={editingStrategy ? `描述你想对「${editingStrategy}」进行的修改...` : selectedTaskId ? '围绕当前任务继续问章鱼...' : '描述你的运营需求，章鱼帮你分析和执行...'}
            />
            <button onClick={handleSend}>
              <SendOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* 右栏 - 仅在选中任务时显示 */}
      {selectedTaskId && detail && (
      <div className="aw-right">
          <div className="summary-panel">
            {/* 执行结果卡片 */}
            <div className="summary-card exec-result-card">
              <div className="summary-card-title">
                <BarChartOutlined style={{ marginRight: 6 }} />执行结果
                <span className="exec-update-badge"><SyncOutlined spin style={{ fontSize: 10, marginRight: 4 }} />更新中</span>
              </div>
              <div className="exec-update-freq">每 1 小时自动刷新</div>
              <div className="exec-metrics-grid">
                {detail.executionMetrics.map((metric, idx) => (
                  <div key={idx} className="exec-metric-card">
                    <div className="exec-metric-label">{metric.label}</div>
                    <div className="exec-metric-value">{metric.value}</div>
                    <div className={`exec-metric-change ${metric.trend === 'up' ? 'trend-up' : metric.trend === 'down' ? 'trend-down' : ''}`}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '–'} {metric.change}
                    </div>
                  </div>
                ))}
              </div>
              <div className="file-link">
                <a href="#" onClick={e => { e.preventDefault(); setExecutionModalOpen(true); }}>查看数据明细 →</a>
              </div>
            </div>

            {/* 任务血缘卡片 */}
            <div className="summary-card">
              <div className="summary-card-title"><ApartmentOutlined style={{ marginRight: 6 }} />任务血缘</div>
              <div className="lineage-section">
                <div className="lineage-section-label">上游来源</div>
                {selectedTask?.source === 'strategy' ? (
                  <div className="lineage-task-item lineage-strategy-source" onClick={() => navigate(`/strategy/${selectedTask.strategyId}`)}>
                    <div className="lineage-task-info">
                      <span className="lineage-task-title">📋 {selectedTask.sourceDetail}</span>
                      <span className="lineage-task-owner">AI 策略生成</span>
                    </div>
                    <Tag color="green" style={{ fontSize: 11, flexShrink: 0 }}>策略</Tag>
                  </div>
                ) : detail.lineage.upstream && detail.lineage.upstream.length > 0 ? (
                  detail.lineage.upstream.map((t) => (
                    <div key={t.id} className="lineage-task-item" onClick={() => navigate(`/task/${t.id}`)}>
                      <div className="lineage-task-info">
                        <span className="lineage-task-title">{t.title}</span>
                        {!detail.isFullAuto && <span className="lineage-task-owner">{t.owner}</span>}
                      </div>
                      <Tag color={lineageStatusColor[t.status]} style={{ fontSize: 11, flexShrink: 0 }}>{t.statusLabel}</Tag>
                    </div>
                  ))
                ) : (
                  <div className="lineage-empty">无上游来源</div>
                )}
              </div>
              <div className="lineage-current">
                <span className="lineage-current-dot" />
                当前：{selectedTask?.title}
              </div>
              <div className="lineage-section">
                <div className="lineage-section-label">下游任务</div>
                {detail.lineage.downstream && detail.lineage.downstream.length > 0 ? (
                  detail.lineage.downstream.map((t) => (
                    <div key={t.id} className="lineage-task-item" onClick={() => navigate(`/task/${t.id}`)}>
                      <div className="lineage-task-info">
                        <span className="lineage-task-title">{t.title}</span>
                        {!detail.isFullAuto && <span className="lineage-task-owner">{t.owner}</span>}
                      </div>
                      <Tag color={lineageStatusColor[t.status]} style={{ fontSize: 11, flexShrink: 0 }}>{t.statusLabel}</Tag>
                    </div>
                  ))
                ) : (
                  <div className="lineage-empty">无下游任务</div>
                )}
              </div>
              <div className="lineage-view-more" onClick={() => setLineageModalOpen(true)}>
                查看完整血缘图 →
              </div>
            </div>

            {/* 生成文件卡片 */}
            <div className="summary-card">
              <div className="summary-card-title"><FileTextOutlined style={{ marginRight: 6 }} />生成文件<span className="file-count-badge">{detail.generatedFiles.length}</span></div>
              {detail.generatedFiles.slice(0, 3).map(file => (
                <div key={file.id} className="file-item file-item-clickable" onClick={() => handleDownload(file.name)}>
                  <div className="file-item-left">
                    {fileIconMap[file.type]}
                    <span className="file-item-name">{file.name}</span>
                  </div>
                  <div className="file-item-right">
                    <span className="file-item-size">{file.size}</span>
                    <DownloadOutlined className="file-item-download" />
                  </div>
                </div>
              ))}
              {detail.generatedFiles.length > 3 && (
                <div className="file-more-hint">还有 {detail.generatedFiles.length - 3} 个文件</div>
              )}
              <div className="file-link">
                <a href="#" onClick={e => { e.preventDefault(); setFilesModalOpen(true); }}>全部文件 →</a>
              </div>
            </div>
          </div>
      </div>
      )}

      {/* 血缘图弹窗 */}
      <Modal
        title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ApartmentOutlined /> 完整任务血缘图</span>}
        open={lineageModalOpen}
        onCancel={() => setLineageModalOpen(false)}
        footer={null}
        width={800}
        centered
        styles={{ body: { padding: 0 } }}
      >
        <div className="lineage-tree-modal">
          <div className="lt-legend">
            <span className="lt-legend-item"><span className="lt-legend-dot lt-legend-strategy" />策略来源</span>
            <span className="lt-legend-item"><span className="lt-legend-dot lt-legend-current" />当前任务</span>
            <span className="lt-legend-item"><span className="lt-legend-dot lt-legend-normal" />关联任务</span>
          </div>
          <div className="lt-tree-container">
            {lineageTree ? renderTreeNode(lineageTree) : <div className="lineage-empty">暂无血缘数据</div>}
          </div>
        </div>
      </Modal>

      {/* 执行数据明细弹窗 */}
      <Modal
        title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BarChartOutlined /> 执行数据明细</span>}
        open={executionModalOpen}
        onCancel={() => setExecutionModalOpen(false)}
        footer={null}
        width={860}
        centered
        styles={{ body: { padding: 0 } }}
      >
        <div className="exec-detail-modal">
          <div className="exec-detail-header">
            <span className="exec-detail-update-info">
              <SyncOutlined spin style={{ fontSize: 11, marginRight: 4 }} />
              数据持续更新中 · 每 1 小时自动刷新
            </span>
          </div>
          {detail && (
            <div className="exec-detail-overview">
              {detail.executionMetrics.map((metric, idx) => (
                <div key={idx} className="exec-overview-item">
                  <div className="exec-overview-label">{metric.label}</div>
                  <div className="exec-overview-value">{metric.value}
                    <span className={metric.trend === 'up' ? 'trend-up' : metric.trend === 'down' ? 'trend-down' : ''} style={{ fontSize: 12, marginLeft: 6, fontWeight: 600 }}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : ''}{metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {detail && (
            <div className="exec-causal-section">
              <div className="exec-causal-title">执行动作 → 业务影响</div>
              {detail.executionMetrics.map((metric, idx) => (
                <div key={idx} className="exec-causal-row">
                  <div className="exec-causal-action">
                    <span className="exec-causal-tag">操作</span>
                    {metric.action}
                  </div>
                  <div className="exec-causal-arrow">→</div>
                  <div className="exec-causal-result">
                    <span className="exec-causal-tag exec-causal-tag-impact">影响</span>
                    <span className="exec-causal-metric-name">{metric.label}</span>
                    <span className={`exec-causal-change ${metric.trend === 'up' ? 'trend-up' : metric.trend === 'down' ? 'trend-down' : ''}`}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : ''}{metric.change}
                    </span>
                  </div>
                  <div className="exec-causal-desc">{metric.impact}</div>
                </div>
              ))}
            </div>
          )}
          {detail && detail.executionDetails && detail.executionDetails.length > 0 && (
            <div className="exec-detail-table-section">
              <div className="exec-causal-title" style={{ padding: '16px 20px 12px' }}>数据明细</div>
              <table className="exec-detail-table">
                <thead>
                  <tr>
                    <th>分类/维度</th>
                    <th>指标</th>
                    <th>执行前</th>
                    <th>执行后</th>
                    <th>变化</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.executionDetails.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.category}</td>
                      <td>{row.metric}</td>
                      <td>{row.before}</td>
                      <td>{row.after}</td>
                      <td className={row.trend === 'up' ? 'positive' : row.trend === 'down' ? 'negative' : ''}>
                        {row.trend === 'up' ? '↑ ' : row.trend === 'down' ? '↓ ' : ''}{row.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>

      {/* 全部文件弹窗 */}
      <Modal
        title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileTextOutlined /> 全部生成文件</span>}
        open={filesModalOpen}
        onCancel={() => setFilesModalOpen(false)}
        footer={null}
        width={640}
        centered
        styles={{ body: { padding: 0 } }}
      >
        {detail && (
          <div className="files-modal">
            <div className="files-modal-header">
              共 {detail.generatedFiles.length} 个文件
            </div>
            <div className="files-modal-list">
              {detail.generatedFiles.map(file => (
                <div key={file.id} className="files-modal-item" onClick={() => handleDownload(file.name)}>
                  <div className="files-modal-icon">{fileIconMap[file.type]}</div>
                  <div className="files-modal-info">
                    <div className="files-modal-name">{file.name}</div>
                    <div className="files-modal-meta">{file.size} · {file.createdAt}</div>
                  </div>
                  <div className="files-modal-action">
                    <DownloadOutlined />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* 将要执行任务 Prompt 弹窗 */}
      {upcomingTaskModal && (
        <div className="upcoming-modal-overlay" onClick={() => setUpcomingTaskModal(null)}>
          <div className="upcoming-modal-container" onClick={e => e.stopPropagation()}>
            <button className="upcoming-modal-close" onClick={() => setUpcomingTaskModal(null)}>✕</button>
            <div className="upcoming-modal-header">
              <h2 className="upcoming-modal-title">{upcomingTaskModal.name}</h2>
              <span className="upcoming-modal-date">预计执行：{upcomingTaskModal.date}</span>
            </div>
            <div className="upcoming-modal-body" style={{ maxHeight: 300, overflowY: 'auto' }}>
              <div className="upcoming-modal-prompt" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{upcomingTaskModal.prompt}</div>
            </div>
            <div className="upcoming-modal-footer">
              该任务尚未执行，以上为执行时的任务指令
            </div>
          </div>
        </div>
      )}

      {/* 策略详情弹窗 */}
      {modalStrategy && (
        <div className="strategy-modal-overlay" onClick={() => { setModalStrategy(null); setModalChatOpen(false); setModalChatMessages([]); }}>
          <div className="strategy-modal-container" onClick={e => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button className="strategy-modal-close" onClick={() => { setModalStrategy(null); setModalChatOpen(false); setModalChatMessages([]); }}>✕</button>

            {/* 可滚动内容区 */}
            <div className="strategy-modal-body">
              {/* 顶部：策略名称 + 标签 */}
              <div className="strategy-modal-header">
                <h2 className="strategy-modal-title">{modalStrategy.title}</h2>
                {modalStrategy.isFullAuto && (
                  <span className="strategy-modal-tag">🤖 AI全托管</span>
                )}
              </div>

              {/* AI总结 */}
              <div className="strategy-modal-ai-summary">
                AI基于数据分析发现以下问题，建议执行该策略
              </div>

              {/* 问题归因 */}
              <div className="strategy-modal-section">
                <div className="strategy-modal-section-header">
                  <span className="strategy-modal-section-icon problem">!</span>
                  <h3>问题归因</h3>
                </div>
                <div className="strategy-modal-section-content">
                  {mockStrategyDetails[modalStrategy.id] ? (
                    mockStrategyDetails[modalStrategy.id].problemSections.map((sec, i) => (
                      <div key={i} className="strategy-modal-detail-block">
                        <h4>{sec.title}</h4>
                        {sec.summary && <p className="strategy-modal-detail-summary">{sec.summary}</p>}
                        {sec.items && (
                          <ul className="strategy-modal-detail-items">
                            {sec.items.map((item, j) => (
                              <li key={j}><strong>{item.label}：</strong>{item.desc}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="strategy-modal-detail-text">{modalStrategy.problemDetail}</p>
                  )}
                </div>
              </div>

              {/* 策略方案 */}
              <div className="strategy-modal-section">
                <div className="strategy-modal-section-header">
                  <span className="strategy-modal-section-icon strategy">✦</span>
                  <h3>策略方案</h3>
                </div>
                <div className="strategy-modal-section-content">
                  {mockStrategyDetails[modalStrategy.id] ? (
                    mockStrategyDetails[modalStrategy.id].strategySections.map((sec, i) => (
                      <div key={i} className="strategy-modal-detail-block">
                        <h4>{sec.title}</h4>
                        {sec.summary && <p className="strategy-modal-detail-summary">{sec.summary}</p>}
                        {sec.items && (
                          <ul className="strategy-modal-detail-items">
                            {sec.items.map((item, j) => (
                              <li key={j}><strong>{item.label}：</strong>{item.desc}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="strategy-modal-detail-text">{modalStrategy.strategyDetail}</p>
                  )}
                </div>
              </div>


              {/* 弹窗内对话区 */}
              {modalChatOpen && (
                <div className="strategy-modal-chat">
                  <div className="strategy-modal-chat-messages">
                    {modalChatMessages.map(msg => (
                      <div key={msg.id} className={`strategy-modal-chat-bubble strategy-modal-chat-bubble-${msg.role}`}>
                        <span className="strategy-modal-chat-name">{msg.role === 'user' ? '我' : '🐙 章鱼Agent'}</span>
                        <div className="strategy-modal-chat-content">{msg.content}</div>
                      </div>
                    ))}
                  </div>
                  <div className="strategy-modal-chat-input-area">
                    <input
                      type="text"
                      className="strategy-modal-chat-input"
                      placeholder="描述您想修改的内容..."
                      value={modalChatInput}
                      onChange={e => setModalChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleModalChatSend(); } }}
                      disabled={modalChatSending}
                    />
                    <button className="strategy-modal-chat-send" onClick={handleModalChatSend} disabled={modalChatSending}>
                      <SendOutlined />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="strategy-modal-footer">
              <button
                className="strategy-modal-btn-secondary"
                onClick={() => {
                  const strategyName = modalStrategy.title;
                  setModalStrategy(null);
                  setModalChatOpen(false);
                  setModalChatMessages([]);
                  setEditingStrategy(strategyName);
                }}
              >
                <EditOutlined style={{ marginRight: 4 }} /> 修改策略
              </button>
              <button
                className="strategy-modal-btn-primary"
                onClick={() => { handleAdopt(modalStrategy.id); setModalStrategy(null); }}
              >
                <ThunderboltOutlined style={{ marginRight: 4 }} /> 采纳执行
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentWorkspace;
