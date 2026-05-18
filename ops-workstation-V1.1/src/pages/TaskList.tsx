import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Input, Select, Space } from 'antd';
import { SearchOutlined, ClockCircleOutlined, RobotOutlined } from '@ant-design/icons';
import { useAppContext } from '../store';
import { mockTasks, type Task } from '../mock/data';

const statusMap: Record<string, { label: string; color: string }> = {
  todo: { label: '待执行', color: 'orange' },
  inprogress: { label: '进行中', color: 'blue' },
  done: { label: '已完成', color: 'green' },
};

const sourceMap: Record<string, string> = {
  delegated: '被委托',
  strategy: '策略生成',
  chatbot: 'Chatbot发起',
  user: '我发起',
};

export default function TaskList() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('current');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [keyword, setKeyword] = useState('');

  const tasks = mockTasks[user.role] || [];

  const filtered = useMemo(() => {
    return tasks
      .filter(t => {
        if (statusFilter === 'current') {
          if (!(t.status === 'inprogress' || t.status === 'in_progress' || t.status === 'pending_confirm' || t.status === 'failed')) return false;
        }
        if (sourceFilter !== 'all' && t.source !== sourceFilter) return false;
        if (keyword && !t.title.includes(keyword)) return false;
        return true;
      })
      .filter(Boolean);
  }, [tasks, statusFilter, sourceFilter, keyword]);

  const columns = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Task) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <a onClick={() => navigate(`/task/${record.id}`)} style={{ fontWeight: 500 }}>{text}</a>
          {record.source === 'delegated' && (
            <span style={{
              fontSize: 12,
              lineHeight: '18px',
              background: '#EFF6FF',
              color: '#3B82F6',
              borderRadius: 4,
              padding: '2px 6px',
              whiteSpace: 'nowrap',
            }}>被委派</span>
          )}
        </span>
      ),
    },
    {
      title: '任务来源',
      dataIndex: 'source',
      key: 'source',
      width: 200,
      render: (source: string, record: Task) => {
        if (source === 'delegated') return <span>{sourceMap[source]}：{record.delegator}</span>;
        if (source === 'strategy') return (
                  <span>
                    {sourceMap[source]}：
                    <a
                      onClick={(e) => { e.stopPropagation(); navigate(`/strategy/${record.strategyId}`); }}
                      style={{ color: 'var(--accent)', fontWeight: 500, cursor: 'pointer' }}
                    >
                      {record.sourceDetail}
                    </a>
                  </span>
                );
        return <span>{sourceMap[source]}</span>;
      },
    },
    {
      title: '类型',
      dataIndex: 'isFullAuto',
      key: 'type',
      width: 120,
      render: (_: boolean | undefined, record: Task) => (
        record.isFullAuto
          ? <Tag icon={<RobotOutlined />} color="blue">AI全托管</Tag>
          : <Tag>人工介入</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (t: string) => <span><ClockCircleOutlined /> {t}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => <Tag color={statusMap[s]?.color}>{statusMap[s]?.label}</Tag>,
    },
  ];

  return (
    <div className="fade-in">
      <div className="section-card">
        <div className="section-header">
          <h2>任务列表</h2>
        </div>

        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
            options={[
              { value: 'current', label: '当前任务' },
              { value: 'all', label: '全部' },
            ]}
          />
          <Select
            value={sourceFilter}
            onChange={setSourceFilter}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: '全部来源' },
              { value: 'user', label: '我发起' },
              { value: 'delegated', label: '被委托' },
              { value: 'strategy', label: '策略生成' },
              { value: 'chatbot', label: 'Chatbot发起' },
            ]}
          />
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索任务名称"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{ childrenColumnName: '__disabled__' }}
          onRow={(record) => ({
            onClick: () => navigate(`/task/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </div>
    </div>
  );
}
