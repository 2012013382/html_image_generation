import { useAppContext } from '../store';
import TaskDispatchArtifact from './artifacts/TaskDispatchArtifact';
import HtmlArtifact from './artifacts/HtmlArtifact';

interface Props {
  isFullscreen?: boolean;
  pageId?: string;
}

export default function GlobalArtifactPanel({ isFullscreen = false, pageId }: Props) {
  const { artifactPanel, setActiveArtifact, removeArtifact, closeArtifactPanel, toggleArtifactFullscreen } = useAppContext();
  const { activeId } = artifactPanel;

  // 按 pageId 过滤，未传则显示全部
  const items = pageId
    ? artifactPanel.items.filter(item => item.sourcePageId === pageId)
    : artifactPanel.items;

  const activeItem = items.find(item => item.id === activeId);

  if (items.length === 0) {
    return (
      <div className={isFullscreen ? 'gap-fullscreen-body' : 'global-artifact-panel'}>
        <div className="gap-empty">
          <div className="gap-empty-icon">📂</div>
          <div className="gap-empty-text">暂无工件</div>
          <div className="gap-empty-desc">章鱼Agent生成的可交互工件会显示在这里</div>
        </div>
      </div>
    );
  }

  return (
    <div className={isFullscreen ? 'gap-fullscreen-body' : 'global-artifact-panel'}>
      {/* 顶部Tab栏 */}
      <div className="gap-tab-bar">
        <div className="gap-tab-list">
          {items.map(item => (
            <div
              key={item.id}
              className={`gap-tab ${item.id === activeId ? 'active' : ''}`}
              onClick={() => setActiveArtifact(item.id)}
            >
              <span className="gap-tab-icon">{getArtifactIcon(item.type)}</span>
              <span className="gap-tab-title" title={item.title}>{item.title}</span>
              {item.isReadonly && <span className="gap-tab-readonly" title="已锁定">🔒</span>}
              <span
                className="gap-tab-close"
                onClick={(e) => { e.stopPropagation(); removeArtifact(item.id); }}
                title="关闭工件"
              >×</span>
            </div>
          ))}
        </div>
        {!isFullscreen && (
          <div className="gap-toolbar">
            <button
              className="gap-toolbar-btn"
              onClick={toggleArtifactFullscreen}
              title="全屏"
            >⛶</button>
            <button
              className="gap-toolbar-btn"
              onClick={closeArtifactPanel}
              title="收起"
            >─</button>
          </div>
        )}
      </div>

      {/* 内容区 */}
      <div className="gap-body">
        {activeItem && activeItem.type === 'task-dispatch' && (
          <TaskDispatchArtifact item={activeItem} />
        )}
        {activeItem && activeItem.type === 'html' && (
          <HtmlArtifact item={activeItem} />
        )}
        {activeItem && activeItem.type !== 'task-dispatch' && activeItem.type !== 'html' && (
          <div className="gap-placeholder">该工件类型暂未实现</div>
        )}
      </div>
    </div>
  );
}

function getArtifactIcon(type: string): string {
  switch (type) {
    case 'task-dispatch': return '📋';
    case 'html': return '📄';
    case 'excel': return '📊';
    case 'doc': return '📝';
    default: return '📦';
  }
}
