import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tag, Input } from 'antd';
import {
  ArrowLeftOutlined, ThunderboltOutlined, LinkOutlined, ClockCircleOutlined,
  CheckCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, MinusOutlined,
  EditOutlined, RobotOutlined, SendOutlined, CloseOutlined,
} from '@ant-design/icons';
import { mockStrategies, mockStrategyDetails, type StrategyDetailSection } from '../mock/data';
import { useAppContext } from '../store';

const statusLabel: Record<string, string> = { pending: '待采纳', adopted: '已采纳', expired: '已过期' };
const statusColor: Record<string, string> = { pending: 'orange', adopted: 'green', expired: 'default' };

/* 渲染趋势图标 */
function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up') return <ArrowUpOutlined style={{ color: 'var(--success)', fontSize: 11 }} />;
  if (trend === 'down') return <ArrowDownOutlined style={{ color: 'var(--danger)', fontSize: 11 }} />;
  return <MinusOutlined style={{ color: 'var(--muted)', fontSize: 11 }} />;
}

/* 渲染一个 section */
function SectionBlock({ section, index }: { section: StrategyDetailSection; index: number }) {
  return (
    <div className="sd-section" style={{ animationDelay: `${index * 0.08}s` }}>
      <h4 className="sd-section-title">{section.title}</h4>

      {section.summary && <p className="sd-summary">{section.summary}</p>}

      {section.highlights && (
        <div className="sd-highlights">
          {section.highlights.map((h, i) => (
            <div className="sd-highlight-card" key={i}>
              <span className="sd-highlight-label">{h.label}</span>
              <span className="sd-highlight-value">{h.value}</span>
              {h.delta && (
                <span className={`sd-highlight-delta ${h.trend}`}>
                  <TrendIcon trend={h.trend} /> {h.delta}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {section.items && (
        <div className="sd-items">
          {section.items.map((item, i) => (
            <div className="sd-item" key={i}>
              <span className="sd-item-label">{item.label}</span>
              <span className="sd-item-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      )}

      {section.table && (
        <div className="sd-table-wrapper">
          <table className="sd-table">
            <thead>
              <tr>
                {section.table.columns.map((col, i) => <th key={i}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={cell.startsWith('-') ? 'negative' : cell.startsWith('+') ? 'positive' : ''}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
}

export default function StrategyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addDynamicTask, addDynamicTaskDetail } = useAppContext();

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = () => {
    const text = chatInput.trim();
    if (!text || sending) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setSending(true);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}-1`, role: 'agent', content: '已收到修改指令，正在调整策略方案...' },
      ]);
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: `a-${Date.now()}-2`,
            role: 'agent',
            content: `策略已更新，主要调整：根据您的要求「${text}」，已对策略方案进行针对性优化。请确认是否采用新方案。`,
          },
        ]);
        setSending(false);
      }, 2000);
    }, 1500);
  };

  const strategy = mockStrategies.find(s => s.id === id);
  const detail = id ? mockStrategyDetails[id] : undefined;

  if (!strategy) {
    return (
      <div className="section-card" style={{ textAlign: 'center', padding: 60 }}>
        <p>策略不存在</p>
        <Button onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }

  const handleAdopt = () => {
    const taskId = `task-${Date.now()}`;
    addDynamicTask({
      id: taskId,
      title: `执行策略：${strategy.title}`,
      description: `采纳策略「${strategy.title}」并执行，目标：${strategy.strategySummary}`,
      status: 'inprogress',
      source: 'strategy',
      sourceDetail: strategy.title,
      createTime: new Date().toLocaleString(),
      progress: 0,
      strategyId: strategy.id,
    });
    addDynamicTaskDetail(taskId, {
      overview: {
        goal: strategy.strategySummary,
        currentPhase: '任务拆解中',
        nextStep: '委派子任务给对应负责人',
        risk: '资源协调可能存在延迟',
      },
      contextMessages: (() => {
        const timeStr = new Date().toLocaleTimeString();
        return [
          {
            id: `msg-${Date.now()}-1`,
            time: timeStr,
            role: 'user' as const,
            roleName: '用户',
            content: `采纳并执行策略「${strategy.title}」`,
            category: 'instruction' as const,
          },
          {
            id: `msg-${Date.now()}-2`,
            time: timeStr,
            role: 'agent' as const,
            roleName: '章鱼Agent',
            content: `已收到策略执行指令：「${strategy.title}」\n\n正在进行策略拆解和可行性评估...`,
            category: 'judgment' as const,
          },
          {
            id: `msg-${Date.now()}-3`,
            time: timeStr,
            role: 'agent' as const,
            roleName: '章鱼Agent',
            content: '🔍 正在调用「数据分析Agent」验证策略基础数据...',
            category: 'execution' as const,
          },
          {
            id: `msg-${Date.now()}-4`,
            time: timeStr,
            role: 'agent' as const,
            roleName: '数据分析Agent',
            content: '数据验证完成：\n\n• 策略关联指标数据已确认\n• 历史趋势与策略假设一致\n• 执行条件满足',
            evidence: ['指标验证报告', '趋势分析'],
            category: 'execution' as const,
          },
          {
            id: `msg-${Date.now()}-5`,
            time: timeStr,
            role: 'agent' as const,
            roleName: '章鱼Agent',
            content: '🔍 正在调用「品类运营Agent」进行任务拆解...',
            category: 'execution' as const,
          },
          {
            id: `msg-${Date.now()}-6`,
            time: timeStr,
            role: 'agent' as const,
            roleName: '品类运营Agent',
            content: `任务拆解完成：\n\n已根据策略方案「${strategy.strategySummary.substring(0, 30)}...」拆解为多个可执行子任务，并匹配对应负责人。`,
            evidence: ['任务拆解方案'],
            category: 'execution' as const,
          },
          {
            id: `msg-${Date.now()}-7`,
            time: timeStr,
            role: 'agent' as const,
            roleName: '章鱼Agent',
            content: '🔍 正在调用「投流Agent」评估资源投入和预期收益...',
            category: 'execution' as const,
          },
          {
            id: `msg-${Date.now()}-8`,
            time: timeStr,
            role: 'agent' as const,
            roleName: '投流Agent',
            content: '资源评估完成：\n\n• 预计投入资源在可控范围内\n• ROI 预估符合预期\n• 风险等级：低',
            evidence: ['ROI测算', '资源评估'],
            category: 'execution' as const,
          },
          {
            id: `msg-${Date.now()}-9`,
            time: timeStr,
            role: 'agent' as const,
            roleName: '章鱼Agent',
            content: `✅ 所有专家Agent分析已完成，策略「${strategy.title}」的拆解和评估已就绪。\n\n📋 策略摘要：${strategy.strategySummary.substring(0, 60)}...\n\n• 子任务已拆解完成\n• 资源评估通过\n• 负责人已匹配\n\n是否需要我立即执行该策略？`,
            actions: ['立即执行', '调整方案', '暂不执行'],
            category: 'judgment' as const,
          },
        ];
      })(),
      lineage: {
        upstream: [],
        downstream: [],
      },
      generatedFiles: [],
      executionMetrics: [],
      conclusions: {
        mainCause: strategy.problemSummary,
        recommendedAction: strategy.strategySummary,
        pendingConfirmation: '任务拆解确认',
      },
    });
    navigate(`/task/${taskId}`);
  };

  return (
    <div className="detail-page strategy-detail-page fade-in">
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
      </div>

      {/* 头部信息卡 */}
      <div className="sd-header-card">
        <div className="sd-header-top">
          <div>
            <h2 className="sd-title">{strategy.title}</h2>
            <div className="sd-meta">
              <Tag color={statusColor[strategy.status]}>{statusLabel[strategy.status]}</Tag>
              {strategy.isFullAuto && (
                <Tag color="blue" icon={<RobotOutlined />}>AI全托管</Tag>
              )}
              <span className="sd-meta-item"><LinkOutlined /> {strategy.relatedMetric}</span>
              <span className="sd-meta-item"><ClockCircleOutlined /> {strategy.createTime}</span>
            </div>
          </div>
          <div className="sd-header-actions">
            {strategy.status === 'pending' && (
              <>
                <Button
                  size="large"
                  icon={<EditOutlined />}
                  className="strategy-chat-edit-btn"
                  onClick={() => setChatOpen(prev => !prev)}
                >
                  修改策略
                </Button>
                <Button type="primary" size="large" icon={<ThunderboltOutlined />} onClick={handleAdopt}>
                  采纳并执行
                </Button>
              </>
            )}
            {strategy.status === 'adopted' && strategy.isFullAuto && (
              <Button size="large" icon={<RobotOutlined />} type="primary" onClick={() => navigate('/task/t2')}>
                任务详情
              </Button>
            )}
            {strategy.status === 'adopted' && !strategy.isFullAuto && (
              <Button size="large" icon={<CheckCircleOutlined />} onClick={() => navigate('/task/t1')}>
                查看关联任务
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 问题归因 */}
      <div className="sd-block">
        <div className="sd-block-header">
          <span className="sd-block-icon problem">!</span>
          <h3>问题归因</h3>
        </div>
        {detail ? (
          detail.problemSections.map((sec, i) => <SectionBlock section={sec} index={i} key={i} />)
        ) : (
          <div className="sd-fallback">{strategy.problemDetail}</div>
        )}
      </div>

      {/* 策略方案 */}
      <div className="sd-block">
        <div className="sd-block-header">
          <span className="sd-block-icon strategy">✦</span>
          <h3>策略方案</h3>
        </div>
        {detail ? (
          detail.strategySections.map((sec, i) => <SectionBlock section={sec} index={i} key={i} />)
        ) : (
          <div className="sd-fallback">{strategy.strategyDetail}</div>
        )}
      </div>

      {/* 内联对话框 */}
      {chatOpen && (
        <div className="strategy-chat-container">
          <div className="strategy-chat-header">
            <span className="strategy-chat-hint">
              💡 您可以通过对话描述需要修改的内容，章鱼Agent将为您调整策略
            </span>
            <button className="strategy-chat-close" onClick={() => setChatOpen(false)}>
              <CloseOutlined /> 收起
            </button>
          </div>

          <div className="strategy-chat-messages">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`strategy-chat-bubble strategy-chat-bubble-${msg.role}`}>
                <span className="strategy-chat-bubble-name">
                  {msg.role === 'user' ? '我' : '🐙 章鱼Agent'}
                </span>
                <div className="strategy-chat-bubble-content">{msg.content}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="strategy-chat-input-area">
            <Input
              className="strategy-chat-input"
              placeholder="描述您想要修改的内容，如'将补贴力度从15%调整为20%'..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onPressEnter={handleSendChat}
              disabled={sending}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              className="strategy-chat-send-btn"
              onClick={handleSendChat}
              loading={sending}
            >
              发送
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
