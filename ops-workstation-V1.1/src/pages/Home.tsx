import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Progress, Tag, Empty } from 'antd';
import {
  DashboardOutlined, BulbOutlined, CheckCircleOutlined,
  EyeOutlined, ThunderboltOutlined, LinkOutlined,
  ArrowRightOutlined, ClockCircleOutlined, TeamOutlined,
  AlertOutlined, RiseOutlined, EditOutlined, RobotOutlined,
} from '@ant-design/icons';
import { useAppContext } from '../store';
import { mockPrimaryMetrics, mockStrategies, mockTasks, subManagers, getPrimaryMetricsForManager } from '../mock/data';
import type { Task, TaskDetailData, MetricTimeRange, PrimaryMetric } from '../mock/data';

const statusLabel = { pending: '待采纳', adopted: '已采纳', expired: '已过期' };

export default function Home() {
  const { user, addDynamicTask, addDynamicTaskDetail, setChatbotOpen, setEditingStrategy } = useAppContext();
  const navigate = useNavigate();
  const [strategyTab, setStrategyTab] = useState<'all' | 'pending' | 'adopted' | 'fullAuto' | 'expired'>('pending');
  const [metricTimeRange, setMetricTimeRange] = useState<MetricTimeRange>('MTD');
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const strategySectionRef = useRef<HTMLDivElement>(null);

  const currentRole = user.role;
  const showMetrics = currentRole === 'jiaojin' || currentRole === 'jiaojinD';

  const currentMetrics = currentRole === 'jiaojin' && selectedManager
    ? getPrimaryMetricsForManager(selectedManager)
    : mockPrimaryMetrics;
  const showStrategy = user.role === 'jiaojin' || user.role === 'jiaojinD';

  const showDelegated = user.role === 'jiaojinD' || user.role === 'xiaoer';
  const showTracking = user.role === 'jiaojin' || user.role === 'jiaojinD';

  const [taskTab, setTaskTab] = useState<'delegated' | 'tracking'>(showDelegated ? 'delegated' : 'tracking');

  const tasks = mockTasks[user.role] || [];
  const delegatedTasks = tasks.filter(t => t.source === 'delegated');
  const trackingTasks = tasks.filter(t => t.children && t.children.length > 0);

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

   const handleAdopt = (strategyId: string) => {
    const strategy = mockStrategies.find(s => s.id === strategyId);
    if (!strategy) return;

    const taskId = `t-strategy-${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const createTime = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} ${timeStr}`;

    // 创建新任务
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

    // 创建任务详情
    const newDetail: TaskDetailData = {
      overview: {
        goal: `执行策略：${strategy.title}`,
        currentPhase: '策略拆解中',
        nextStep: '确认任务分配',
        risk: '暂无',
      },
      contextMessages: [
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
    navigate(`/task/${taskId}`);
  };

  const getRateClass = (rate: number) => {
    if (rate >= 90) return 'success';
    if (rate >= 75) return 'warning';
    return 'danger';
  };

  return (
    <div className="fade-in">
      {/* 业务指标 */}
      {showMetrics && (
        <>
          <div className="section-header" style={{ marginBottom: 12 }}>
            <h2><DashboardOutlined /> 业务指标</h2>
            <div className="metric-time-controls">
              <div className="metric-time-switcher">
                {(['MTD', 'T-1', '实时'] as const).map(t => (
                  <button
                    key={t}
                    className={`metric-time-btn ${metricTimeRange === t ? 'active' : ''}`}
                    onClick={() => setMetricTimeRange(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                {metricTimeRange === 'MTD' ? '数据更新至 2026-04-23' : metricTimeRange === 'T-1' ? '2026-04-22 全天' : '实时更新中'}
              </span>
            </div>
          </div>
          <div className="primary-metrics-grid">
            {currentMetrics.map(pm => {
              const d = pm.data[metricTimeRange];
              const strategyCount = getStrategyCountForMetric(pm.id);
              const isExpanded = expandedMetric === pm.id;
              return (
                <div key={pm.id} className="primary-metric-wrapper">
                  <div
                    className={`metric-card ${pm.expandable ? 'expandable' : ''} ${isExpanded ? 'expanded' : ''} ${selectedMetricId === pm.id ? 'metric-selected' : ''}`}
                    onClick={() => handleMetricCardClick(pm)}
                  >
                    <div className="metric-name">
                      {d.achieveRate < 80 ? <AlertOutlined style={{ color: '#DC2626' }} /> : <RiseOutlined style={{ color: '#10B981' }} />}
                      <span className="metric-label-inline">{pm.label}</span>
                      <span className="metric-name-sep">·</span>
                      {pm.metricName}
                      {pm.expandable && (
                        <span className={`metric-expand-icon ${isExpanded ? 'rotated' : ''}`}>▾</span>
                      )}
                    </div>
                    <div className="metric-value">
                      {d.achieved.toLocaleString()}
                      <span style={{ fontSize: 13, color: '#94A3B8', marginLeft: 4 }}>{pm.unit}</span>
                    </div>
                    <div className="metric-bottom-row">
                      <span className="metric-target-inline">{metricTimeRange === 'MTD' ? '月度' : '日均'}目标 {d.target.toLocaleString()}{pm.unit}</span>
                      <span className={`metric-rate-inline ${getRateClass(d.achieveRate)}`}>达成率 {d.achieveRate}%</span>
                    </div>
                    <Progress
                      percent={d.achieveRate}
                      showInfo={false}
                      strokeColor={d.achieveRate >= 90 ? '#10B981' : d.achieveRate >= 75 ? '#F59E0B' : '#DC2626'}
                      size="small"
                      style={{ marginTop: 4 }}
                    />
                    {strategyCount > 0 && (
                      <div
                        className="metric-strategy-badge"
                        onClick={(e) => handleStrategyLink(e, pm.id)}
                      >
                        <BulbOutlined /> {strategyCount}条策略
                      </div>
                    )}
                  </div>
                  {/* 子指标展开区域 */}
                  {isExpanded && pm.subMetrics.length > 0 && (
                    <div className="sub-metrics-panel">
                      {pm.subMetrics.map(sm => {
                        const sd = sm.data[metricTimeRange];
                        return (
                          <div className="sub-metric-item" key={sm.id}>
                            <div className="sub-metric-name">{sm.name}</div>
                            <div className="sub-metric-detail-row">
                              <span className="sub-metric-achieved-value">{sd.achieved.toLocaleString()} {sm.unit}</span>
                              <span className={`sub-metric-yoy ${sd.yoy >= 0 ? 'yoy-up' : 'yoy-down'}`}>
                                {sd.yoy >= 0 ? '↑' : '↓'} 同比 {Math.abs(sd.yoy)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* AI 策略 */}
      {showStrategy && (
        <div className="section-card">
          <div className="section-header" ref={strategySectionRef}>
            <h2><BulbOutlined style={{ color: '#00B578' }} /> AI 策略</h2>
            {selectedMetricId && (
              <div className="strategy-filter-hint">
                <span>筛选：{mockPrimaryMetrics.find(m => m.id === selectedMetricId)?.label} 关联策略</span>
                <button className="strategy-filter-clear" onClick={() => setSelectedMetricId(null)}>✕ 清除</button>
              </div>
            )}
          </div>
          <div className="custom-tabs">
            {(['pending', 'all', 'adopted', 'fullAuto', 'expired'] as const).map(tab => (
              <button
                key={tab}
                className={`custom-tab ${strategyTab === tab ? 'active' : ''}`}
                onClick={() => setStrategyTab(tab)}
              >
                {{ all: '全部', pending: '待采纳', adopted: '已采纳', fullAuto: 'AI全托管', expired: '已过期' }[tab]}
                {tab === 'pending' && ` (${mockStrategies.filter(s => s.status === 'pending').length})`}
                {tab === 'fullAuto' && ` (${mockStrategies.filter(s => s.isFullAuto).length})`}
              </button>
            ))}
          </div>
          <div className="strategy-list">
            {filteredStrategies.length === 0 ? (
              <Empty description="暂无策略" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : filteredStrategies.map(s => (
              <div className="strategy-card" key={s.id}>
                {/* 顶部行：状态标签 + 时间 */}
                <div className="strategy-card-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={`strategy-status-tag ${s.status}`}>{statusLabel[s.status]}</span>
                    {s.isFullAuto && (
                      <span className="strategy-auto-tag">
                        <RobotOutlined /> AI全托管
                      </span>
                    )}
                  </div>
                  <span className="strategy-card-time"><ClockCircleOutlined /> {s.createTime}</span>
                </div>

                {/* 标题 */}
                <div className="strategy-card-title">{s.title}</div>

                {/* 关联指标标签 */}
                <div className="strategy-card-metric">
                  <LinkOutlined /> {s.relatedMetric}
                </div>

                {/* 描述：问题归因 + 策略方案 */}
                <div className="strategy-card-desc">
                  <div className="strategy-desc-item">
                    <span className="strategy-desc-label">问题归因</span>
                    <span className="strategy-desc-text">{s.problemSummary}</span>
                  </div>
                  <div className="strategy-desc-item">
                    <span className="strategy-desc-label">策略方案</span>
                    <span className="strategy-desc-text">{s.strategySummary}</span>
                  </div>
                </div>

                {/* 底部操作栏 */}
                <div className="strategy-card-actions">
                  <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/strategy/${s.id}`)}>
                    详情
                  </Button>
                  {s.status === 'pending' && (
                    <>
                      <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingStrategy(s.title); setChatbotOpen(true); }}>
                        修改
                      </Button>
                      <Button size="small" type="primary" icon={<ThunderboltOutlined />} onClick={() => handleAdopt(s.id)}>
                        采纳并执行
                      </Button>
                    </>
                  )}
                  {s.status === 'adopted' && s.isFullAuto && (
                    <Button size="small" icon={<RobotOutlined />} onClick={() => navigate(`/task/t2`)}>
                      查看执行详情
                    </Button>
                  )}
                  {s.status === 'adopted' && !s.isFullAuto && (
                    <Button size="small" icon={<CheckCircleOutlined />} onClick={() => navigate(`/task/t1`)}>
                      关联任务
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 关键任务 */}
      {(showDelegated || showTracking) && (
        <div className="section-card">
          <div className="section-header">
            <h2><CheckCircleOutlined style={{ color: '#00B578' }} /> {user.role === 'jiaojin' ? '正在追踪' : '关键任务'}</h2>
            <Button type="link" onClick={() => navigate('/tasks')}>查看更多 <ArrowRightOutlined /></Button>
          </div>
          {(showDelegated && showTracking) && (
            <div className="custom-tabs">
              <button className={`custom-tab ${taskTab === 'delegated' ? 'active' : ''}`} onClick={() => setTaskTab('delegated')}>
                被委派 ({delegatedTasks.length})
              </button>
              <button className={`custom-tab ${taskTab === 'tracking' ? 'active' : ''}`} onClick={() => setTaskTab('tracking')}>
                我要追踪 ({trackingTasks.length})
              </button>
            </div>
          )}

          {/* Only one tab for xiaoer */}
          {showDelegated && !showTracking && (
            <div style={{ marginBottom: 12, fontSize: 13, color: '#6B7280' }}>
              <TeamOutlined /> 被委派给我的任务
            </div>
          )}

          <div className="strategy-list">
            {(taskTab === 'delegated' || (!showTracking)) && showDelegated && (
              delegatedTasks.length === 0 ? (
                <Empty description="暂无被委派任务" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : delegatedTasks.map(t => (
                <div className="task-card" key={t.id} onClick={() => navigate(`/task/${t.id}`)}>
                  <div className="task-card-header">
                    <span className="task-card-title">{t.title}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Tag color="blue">被委派</Tag>
                      <span className={`status-tag ${t.status}`}>
                        {{ todo: '待执行', inprogress: '进行中', done: '已完成' }[t.status]}
                      </span>
                    </div>
                  </div>
                  <div className="task-card-desc">{t.description}</div>
                  <div className="task-card-footer">
                    <div className="task-card-meta">
                      <span><TeamOutlined /> {t.delegator}</span>
                      <span><ClockCircleOutlined /> {t.createTime}</span>
                    </div>
                    <Button size="small" type="primary" onClick={(e) => { e.stopPropagation(); navigate(`/task/${t.id}`); }}>去执行 <ArrowRightOutlined /></Button>
                  </div>
                  {t.progress !== undefined && (
                    <Progress percent={t.progress} size="small" style={{ marginTop: 8 }} />
                  )}
                </div>
              ))
            )}

            {taskTab === 'tracking' && showTracking && (
              trackingTasks.length === 0 ? (
                <Empty description="暂无追踪任务" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : trackingTasks.map(t => (
                <div className="task-card" key={t.id} onClick={() => navigate(`/task/${t.id}`)}>
                  <div className="task-card-header">
                    <span className="task-card-title">{t.title}</span>
                    <span className={`status-tag ${t.status}`}>
                      {{ todo: '待执行', inprogress: '进行中', done: '已完成' }[t.status]}
                    </span>
                  </div>
                  <div className="task-card-desc">{t.description}</div>
                  <div className="task-card-footer">
                    <div className="task-card-meta">
                      <span><ClockCircleOutlined /> {t.createTime}</span>
                      <span>子任务：{t.children?.length || 0} 个</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button size="small">详情</Button>
                      <Button size="small" style={{ color: '#00B578', borderColor: '#00B578', background: 'transparent' }}>钉钉催办</Button>
                    </div>
                  </div>
                  {t.progress !== undefined && (
                    <Progress percent={t.progress} size="small" style={{ marginTop: 8 }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
