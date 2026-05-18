import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Tag, Modal, message, Button } from 'antd';
import {
  ClockCircleOutlined, TeamOutlined,
  SendOutlined, UserOutlined, RobotOutlined, FileExcelOutlined,
  FileWordOutlined, FilePdfOutlined, FileImageOutlined,
  ApartmentOutlined, FileTextOutlined, BarChartOutlined,
  ExperimentOutlined, SyncOutlined, DownloadOutlined, EyeOutlined,
} from '@ant-design/icons';
import { useAppContext } from '../store';
import { mockTasks, mockTaskDetails, mockStrategyDetails } from '../mock/data';
import type { ContextMessage, ProgressStep, StrategyContext, StrategyDetailData } from '../mock/data';
import GlobalArtifactPanel from '../components/GlobalArtifactPanel';

const statusMap: Record<string, { label: string; color: string }> = {
  todo: { label: '待执行', color: 'orange' },
  inprogress: { label: '进行中', color: 'blue' },
  done: { label: '已完成', color: 'green' },
  pending_confirm: { label: '待确认', color: 'gold' },
  failed: { label: '失败', color: 'red' },
};

const lineageStatusColor: Record<string, string> = {
  done: 'green',
  inprogress: 'blue',
  pending: 'orange',
  todo: 'default',
  adopted: 'green',
  failed: 'red',
};

const fileIconMap: Record<string, React.ReactNode> = {
  xlsx: <FileExcelOutlined style={{ color: '#10B981', fontSize: 20 }} />,
  docx: <FileWordOutlined style={{ color: '#3B82F6', fontSize: 20 }} />,
  pdf: <FilePdfOutlined style={{ color: '#DC2626', fontSize: 20 }} />,
  png: <FileImageOutlined style={{ color: '#8B5CF6', fontSize: 20 }} />,
  doc: <FileWordOutlined style={{ color: '#3B82F6', fontSize: 20 }} />,
};

