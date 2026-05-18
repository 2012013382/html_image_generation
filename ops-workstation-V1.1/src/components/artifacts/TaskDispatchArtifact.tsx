import { useAppContext, type ArtifactItem } from '../../store';

interface DispatchTask {
  id: string;
  channels: string[];
  receivers: string[];
  description: string;
  target: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  difficulty: 'complex' | 'medium' | 'normal';
}

interface Props {
  item: ArtifactItem;
}

const channelOptions = ['百补渠道', '淘客渠道', '直播渠道', '搜索渠道', '内容渠道'];
const receiverOptions = ['昌栗', '尚赞', '小林', '阿杰', '晓晓', '子墨'];
const priorityOptions = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
];
const difficultyOptions = [
  { value: 'complex', label: '复杂' },
  { value: 'medium', label: '中等' },
  { value: 'normal', label: '普通' }
];

export default function TaskDispatchArtifact({ item }: Props) {
  const { updateArtifact, removeArtifact, addChatMessage } = useAppContext();

  const tasks: DispatchTask[] = item.payload?.tasks || [];
  const isReadonly = item.isReadonly;

  const updateTasks = (newTasks: DispatchTask[]) => {
    updateArtifact(item.id, { payload: { ...item.payload, tasks: newTasks } });
  };

  const updateTask = (taskId: string, field: keyof DispatchTask, value: any) => {
    updateTasks(tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t));
  };

  const addChannel = (taskId: string, ch: string) => {
    const t = tasks.find(t => t.id === taskId);
    if (t && !t.channels.includes(ch)) updateTask(taskId, 'channels', [...t.channels, ch]);
  };
  const removeChannel = (taskId: string, ch: string) => {
    const t = tasks.find(t => t.id === taskId);
    if (t) updateTask(taskId, 'channels', t.channels.filter(c => c !== ch));
  };
  const addReceiver = (taskId: string, r: string) => {
    const t = tasks.find(t => t.id === taskId);
    if (t && !t.receivers.includes(r)) updateTask(taskId, 'receivers', [...t.receivers, r]);
  };
  const removeReceiver = (taskId: string, r: string) => {
    const t = tasks.find(t => t.id === taskId);
    if (t) updateTask(taskId, 'receivers', t.receivers.filter(x => x !== r));
  };

  const addTask = () => {
    updateTasks([...tasks, {
      id: String(Date.now()),
      channels: [], receivers: [], description: '', target: '',
      deadline: '', priority: 'medium', difficulty: 'medium'
    }]);
  };

  const removeTask = (taskId: string) => {
    if (tasks.length > 1) updateTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleSubmit = () => {
    updateArtifact(item.id, { isReadonly: true });

    const summary = tasks.map((t, i) =>
      `${i + 1}. ${t.description || '未命名任务'} → ${t.receivers.join('、') || '未指定'}`
    ).join('\n');

    addChatMessage({
      id: `dispatch-${Date.now()}`,
      role: 'assistant',
      content: `已成功派发 ${tasks.length} 个任务：\n${summary}\n\n已通过钉钉通知相关接收人，我会持续跟踪执行进度。`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleCancel = () => {
    removeArtifact(item.id);
  };

  return (
    <div className={`gap-dispatch-form ${isReadonly ? 'gap-dispatch-readonly' : ''}`}>
      {isReadonly && <div className="gap-dispatch-readonly-badge">已派发</div>}

      {tasks.map((task, index) => (
        <div key={task.id} className="gap-dispatch-task-card">
          <div className="gap-dispatch-task-card-header">
            <span>任务 {index + 1}</span>
            {!isReadonly && tasks.length > 1 && (
              <button className="gap-dispatch-task-card-remove" onClick={() => removeTask(task.id)}>删除</button>
            )}
          </div>

          {/* 接收渠道 */}
          <div className="gap-dispatch-form-item">
            <label>任务接收渠道<span className="required">*</span></label>
            {task.channels.length > 0 && (
              <div className="multi-select">
                {task.channels.map(ch => (
                  <span key={ch} className="multi-select-tag">
                    {ch}
                    {!isReadonly && <span className="tag-remove" onClick={() => removeChannel(task.id, ch)}>×</span>}
                  </span>
                ))}
              </div>
            )}
            {!isReadonly && (
              <select value="" onChange={(e) => { if (e.target.value) addChannel(task.id, e.target.value); }}>
                <option value="">+ 选择渠道</option>
                {channelOptions.filter(o => !task.channels.includes(o)).map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            )}
          </div>

          {/* 接收人 */}
          <div className="gap-dispatch-form-item">
            <label>重点任务接收人<span className="required">*</span></label>
            {task.receivers.length > 0 && (
              <div className="multi-select">
                {task.receivers.map(r => (
                  <span key={r} className="multi-select-tag">
                    {r}
                    {!isReadonly && <span className="tag-remove" onClick={() => removeReceiver(task.id, r)}>×</span>}
                  </span>
                ))}
              </div>
            )}
            {!isReadonly && (
              <select value="" onChange={(e) => { if (e.target.value) addReceiver(task.id, e.target.value); }}>
                <option value="">+ 选择接收人</option>
                {receiverOptions.filter(o => !task.receivers.includes(o)).map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            )}
          </div>

          {/* 任务描述 */}
          <div className="gap-dispatch-form-item">
            <label>任务描述<span className="required">*</span></label>
            <textarea
              value={task.description}
              onChange={(e) => updateTask(task.id, 'description', e.target.value)}
              placeholder="请输入任务描述"
              disabled={isReadonly}
            />
          </div>

          {/* 任务目标 */}
          <div className="gap-dispatch-form-item">
            <label>任务目标</label>
            <input
              type="text"
              value={task.target}
              onChange={(e) => updateTask(task.id, 'target', e.target.value)}
              placeholder="GMV、链接数、流量等，仅支持输入数字"
              disabled={isReadonly}
            />
          </div>

          {/* 截止日期 */}
          <div className="gap-dispatch-form-item">
            <label>任务截止日期<span className="required">*</span></label>
            <input
              type="date"
              value={task.deadline}
              onChange={(e) => updateTask(task.id, 'deadline', e.target.value)}
              disabled={isReadonly}
            />
          </div>

          {/* 优先级 */}
          <div className="gap-dispatch-form-item">
            <label>任务优先级<span className="required">*</span></label>
            <select
              value={task.priority}
              onChange={(e) => updateTask(task.id, 'priority', e.target.value)}
              disabled={isReadonly}
            >
              {priorityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* 难度系数 */}
          <div className="gap-dispatch-form-item">
            <label>任务难度系数<span className="required">*</span></label>
            <div className="radio-group">
              {difficultyOptions.map(opt => (
                <label key={opt.value}>
                  <input
                    type="radio"
                    name={`difficulty-${task.id}`}
                    checked={task.difficulty === opt.value}
                    onChange={() => updateTask(task.id, 'difficulty', opt.value)}
                    disabled={isReadonly}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      {!isReadonly && (
        <button className="gap-dispatch-form-add-btn" onClick={addTask}>+ 添加任务</button>
      )}

      {!isReadonly && (
        <div className="gap-dispatch-form-actions">
          <button className="btn-cancel" onClick={handleCancel}>取消</button>
          <button className="btn-submit" onClick={handleSubmit}>确认派发</button>
        </div>
      )}
    </div>
  );
}