const fileEmojiMap: Record<string, string> = {
  xlsx: '📊',
  docx: '📄',
  pdf: '📄',
  png: '🖼️',
  doc: '📝',
};

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, dynamicTasks, dynamicTaskDetails, addDynamicTaskDetail, openArtifact, artifactPanel, toggleArtifactPanel, toggleArtifactFullscreen, closeArtifactPanel, setActiveArtifact } = useAppContext();

  // 判断是否需要启用动画：通过 location state 或 URL 参数
  const shouldAnimate = (location.state as any)?.animate === true || searchParams.get('animate') === 'true';

  // 当前任务的工件列表
  const taskArtifacts = artifactPanel.items.filter(it => it.sourcePageId === id);

  // 离开任务详情页时关闭工件面板
  useEffect(() => {
    return () => {
      closeArtifactPanel();
    };
  }, []);

  // 任务切换时处理 activeId 兵底
  useEffect(() => {
    if (!id) return;
    const currentTaskItems = artifactPanel.items.filter(it => it.sourcePageId === id);
    if (artifactPanel.activeId) {
      const activeInCurrentTask = currentTaskItems.find(it => it.id === artifactPanel.activeId);
      if (!activeInCurrentTask) {
        if (currentTaskItems.length > 0) {
          setActiveArtifact(currentTaskItems[0].id);
        } else {
          setActiveArtifact(null as any);
        }
      }
    }
  }, [id]);

  const [rightTab, setRightTab] = useState<'progress' | 'lineage' | 'files'>('progress');

  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [lineageModalOpen, setLineageModalOpen] = useState(false);
  const [executionModalOpen, setExecutionModalOpen] = useState(false);
  const [filesModalOpen, setFilesModalOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'current' | 'all'>('current');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_confirm' | 'inprogress' | 'done' | 'failed'>('all');
  const [delegatedFilter, setDelegatedFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>({ ai: true, task: true });
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  // 策略上下文交互状态
  const [executionPhase, setExecutionPhase] = useState<'pending_confirm' | 'executing' | 'completed' | 'rejected'>('pending_confirm');
  const [visibleAgentMessages, setVisibleAgentMessages] = useState<number>(0);
  const agentTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [pendingExecution, setPendingExecution] = useState(false);
  const [nextAgentName, setNextAgentName] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleDownload = (fileName: string) => {
    message.success(`正在下载：${fileName}`);
  };
  const msgEndRef = useRef<HTMLDivElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [inlineAdjustInput, setInlineAdjustInput] = useState('');

 // 人机协同：确认收到 & 对话式反馈
  const [taskConfirmed, setTaskConfirmed] = useState(false);
  const [appendedMessages, setAppendedMessages] = useState<Array<{id: string; time: string; role: string; roleName: string; content: string; category: string}>>([]); 

  const handleConfirmReceived = () => {
    setTaskConfirmed(true);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setAppendedMessages(prev => [
      ...prev,
      {
        id: 'appended-confirm',
        time: timeStr,
        role: 'user',
        roleName: '用户',
        content: '已确认收到任务，我开始执行。',
        category: 'instruction'
      },
      {
        id: 'appended-confirm-reply',
        time: timeStr,
        role: 'agent',
        roleName: '章鱼Agent',
        content: '好的，任务已开始！执行过程中如有任何问题可以随时问我。\n\n完成后直接告诉我执行结果就行，比如"已完成，具体情况是..."或者"遇到问题，需要帮助..."',
        category: 'judgment'
      }
    ]);
  };

  const allMockTasks = Object.values(mockTasks).flat();
  const allTasksList = [...(mockTasks[user.role] || []), ...dynamicTasks];
  const task = allMockTasks.find(t => t.id === id) || dynamicTasks.find(t => t.id === id);
  const detail = task ? (mockTaskDetails[task.id] || dynamicTaskDetails[task.id]) : undefined;

  // 判断是否为AI全托管任务（只有isFullAuto才隐藏输入框）
  const isAutoManaged = !!(detail?.isFullAuto);

  const filteredTaskList = allTasksList.filter(t => {
    if (taskFilter === 'current') return t.status === 'inprogress' || t.status === 'in_progress' || t.status === 'pending_confirm' || t.status === 'failed';
    return true; // 'all' shows everything
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

  const filteredMessages: ContextMessage[] = detail
    ? detail.contextMessages
    : [];

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages.length, visibleCount, appendedMessages]);

  // 执行进展步骤数据
  const defaultPendingSteps: ProgressStep[] = [
    { name: '潜力链接筛选池构建', agent: '数据分析Agent', description: '乳饮冲调/家清/个人护理类目潜力链接筛选池构建（从近30天日均GMV≥5000元、订单≥50单的商品中筛选符合打爆标准的候选品，输出目标清单）' },
    { name: '流失爆品补位引入', agent: '供应链Agent', description: '流失爆品下架补位商品引入（针对电器数码/乳饮冲调下架的1146个爆品，从现货率≥92%的下游商品池中捞取补位品，完成上新）' },
    { name: '缩短打爆周期执行', agent: '运营Agent', description: '缩短打爆周期执行（将新品打爆周期从30天压缩至26天，前7天私域孵化+强控低价+淘客跑量，15天后叠加活动资源+广告投放，目标单链接GMV 33.9万）' },
    { name: '存量爆品流量优化', agent: '流量Agent', description: '存量爆品主搜/换购/淘客渠道流量优化（针对IPV下滑30.2%的2224个存量爆品，优化搜索关键词覆盖、换购坑位排期、淘客佣金策略）' },
    { name: '百补/秒杀渠道招商下发', agent: '招商Agent', description: '百补/秒杀渠道招商邀约下发（将筛选出的潜力链接清单通过星瞳Agent下发至百补和秒杀渠道，完成招商邀约）' },
    { name: '爆品流失预警机制建立', agent: '风控Agent', description: '爆品流失预警机制建立（监控核心爆品到手价变动、补贴断档、现货率低于24仓等指标，设定92%在架率及格线，触发自动补位）' },
  ];
  const defaultOtherSteps: ProgressStep[] = [
    { name: '需求理解', agent: '章鱼Agent', description: '解析任务目标与约束条件，确定分析维度和输出格式' },
    { name: '数据分析', agent: '数据分析Agent', description: '多维度数据拉取与交叉分析，识别关键问题和机会点' },
    { name: '品类运营分析', agent: '品类运营Agent', description: '从品类视角评估商品潜力，给出品类运营策略建议' },
    { name: '渠道分析', agent: '渠道分析Agent', description: '分析各渠道流量与转化表现，匹配最优渠道组合' },
    { name: '招商方案制定', agent: '招商Agent', description: '基于数据分析结果，制定招商策略和商家沟通方案' },
    { name: '策略汇总', agent: '章鱼Agent', description: '整合各Agent分析结论，输出完整策略方案' },
    { name: '等待用户确认', agent: '用户', description: '策略方案已生成，等待用户审核确认后执行' },
  ];

  const progressSteps: ProgressStep[] = detail?.progressSteps
    ? detail.progressSteps
    : task?.status === 'pending_confirm'
      ? defaultPendingSteps
      : defaultOtherSteps;

  const toggleStep = (idx: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  // 根据 currentStep 计算每个步骤的状态
  const getStepStatus = (index: number): 'done' | 'active' | 'pending' => {
    if (index < currentStep) return 'done';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  // 新任务消息渐进揭示动画
  useEffect(() => {
    // 清理旧定时器
    revealTimerRef.current.forEach(t => clearTimeout(t));
    revealTimerRef.current = [];
  
    // 使用 shouldAnimate 标识判断是否启用动画
    if (shouldAnimate && filteredMessages.length > 1) {
      setIsRevealing(true);
      setVisibleCount(1); // 先显示用户消息
      setCurrentStep(0); // 动画模式从第0步开始
      // 设置第一个即将出现的 Agent 名称
      if (filteredMessages.length > 1) {
        setNextAgentName(filteredMessages[1].roleName || '章鱼Agent');
      }
  
      const timers: ReturnType<typeof setTimeout>[] = [];
      // 根据 Agent 角色设置不同延迟：章鱼Agent 1.2s，专家Agent 1.5s
      let accumulatedDelay = 0;
      // 步骤与消息的映射关系：每2条消息推进一步（调用+回复）
      let stepIndex = 0;
      for (let i = 1; i < filteredMessages.length; i++) {
        const msg = filteredMessages[i];
        const isExpertAgent = msg.roleName !== '章鱼Agent' && msg.role === 'agent';
        const delay = isExpertAgent ? 1500 : 1200;
        accumulatedDelay += delay;
  
        // 在消息出现前设置下一个 Agent 名称（提前 delay 时间显示 typing）
        const currentDelay = accumulatedDelay;
        const capturedStep = stepIndex;
        const t = setTimeout(() => {
          setVisibleCount(i + 1);
          // 同步更新执行进展步骤
          setCurrentStep(capturedStep + 1);
          // 设置下一条消息的 Agent 名称
          if (i < filteredMessages.length - 1) {
            setNextAgentName(filteredMessages[i + 1].roleName || '章鱼Agent');
          }
          // 最后一条消息显示后结束动画
          if (i === filteredMessages.length - 1) {
            setIsRevealing(false);
            setNextAgentName('');
            // 检查最后一条消息是否有"立即执行"action
            const lastMsg = filteredMessages[filteredMessages.length - 1];
            if (lastMsg?.actions?.includes('立即执行')) {
              setPendingExecution(true);
            }
          }
        }, currentDelay);
        timers.push(t);
        // 每条专家Agent消息完成后推进步骤
        if (isExpertAgent || (msg.role === 'agent' && msg.roleName === '章鱼Agent')) {
          stepIndex++;
        }
      }
      revealTimerRef.current = timers;
    } else {
      // 非动画任务，直接显示最终状态（前4步已完成，第5步进行中，后2步待执行）
      setVisibleCount(filteredMessages.length);
      setIsRevealing(false);
      setNextAgentName('');
      setCurrentStep(4); // 第5步（index=4）进行中
    }
  
    return () => {
      revealTimerRef.current.forEach(t => clearTimeout(t));
    };
  }, [task?.id, shouldAnimate]);

  if (!task) {
    return (
      <div className="section-card" style={{ textAlign: 'center', padding: 60 }}>
        <p>任务不存在</p>
        <Button onClick={() => navigate('/tasks')}>返回任务列表</Button>
      </div>
    );
  }

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');

    // 如果处于等待执行确认状态
    if (pendingExecution && task && detail) {
      setPendingExecution(false);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const ts = Date.now();

      // Phase 2：用户确认 + 执行消息
      const executionMessages: ContextMessage[] = [
        {
          id: `msg-${ts}-confirm`,
          time: timeStr,
          role: 'user' as const,
          roleName: '用户',
          content: userMsg,
          category: 'instruction' as const,
        },
        {
          id: `msg-${ts}-exec-1`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '章鱼Agent',
          content: '✅ 收到执行指令！正在为您分发任务...',
          category: 'execution' as const,
        },
        {
          id: `msg-${ts}-exec-2`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '章鱼Agent',
          content: '📋 正在生成子任务并匹配负责人...',
          category: 'execution' as const,
        },
        {
          id: `msg-${ts}-exec-3`,
          time: timeStr,
          role: 'agent' as const,
          roleName: '章鱼Agent',
          content: '✅ 任务分发完成！\n\n已基于策略方案生成子任务并委派给对应负责人：\n\n1️⃣ 子任务已创建并分配\n2️⃣ 钉钉通知已发送给相关同学\n3️⃣ 任务跟踪看板已同步生成\n\n我将持续监控各子任务的执行进展，如有异常会第一时间向您汇报。',
          actions: ['查看子任务', '查看看板'],
          evidence: ['任务分发记录', '钉钉通知记录'],
          category: 'execution' as const,
        },
      ];

      // 更新任务详情数据：追加新消息
      const updatedDetail = {
        ...detail,
        contextMessages: [...detail.contextMessages, ...executionMessages],
      };
      addDynamicTaskDetail(task.id, updatedDetail);

      // 触发 Phase 2 的渐进动画
      const currentCount = visibleCount;
      const totalNew = executionMessages.length;
      setIsRevealing(true);

      const timers: ReturnType<typeof setTimeout>[] = [];
      const phase2Delays = [600, 2200, 3800, 5600];
      for (let i = 0; i < totalNew; i++) {
        const delay = phase2Delays[i] || (phase2Delays[phase2Delays.length - 1] + (i - phase2Delays.length + 1) * 1400);
        const t = setTimeout(() => {
          setVisibleCount(currentCount + i + 1);
          if (i === totalNew - 1) {
            setIsRevealing(false);
          }
        }, delay);
        timers.push(t);
      }
      revealTimerRef.current = timers;
    } else {
      // 非执行指令场景：追加用户消息到对话流
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setAppendedMessages(prev => [...prev, {
        id: `appended-user-${Date.now()}`,
        time: timeStr,
        role: 'user',
        roleName: '用户',
        content: userMsg,
        category: 'instruction'
      }]);
      
      // 模拟AI回复（1秒后）
      setTimeout(() => {
        const replyTime = new Date();
        const replyTimeStr = `${replyTime.getHours().toString().padStart(2, '0')}:${replyTime.getMinutes().toString().padStart(2, '0')}`;
        setAppendedMessages(prev => [...prev, {
          id: `appended-reply-${Date.now()}`,
          time: replyTimeStr,
          role: 'agent',
          roleName: '章鱼Agent',
          content: '收到你的反馈！我已记录执行结果，并将同步给上游任务负责人。如果后续有变化随时告诉我。',
          category: 'judgment'
        }]);
      }, 1000);
    }
  };

  // 策略上下文数据
  const strategyContext: StrategyContext | undefined = detail?.strategyContext;

  // Agent协商消息列表
  const agentNegotiationMessages = [
    { agent: '章鱼 Agent', emoji: '🐙', content: '收到，正在分解任务并协调各专业Agent...' },
    { agent: '数据分析Agent', emoji: '📊', content: '已接收任务，开始进行数据筛选和分析...' },
    { agent: '运营Agent', emoji: '📝', content: '已就绪，等待数据分析结果后启动运营策略...' },
    { agent: '章鱼 Agent', emoji: '🐙', content: '各Agent已就位，任务开始执行。你可以在右侧“执行进展”中查看实时进度。' },
  ];

  // 点击“执行”按钮后的处理
  const handleStrategyExecute = () => {
    setExecutionPhase('executing');
    setVisibleAgentMessages(0);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setVisibleAgentMessages(count);
      if (count >= agentNegotiationMessages.length) {
        clearInterval(timer);
        agentTimerRef.current = null;
        setTimeout(() => {
          setExecutionPhase('completed');
        }, 600);
      }
    }, 800);
    agentTimerRef.current = timer;
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (agentTimerRef.current) {
        clearInterval(agentTimerRef.current);
      }
    };
  }, []);

  // 构建完整血缘图数据
  const allTasks = [...Object.values(mockTasks).flat(), ...dynamicTasks];

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
    let rootTask = task;
    let parentTask = allTasks.find(t => t.children?.includes(rootTask!.id));
    while (parentTask) {
      rootTask = parentTask;
      parentTask = allTasks.find(t => t.children?.includes(rootTask!.id));
    }

    const tierMap: Record<number, string> = {
      0: '焦进 · 宏观',
      1: '焦进D · 中观',
      2: '一线小二 · 微观',
    };

    const tierShortMap: Record<number, string> = {
      0: '焦进',
      1: '焦进D',
      2: '一线小二',
    };

    const buildNode = (t: typeof task, depth: number = 0): TreeNode => {
      const childTasks = (t!.children || [])
        .map(cid => allTasks.find(at => at.id === cid))
        .filter(Boolean);

      const statusLabelMap: Record<string, string> = {
        todo: '待执行', inprogress: '进行中', done: '已完成', running: '进行中', failed: '失败',
      };

      return {
        id: t!.id,
        title: t!.title,
        owner: t!.delegator || user.name,
        status: t!.status,
        statusLabel: statusLabelMap[t!.status] || t!.status,
        isCurrent: t!.id === id,
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
      {/* 节点本体 */}
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
        {/* 节点层级标签 */}
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

      {/* 子节点和连接线 */}
      {node.children.length > 0 && (
        <>
          {/* 主干连接线 */}
          <div className="lt-trunk-line" />
          {/* 分支横线（多个子节点时） */}
          {node.children.length > 1 && <div className="lt-branch-bar" />}
          <div className="lt-children">
            {node.children.map((child, idx) => (
              <div className="lt-child-branch" key={child.id}>
                {/* 每个子分支的短竖线 */}
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

  return (
    <div className="td-page-wrapper fade-in">
      {/* 左侧任务列表侧栏 */}
      <div className={`td-sidebar ${leftPanelCollapsed ? 'td-sidebar-collapsed' : ''}`}>
        {/* 左侧面板收起/展开按钮 */}
        <button
          className="td-left-toggle-btn"
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          title={leftPanelCollapsed ? '展开面板' : '收起面板'}
        >
          {leftPanelCollapsed ? '»' : '«'}
        </button>
        <div className="td-sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="td-sidebar-header">
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
              当前任务({allTasksList.filter(t => t.status === 'inprogress' || t.status === 'in_progress' || t.status === 'pending_confirm' || t.status === 'failed').length})
            </button>
            <button
              className={`aw-filter-btn ${taskFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTaskFilter('all')}
            >
              全部({allTasksList.length})
            </button>
          </div>
          <div className="aw-task-list" style={{ flex: 1, overflowY: 'auto' }}>
            {(() => {
              const aiTasks = filteredTaskList.filter(t => t.source === 'strategy' || t.source === 'delegated');
              const userTasks = filteredTaskList.filter(t => t.source !== 'strategy' && t.source !== 'delegated');

              const renderTaskItem = (t: typeof filteredTaskList[0]) => (
                <div
                  key={t.id}
                  className={`aw-task-item ${t.id === id ? 'active' : ''}`}
                  onClick={() => navigate(`/task/${t.id}`)}
                >
                  <div className="aw-task-item-header">
                    <span className="aw-task-title">{t.title}</span>
                    {t.source === 'delegated' && (
                      <span style={{ fontSize: 11, lineHeight: '16px', background: '#EFF6FF', color: '#3B82F6', borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap', marginLeft: 4 }}>被委派</span>
                    )}
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
              onClick={() => navigate('/')}
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
      </div>

      {/* 右侧任务详情主区域 */}
      <div className="td-main-content">
      {/* 紧凑头部区域 */}
      <div className="td-header">
        <div className="td-header-title" style={{ display: 'flex', alignItems: 'center' }}>
          <span
            onClick={() => navigate('/')}
            style={{ fontSize: 18, color: '#6B7280', cursor: 'pointer', marginRight: 8, lineHeight: 1 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#10B981')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
          >←</span>
          <h1>{task.title}</h1>
          {detail?.isFullAuto && (
            <Tag color="blue" icon={<RobotOutlined />} style={{ marginLeft: 8, flexShrink: 0 }}>AI全托管</Tag>
          )}
          <button
            className={`global-artifact-trigger task-artifact-trigger ${artifactPanel.isOpen ? 'active' : ''}`}
            onClick={toggleArtifactPanel}
            title="工件面板"
            style={{ marginLeft: 'auto', flexShrink: 0 }}
          >
            <span className="artifact-trigger-icon">⊟</span>
            {taskArtifacts.length > 0 && (
              <span className="artifact-trigger-badge">{taskArtifacts.length}</span>
            )}
          </button>
        </div>
        <div className="td-header-meta">
          <Tag color={statusMap[task.status]?.color} style={{ marginRight: 0 }}>{statusMap[task.status]?.label}</Tag>
          {task.source === 'delegated' && (
            <>
              <span className="td-meta-divider" />
              <span style={{ fontSize: 12, lineHeight: '18px', background: '#EFF6FF', color: '#3B82F6', borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap' }}>被委派</span>
              {task.delegator && (
                <>
                  <span className="td-meta-divider" />
                  <span style={{ fontSize: 13, color: '#6B7280' }}>委派人：{task.delegator}</span>
                </>
              )}
            </>
          )}
          <span className="td-meta-divider" />
          <span><ClockCircleOutlined style={{ marginRight: 4 }} />{task.createTime}</span>
          {task.children && (
            <><span className="td-meta-divider" /><span><TeamOutlined style={{ marginRight: 4 }} />子任务 {task.children.length} 个</span></>
          )}
        </div>
      </div>

      {/* 双栏布局 */}
      <div className="task-detail-layout">
        {/* 左侧 - Chatbot 上下文面板 */}
        <div className="task-detail-info">
          <div className="context-panel">

            {/* 消息列表 */}
            <div className="context-messages">
              {strategyContext && executionPhase !== 'completed' ? (
                /* 策略上下文交互流程 */
                <>
                  {/* 策略确认消息卡片 */}
                  <div className="context-msg agent fade-in">
                    <div className="context-msg-row">
                      <div className="context-msg-avatar octopus-avatar">🐙</div>
                      <div className="context-msg-body">
                        <div className="context-msg-meta">
                          <span className="context-msg-name">章鱼 Agent</span>
                          <span className="context-msg-time">09:30</span>
                        </div>
                        <div className="context-msg-bubble">
                          <div style={{
                            background: '#fff',
                            borderRadius: 8,
                            padding: 16,
                          }}>
                            {(() => {
                              const detailData: StrategyDetailData | undefined = strategyContext.detailKey ? mockStrategyDetails[strategyContext.detailKey] : undefined;
                              if (detailData) {
                                // 丰富展示模式
                                return (
                                  <>
                                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#1F2937' }}>
                                      💡 AI策略建议 - {strategyContext.title}
                                    </div>

                                    {/* 问题归因（前2个section） */}
                                    <div style={{ marginBottom: 14 }}>
                                      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ width: 4, height: 14, background: '#F59E0B', borderRadius: 2, display: 'inline-block' }} />
                                        问题归因
                                      </div>
                                      {detailData.problemSections.slice(0, 2).map((section, sIdx) => (
                                        <div key={sIdx} style={{ marginBottom: sIdx < 1 ? 12 : 0, paddingLeft: 10 }}>
                                          <div style={{ fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 4 }}>{section.title}</div>
                                          {section.summary && (
                                            <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginBottom: 6 }}>{section.summary}</div>
                                          )}
                                          {section.highlights && section.highlights.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                                              {section.highlights.map((h, hIdx) => (
                                                <span key={hIdx} style={{
                                                  background: '#F3F4F6',
                                                  borderRadius: 4,
                                                  padding: '3px 8px',
                                                  fontSize: 11,
                                                  color: '#4B5563',
                                                  display: 'inline-flex',
                                                  alignItems: 'center',
                                                  gap: 4,
                                                }}>
                                                  {h.label}: <strong style={{ color: h.trend === 'down' ? '#DC2626' : h.trend === 'up' ? '#059669' : '#374151' }}>{h.value}</strong>
                                                  {h.delta && <span style={{ fontSize: 10, color: h.trend === 'down' ? '#DC2626' : '#059669' }}>{h.trend === 'down' ? '↓' : '↑'}{h.delta}</span>}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                          {section.items && section.items.length > 0 && (
                                            <div style={{ paddingLeft: 4 }}>
                                              {section.items.map((item, iIdx) => (
                                                <div key={iIdx} style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.7, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                                  <span style={{ color: '#9CA3AF', flexShrink: 0, marginTop: 2 }}>•</span>
                                                  <span><strong style={{ color: '#374151' }}>{item.label}</strong>：{item.desc}</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                          {section.table && (
                                            <div style={{ marginTop: 4, fontSize: 11, color: '#6B7280' }}>
                                              <a href="#" onClick={e => e.preventDefault()} style={{ color: '#00B578', textDecoration: 'none' }}>查看完整数据 &gt;</a>
                                            </div>
                                          )}
                                          {sIdx < 1 && <div style={{ borderBottom: '1px dashed #E5E7EB', marginTop: 10 }} />}
                                        </div>
                                      ))}
                                    </div>

                                    {/* 策略方案 */}
                                    <div style={{ marginBottom: 12 }}>
                                      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ width: 4, height: 14, background: '#00B578', borderRadius: 2, display: 'inline-block' }} />
                                        策略方案
                                      </div>
                                      {detailData.strategySections.map((section, sIdx) => (
                                        <div key={sIdx} style={{ marginBottom: 8, paddingLeft: 10 }}>
                                          <div style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>{section.title}</div>
                                          {section.items && section.items.length > 0 && (
                                            <div>
                                              {section.items.map((item, iIdx) => (
                                                <div key={iIdx} style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.7, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                                  <span style={{ color: '#9CA3AF', flexShrink: 0, marginTop: 2 }}>•</span>
                                                  <span><strong style={{ color: '#374151' }}>{item.label}</strong>：{item.desc}</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                  </>
                                );
                              } else {
                                // 简单展示模式（兼容旧数据）
                                return (
                                  <>
                                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: '#1F2937' }}>
                                      💡 AI策略建议
                                    </div>
                                    <div style={{ marginBottom: 10 }}>
                                      <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>问题归因</div>
                                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{strategyContext.cause}</div>
                                    </div>
                                    <div style={{ marginBottom: 12 }}>
                                      <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>策略方案</div>
                                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{strategyContext.solution}</div>
                                    </div>
                                  </>
                                );
                              }
                            })()}
                          </div>
                          {/* 提示文字 */}
                          <div style={{ marginTop: 10, color: '#374151', fontSize: 14, lineHeight: 1.6 }}>
                            请选择你的操作：
                          </div>
                          {/* 策略操作列表选项 */}
                          {executionPhase === 'pending_confirm' && (() => {
                            const strategyOptions = [
                              { id: 1, title: '确认执行', desc: '协调各Agent按照当前策略方案开始执行' },
                              { id: 2, title: '拒绝执行', desc: '不执行该策略' },
                              { id: 3, title: '调整方案（请说明）', desc: '' },
                            ];
                            return (
                              <div style={{ marginTop: 12 }}>
                                {strategyOptions.map(opt => (
                                  <div key={opt.id}>
                                    <div
                                      onClick={() => {
                                        setSelectedOption(opt.id);
                                        if (opt.id === 1) handleStrategyExecute();
                                        if (opt.id === 2) setExecutionPhase('rejected');
                                        if (opt.id === 3) setTimeout(() => inlineInputRef.current?.focus(), 100);
                                      }}
                                      onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; }}
                                      onMouseLeave={e => { if (selectedOption !== opt.id) e.currentTarget.style.background = 'transparent'; }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 8,
                                        padding: '6px 8px',
                                        marginBottom: opt.id < 3 ? 8 : 0,
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        background: selectedOption === opt.id ? '#F9FAFB' : 'transparent',
                                      }}
                                    >
                                      {/* 序号圆角方形 */}
                                      <div style={{
                                        width: 24,
                                        height: 24,
                                        minWidth: 24,
                                        borderRadius: 6,
                                        border: selectedOption === opt.id ? 'none' : '1px solid #D1D5DB',
                                        background: selectedOption === opt.id ? '#00B578' : '#fff',
                                        color: selectedOption === opt.id ? '#fff' : '#6B7280',
                                        fontSize: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 500,
                                        flexShrink: 0,
                                      }}>
                                        {opt.id}
                                      </div>
                                      {/* 标题+描述 */}
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13, color: '#1F2937' }}>{opt.title}</div>
                                        {opt.desc && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{opt.desc}</div>}
                                      </div>
                                    </div>
                                    {/* 第3项选中后的内联输入框 */}
                                    {opt.id === 3 && selectedOption === 3 && (
                                      <div style={{ marginTop: 8, marginLeft: 40, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input
                                          ref={inlineInputRef}
                                          value={inlineAdjustInput}
                                          onChange={e => setInlineAdjustInput(e.target.value)}
                                          onFocus={e => { e.currentTarget.style.borderColor = '#00B578'; }}
                                          onBlur={e => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
                                          onKeyDown={e => {
                                            if (e.key === 'Enter' && inlineAdjustInput.trim()) {
                                              e.preventDefault();
                                              setChatInput(inlineAdjustInput.trim());
                                              setInlineAdjustInput('');
                                              setSelectedOption(null);
                                              setExecutionPhase('executing');
                                              setVisibleAgentMessages(0);
                                              let count = 0;
                                              const timer = setInterval(() => {
                                                count++;
                                                setVisibleAgentMessages(count);
                                                if (count >= agentNegotiationMessages.length) {
                                                  clearInterval(timer);
                                                  setTimeout(() => setExecutionPhase('completed'), 600);
                                                }
                                              }, 800);
                                              agentTimerRef.current = timer;
                                            }
                                          }}
                                          placeholder="请输入你的调整方案..."
                                          style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: 8,
                                            fontSize: 13,
                                            outline: 'none',
                                            color: '#374151',
                                          }}
                                        />
                                        <span
                                          onClick={() => {
                                            if (!inlineAdjustInput.trim()) return;
                                            setChatInput(inlineAdjustInput.trim());
                                            setInlineAdjustInput('');
                                            setSelectedOption(null);
                                            setExecutionPhase('executing');
                                            setVisibleAgentMessages(0);
                                            let count = 0;
                                            const timer = setInterval(() => {
                                              count++;
                                              setVisibleAgentMessages(count);
                                              if (count >= agentNegotiationMessages.length) {
                                                clearInterval(timer);
                                                setTimeout(() => setExecutionPhase('completed'), 600);
                                              }
                                            }, 800);
                                            agentTimerRef.current = timer;
                                          }}
                                          style={{
                                            color: '#00B578',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            userSelect: 'none',
                                          }}
                                        >
                                          发送
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                          {executionPhase === 'executing' && visibleAgentMessages === 0 && (
                            <div style={{ marginTop: 12, fontSize: 13, color: '#00B578', fontWeight: 500 }}>
                              正在协调执行...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent协商消息 */}
                  {executionPhase === 'executing' && agentNegotiationMessages.slice(0, visibleAgentMessages).map((msg, idx) => (
                    <div key={idx} className="context-msg agent fade-in" style={{ animation: 'fadeIn 0.4s ease' }}>
                      <div className="context-msg-row">
                        <div className={`context-msg-avatar ${msg.agent.includes('章鱼') ? 'octopus-avatar' : 'expert-avatar'} ${msg.agent === '数据分析Agent' ? 'expert-data' : msg.agent === '运营Agent' ? 'expert-category' : ''}`}>
                          {msg.emoji}
                        </div>
                        <div className="context-msg-body">
                          <div className="context-msg-meta">
                            <span className="context-msg-name">{msg.agent}</span>
                          </div>
                          <div className="context-msg-bubble">
                            <div className="context-msg-content">{msg.content}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 执行中的typing指示器 */}
                  {executionPhase === 'executing' && visibleAgentMessages < agentNegotiationMessages.length && (
                    <div className="ctx-typing-indicator">
                      <div className="ctx-typing-avatar">
                        {agentNegotiationMessages[visibleAgentMessages]?.emoji || '🐙'}
                      </div>
                      <div className="ctx-typing-bubble">
                        <span className="ctx-typing-agent-name">{agentNegotiationMessages[visibleAgentMessages]?.agent || '章鱼 Agent'} 正在输出...</span>
                        <span className="ctx-typing-dot" />
                        <span className="ctx-typing-dot" />
                        <span className="ctx-typing-dot" />
                      </div>
                    </div>
                  )}

                  {/* 拒绝执行提示 */}
                  {executionPhase === 'rejected' && (
                    <div className="context-msg agent fade-in" style={{ animation: 'fadeIn 0.4s ease' }}>
                      <div className="context-msg-row">
                        <div className="context-msg-avatar octopus-avatar">🐙</div>
                        <div className="context-msg-body">
                          <div className="context-msg-meta">
                            <span className="context-msg-name">章鱼 Agent</span>
                          </div>
                          <div className="context-msg-bubble">
                            <div style={{ fontSize: 13, color: '#9CA3AF', padding: '8px 0' }}>
                              已拒绝该策略
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : filteredMessages.length === 0 && !strategyContext ? (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <p>暂无上下文消息</p>
                </div>
              ) : (
                <>
                  {filteredMessages.slice(0, visibleCount).map((msg, idx) => (
                    <div key={msg.id} className={`context-msg ${msg.role} ${isRevealing && idx === visibleCount - 1 ? 'ctx-msg-reveal' : ''}`}>
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
                            {msg.htmlReport && (
                              <div
                                className="context-msg-html-report"
                                onClick={() => {
                                  openArtifact({
                                    type: 'html',
                                    title: msg.htmlReport!.title,
                                    payload: {
                                      html: msg.htmlReport!.htmlContent,
                                      fileName: msg.htmlReport!.fileName,
                                      summary: msg.htmlReport!.summary,
                                      createdAt: msg.htmlReport!.createdAt,
                                    },
                                    isReadonly: true,
                                    sourcePageId: task.id,
                                  });
                                }}
                                style={{
                                  marginTop: 10,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  padding: '12px 14px',
                                  background: '#fff',
                                  border: '1px solid #E5E7EB',
                                  borderRadius: 10,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.borderColor = '#00B578';
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,181,120,0.12)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.borderColor = '#E5E7EB';
                                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                                }}
                              >
                                <div style={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: 8,
                                  background: 'linear-gradient(135deg, #00B578 0%, #00A56C 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 18,
                                  flexShrink: 0,
                                }}>📄</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {msg.htmlReport.fileName}
                                  </div>
                                  <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                    {msg.htmlReport.summary && <span>{msg.htmlReport.summary}</span>}
                                    {msg.htmlReport.summary && <span style={{ color: '#D1D5DB' }}>·</span>}
                                    <span>HTML 报告</span>
                                  </div>
                                </div>
                                <div style={{ fontSize: 12, color: '#00B578', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                  点击预览 →
                                </div>
                              </div>
                            )}
                            {msg.actions && msg.actions.length > 0 && (
                              msg.actions.includes('立即执行') ? (
                                /* 列表式选项风格（与策略选项一致） */
                                <div style={{ marginTop: 10 }}>
                                  <div style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                                    请选择你的操作：
                                  </div>
                                  {executionPhase === 'pending_confirm' && (() => {
                                    const taskOptions = [
                                      { id: 1, title: '确认执行', desc: '协调各Agent按照当前策略方案开始执行' },
                                      { id: 2, title: '暂不执行', desc: '不执行该策略' },
                                      { id: 3, title: '调整方案（请说明）', desc: '' },
                                    ];
                                    return (
                                      <div>
                                        {taskOptions.map(opt => (
                                          <div key={opt.id}>
                                            <div
                                              onClick={() => {
                                                setSelectedOption(opt.id);
                                                if (opt.id === 1) handleStrategyExecute();
                                                if (opt.id === 2) setExecutionPhase('rejected');
                                                if (opt.id === 3) setTimeout(() => inlineInputRef.current?.focus(), 100);
                                              }}
                                              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; }}
                                              onMouseLeave={e => { if (selectedOption !== opt.id) e.currentTarget.style.background = 'transparent'; }}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 8,
                                                padding: '6px 8px',
                                                marginBottom: opt.id < 3 ? 8 : 0,
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                                background: selectedOption === opt.id ? '#F9FAFB' : 'transparent',
                                              }}
                                            >
                                              {/* 序号圆角方形 */}
                                              <div style={{
                                                width: 24,
                                                height: 24,
                                                minWidth: 24,
                                                borderRadius: 6,
                                                border: selectedOption === opt.id ? 'none' : '1px solid #D1D5DB',
                                                background: selectedOption === opt.id ? '#00B578' : '#fff',
                                                color: selectedOption === opt.id ? '#fff' : '#6B7280',
                                                fontSize: 12,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 500,
                                                flexShrink: 0,
                                              }}>
                                                {opt.id}
                                              </div>
                                              {/* 标题+描述 */}
                                              <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, fontSize: 13, color: '#1F2937' }}>{opt.title}</div>
                                                {opt.desc && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{opt.desc}</div>}
                                              </div>
                                            </div>
                                            {/* 第3项选中后的内联输入框 */}
                                            {opt.id === 3 && selectedOption === 3 && (
                                              <div style={{ marginTop: 8, marginLeft: 40, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <input
                                                  ref={inlineInputRef}
                                                  value={inlineAdjustInput}
                                                  onChange={e => setInlineAdjustInput(e.target.value)}
                                                  onFocus={e => { e.currentTarget.style.borderColor = '#00B578'; }}
                                                  onBlur={e => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
                                                  onKeyDown={e => {
                                                    if (e.key === 'Enter' && inlineAdjustInput.trim()) {
                                                      e.preventDefault();
                                                      setChatInput(inlineAdjustInput.trim());
                                                      setInlineAdjustInput('');
                                                      setSelectedOption(null);
                                                      setExecutionPhase('executing');
                                                      setVisibleAgentMessages(0);
                                                      let count = 0;
                                                      const timer = setInterval(() => {
                                                        count++;
                                                        setVisibleAgentMessages(count);
                                                        if (count >= agentNegotiationMessages.length) {
                                                          clearInterval(timer);
                                                          setTimeout(() => setExecutionPhase('completed'), 600);
                                                        }
                                                      }, 800);
                                                      agentTimerRef.current = timer;
                                                    }
                                                  }}
                                                  placeholder="请输入你的调整方案..."
                                                  style={{
                                                    flex: 1,
                                                    padding: '8px 12px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: 8,
                                                    fontSize: 13,
                                                    outline: 'none',
                                                    color: '#374151',
                                                  }}
                                                />
                                                <span
                                                  onClick={() => {
                                                    if (!inlineAdjustInput.trim()) return;
                                                    setChatInput(inlineAdjustInput.trim());
                                                    setInlineAdjustInput('');
                                                    setSelectedOption(null);
                                                    setExecutionPhase('executing');
                                                    setVisibleAgentMessages(0);
                                                    let count = 0;
                                                    const timer = setInterval(() => {
                                                      count++;
                                                      setVisibleAgentMessages(count);
                                                      if (count >= agentNegotiationMessages.length) {
                                                        clearInterval(timer);
                                                        setTimeout(() => setExecutionPhase('completed'), 600);
                                                      }
                                                    }, 800);
                                                    agentTimerRef.current = timer;
                                                  }}
                                                  style={{
                                                    color: '#00B578',
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    userSelect: 'none',
                                                  }}
                                                >
                                                  发送
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  })()}
                                  {executionPhase === 'rejected' && (
                                    <div style={{ fontSize: 13, color: '#9CA3AF', padding: '8px 0' }}>
                                      已暂不执行
                                    </div>
                                  )}
                                  {executionPhase === 'executing' && visibleAgentMessages === 0 && (
                                    <div style={{ marginTop: 12, fontSize: 13, color: '#00B578', fontWeight: 500 }}>
                                      正在协调执行...
                                    </div>
                                  )}
                                </div>
                              ) : msg.actions.includes('确认收到') ? (
                                <div style={{ marginTop: 12 }}>
                                  {!taskConfirmed ? (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                      <button
                                        style={{ padding: '8px 20px', background: '#00B578', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
                                        onClick={handleConfirmReceived}
                                      >
                                        确认收到
                                      </button>
                                      <button
                                        style={{ padding: '8px 20px', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
                                      >
                                        有疑问
                                      </button>
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: 13, color: '#00B578', fontWeight: 500 }}>
                                      ✅ 已确认收到，任务开始执行
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="context-msg-actions">
                                  {msg.actions.map(action => (
                                    <button 
                                      key={action} 
                                      className="context-msg-action"
                                      onClick={() => {
                                        if (action === '派发任务') {
                                          openArtifact({
                                            type: 'task-dispatch',
                                            title: '任务派发',
                                            payload: {
                                              tasks: [{
                                                id: String(Date.now()),
                                                channels: [],
                                                receivers: [],
                                                description: '',
                                                target: '',
                                                deadline: '',
                                                priority: 'medium',
                                                difficulty: 'medium'
                                              }]
                                            },
                                            isReadonly: false,
                                            sourcePageId: task.id,
                                          });
                                        }
                                      }}
                                    >
                                      {action}
                                    </button>
                                  ))}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* 非策略场景下的Agent协商消息 */}
                  {!strategyContext && executionPhase === 'executing' && agentNegotiationMessages.slice(0, visibleAgentMessages).map((msg, idx) => (
                    <div key={idx} className="context-msg agent fade-in" style={{ animation: 'fadeIn 0.4s ease' }}>
                      <div className="context-msg-row">
                        <div className={`context-msg-avatar ${msg.agent.includes('章鱼') ? 'octopus-avatar' : 'expert-avatar'} ${msg.agent === '数据分析Agent' ? 'expert-data' : msg.agent === '运营Agent' ? 'expert-category' : ''}`}>
                          {msg.emoji}
                        </div>
                        <div className="context-msg-body">
                          <div className="context-msg-meta">
                            <span className="context-msg-name">{msg.agent}</span>
                          </div>
                          <div className="context-msg-bubble">
                            <div className="context-msg-content">{msg.content}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* 非策略场景下的执行中typing指示器 */}
                  {!strategyContext && executionPhase === 'executing' && visibleAgentMessages < agentNegotiationMessages.length && (
                    <div className="ctx-typing-indicator">
                      <div className="ctx-typing-avatar">
                        {agentNegotiationMessages[visibleAgentMessages]?.emoji || '🐙'}
                      </div>
                      <div className="ctx-typing-bubble">
                        <span className="ctx-typing-agent-name">{agentNegotiationMessages[visibleAgentMessages]?.agent || '章鱼 Agent'} 正在输出...</span>
                        <span className="ctx-typing-dot" />
                        <span className="ctx-typing-dot" />
                        <span className="ctx-typing-dot" />
                      </div>
                    </div>
                  )}
                  {isRevealing && (
                    <div className="ctx-typing-indicator">
                      <div className={`ctx-typing-avatar ${nextAgentName === '数据分析Agent' ? 'expert-data' : nextAgentName === '品类运营Agent' ? 'expert-category' : nextAgentName === '招商Agent' ? 'expert-merchant' : nextAgentName === '渠道分析Agent' ? 'expert-channel' : nextAgentName === '投流Agent' ? 'expert-invest' : ''}`}>
                        {nextAgentName === '章鱼Agent' ? '🐙' : nextAgentName === '数据分析Agent' ? '📊' : nextAgentName === '品类运营Agent' ? '🏷️' : nextAgentName === '招商Agent' ? '🤝' : nextAgentName === '渠道分析Agent' ? '📈' : nextAgentName === '投流Agent' ? '💰' : '🐙'}
                      </div>
                      <div className="ctx-typing-bubble">
                        <span className="ctx-typing-agent-name">{nextAgentName || '章鱼Agent'} 正在输出...</span>
                        <span className="ctx-typing-dot" />
                        <span className="ctx-typing-dot" />
                        <span className="ctx-typing-dot" />
                      </div>
                    </div>
                  )}
                  {/* 追加的对话消息（确认收到后 & 用户发送） */}
                  {appendedMessages.map((msg) => (
                    <div key={msg.id} className={`context-msg ${msg.role}`}>
                      <div className="context-msg-row">
                        <div className={`context-msg-avatar ${msg.role === 'user' ? 'user-avatar' : 'octopus-avatar'}`}>
                          {msg.role === 'user' ? <UserOutlined /> : '🐙'}
                        </div>
                        <div className="context-msg-body">
                          <div className="context-msg-meta">
                            <span className="context-msg-name">{msg.roleName}</span>
                            <span className="context-msg-time">{msg.time}</span>
                          </div>
                          <div className="context-msg-bubble">
                            <div className="context-msg-content">{msg.content}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div ref={msgEndRef} />
            </div>

            {/* 底部输入框 - AI托管任务不渲染 */}
            {!isAutoManaged && (
              <>
                <div className="context-input-area">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                    placeholder={isRevealing ? 'AI 正在分析中，请稍候...' : pendingExecution ? '输入"执行"开始执行策略...' : '围绕当前任务继续问章鱼...'}
                    disabled={isRevealing}
                  />
                  <button onClick={handleSend} disabled={isRevealing}><SendOutlined /></button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 右侧 - Tab切换面板 */}
        <div className={`task-detail-chat ${rightPanelCollapsed ? 'td-right-collapsed' : ''}`}>
          {/* 左边缘垂直居中的收起/展开按钮 */}
          <button
            className="td-right-toggle-btn"
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            title={rightPanelCollapsed ? '展开面板' : '收起面板'}
          >
            {rightPanelCollapsed ? '«' : '»'}
          </button>
          {!rightPanelCollapsed && detail ? (
            <div className="summary-panel">
              {/* Tab栏 */}
              <div className="td-right-tab-bar">
                <button className={`td-right-tab-btn ${rightTab === 'progress' ? 'active' : ''}`} onClick={() => setRightTab('progress')}>执行进展</button>
                <button className={`td-right-tab-btn ${rightTab === 'lineage' ? 'active' : ''}`} onClick={() => setRightTab('lineage')}>任务血缘</button>
                <button className={`td-right-tab-btn ${rightTab === 'files' ? 'active' : ''}`} onClick={() => setRightTab('files')}>生成文件</button>
              </div>

              {/* Tab内容区 */}
              <div className="td-right-tab-content">
                {rightTab === 'progress' && (
                  <div className="td-progress-list">
                    {/* 顶部简单进度条 */}
                    {(() => {
                      const totalSteps = progressSteps.length;
                      const completedCount = Math.min(currentStep, totalSteps);
                      return (
                        <div style={{ background: '#F0FDF4', borderRadius: 8, padding: '12px 16px', marginBottom: 12 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#065F46', marginBottom: 8 }}>
                            已完成 {completedCount}/{totalSteps} 步骤
                          </div>
                          <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(completedCount / totalSteps) * 100}%`, background: '#10B981', borderRadius: 3, transition: 'width 0.3s ease' }} />
                          </div>
                        </div>
                      );
                    })()}

                    {progressSteps.map((step, idx) => {
                      const status = getStepStatus(idx);
                      // 模拟每个步骤的时间信息
                      const stepTimes = ['10:21', '10:23', '10:26', '10:30', '10:33', '10:35', '10:37'];
                      const stepDurations = [2, 3, 4, 3, 2, 3, 2];
                      return (
                        <div key={idx} className={`td-progress-step td-progress-step-${status}`}>
                          {idx < progressSteps.length - 1 && (
                            <div className={`td-progress-line td-progress-line-${status === 'done' ? 'done' : status === 'active' ? 'active' : 'pending'}`} />
                          )}
                          <div className={`td-progress-dot td-progress-dot-${status}`}>
                            {status === 'done' && <span className="td-progress-check">✓</span>}
                          </div>
                          <div className="td-progress-content">
                            <div className="td-progress-content-main" onClick={() => step.description && toggleStep(idx)} style={{ cursor: step.description ? 'pointer' : 'default' }}>
                              <span className="td-progress-name">{step.name}</span>
                              {step.description && (
                                <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 4, userSelect: 'none' }}>
                                  {expandedSteps.has(idx) ? '▾' : '▸'}
                                </span>
                              )}
                              <span className="td-progress-agent">{step.agent}</span>
                            </div>
                            {step.description && expandedSteps.has(idx) && (
                              <div style={{
                                marginTop: 4,
                                padding: '6px 8px 6px 12px',
                                fontSize: 12,
                                color: '#6B7280',
                                lineHeight: 1.5,
                                borderLeft: '2px solid #E5E7EB',
                                background: '#F9FAFB',
                                borderRadius: '0 4px 4px 0',
                                animation: 'fadeIn 0.2s ease',
                              }}>
                                {step.description}
                              </div>
                            )}
                            <div className="td-progress-content-sub">
                              {status === 'done' && (
                                <span className="td-progress-time-info">{stepTimes[idx]}完成</span>
                              )}
                              {status === 'active' && (
                                <span className="td-progress-time-info td-progress-running">已执行{stepDurations[idx]}分钟...</span>
                              )}

                            </div>
                          </div>
                        </div>
                      );
                    })}


                  </div>
                )}

                {rightTab === 'lineage' && (
                  <div className="td-lineage-rich">
                    {(!task.children || task.children.length === 0) && (!detail.lineage?.downstream || detail.lineage.downstream.length === 0) ? (
                      <div className="empty-state" style={{ padding: 40, textAlign: 'center' }}>
                        <div className="empty-icon">🔗</div>
                        <p style={{ color: '#9CA3AF', fontSize: 13 }}>暂无子任务血缘</p>
                      </div>
                    ) : (
                      <>
                        <div className="td-lineage-section">
                          <div className="td-lineage-section-title">📤 子任务血缘（{detail.lineage.downstream.length}个）</div>
                          <div className="td-lineage-downstream-list">
                            {detail.lineage.downstream.map(sub => (
                              <div key={sub.id} className="td-lineage-card" style={{ marginBottom: 10, padding: '10px 12px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB', cursor: 'pointer' }} onClick={() => navigate(`/task/${sub.id}`)}>
                                <div className="td-lineage-card-name" style={{ fontWeight: 500, fontSize: 13, marginBottom: 6 }}>{sub.title}</div>
                                <div className="td-lineage-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#6B7280' }}>
                                  <Tag color={lineageStatusColor[sub.status] || 'default'} style={{ fontSize: 10, lineHeight: '18px', padding: '0 6px' }}>{sub.statusLabel}</Tag>
                                  <span>👤 {sub.owner}</span>
                                  {sub.createTime && <span>📅 {sub.createTime}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="file-link" style={{ marginTop: 12 }}>
                          <a href="#" onClick={e => { e.preventDefault(); setLineageModalOpen(true); }}>查看完整血缘图 →</a>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {rightTab === 'files' && (
                  <div className="td-files-rich">
                    <div className="td-files-grid">
                      {detail.generatedFiles.map(file => (
                        <div key={file.id} className="td-file-card">
                          <div className="td-file-card-icon">
                            {fileIconMap[file.type] || <FileTextOutlined style={{ fontSize: 20, color: '#6B7280' }} />}
                          </div>
                          <div className="td-file-card-info">
                            <div className="td-file-card-name">{file.name}</div>
                            <div className="td-file-card-meta">{file.size} · {file.createdAt}</div>
                          </div>
                          <div className="td-file-card-actions">
                            <button className="td-file-action-btn" onClick={() => handleDownload(file.name)} title="下载">
                              <DownloadOutlined />
                            </button>
                            <button className="td-file-action-btn" onClick={() => message.info(`预览：${file.name}`)} title="预览">
                              <EyeOutlined />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="td-files-summary">
                      共 {detail.generatedFiles.length} 个文件，总计 {detail.generatedFiles.reduce((sum, f) => {
                        const num = parseFloat(f.size);
                        const unit = f.size.includes('MB') ? 1 : 0.001;
                        return sum + num * unit;
                      }, 0).toFixed(1)} MB
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : !rightPanelCollapsed ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <div className="empty-icon">📋</div>
              <p>暂无任务摘要数据</p>
            </div>
          ) : null}
        </div>
      </div>
      {/* 执行结果弹窗 */}
      {showResultPopup && (
        <div className="td-result-popup-overlay" onClick={() => setShowResultPopup(false)}>
          <div className="td-result-popup-container" onClick={e => e.stopPropagation()}>
            <div className="td-result-popup-header">
              <span className="td-result-popup-title">执行结果回流</span>
              <span className="td-result-popup-close" onClick={() => setShowResultPopup(false)}>×</span>
            </div>
            <div className="td-result-popup-body">
              <div className="td-result-popup-grid">
                <div className="td-result-popup-item">
                  <div className="td-result-popup-label">爆品出爆率</div>
                  <div className="td-result-popup-value">21.3%<span className="td-result-popup-change up">↑+3.3pp</span></div>
                </div>
                <div className="td-result-popup-item">
                  <div className="td-result-popup-label">爆品数量</div>
                  <div className="td-result-popup-value">823个<span className="td-result-popup-change up">↑+43</span></div>
                </div>
                <div className="td-result-popup-item">
                  <div className="td-result-popup-label">确收GMV</div>
                  <div className="td-result-popup-value">3,892万<span className="td-result-popup-change up">↑+342万</span></div>
                </div>
                <div className="td-result-popup-item">
                  <div className="td-result-popup-label">缺货SKU</div>
                  <div className="td-result-popup-value">5个<span className="td-result-popup-change down">↓-7</span></div>
                </div>
                <div className="td-result-popup-item">
                  <div className="td-result-popup-label">打爆周期</div>
                  <div className="td-result-popup-value">9.2天<span className="td-result-popup-change down">↓-2.8天</span></div>
                </div>
              </div>
              <div className="td-result-popup-footer">
                数据更新时间：2026-04-22 16:00
              </div>
            </div>
          </div>
        </div>
      )}
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
          {/* 图例 */}
          <div className="lt-legend">
            <span className="lt-legend-item"><span className="lt-legend-dot lt-legend-strategy" />策略来源</span>
            <span className="lt-legend-item"><span className="lt-legend-dot lt-legend-current" />当前任务</span>
            <span className="lt-legend-item"><span className="lt-legend-dot lt-legend-normal" />关联任务</span>

          </div>
          {/* 血缘树 */}
          <div className="lt-tree-container">
            {lineageTree ? renderTreeNode(lineageTree) : <div className="lineage-empty">暂无血缘数据</div>}
          </div>
        </div>
      </Modal>
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

          {/* 核心指标概览 */}
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

          {/* 因果链路 */}
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

          {/* 详细数据表格 */}
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

      {/* 工件面板 - 浮层模式 */}
      {artifactPanel.isOpen && !artifactPanel.isFullscreen && <GlobalArtifactPanel pageId={task.id} />}

      {/* 工件面板 - 全屏Modal模式 */}
      {artifactPanel.isFullscreen && (
        <div
          className="gap-fullscreen-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) toggleArtifactFullscreen(); }}
        >
          <div className="gap-fullscreen-modal">
            <div className="gap-fullscreen-header">
              <h3>工件面板</h3>
              <button className="gap-fullscreen-close" onClick={toggleArtifactFullscreen} title="退出全屏">×</button>
            </div>
            <GlobalArtifactPanel isFullscreen pageId={task.id} />
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
