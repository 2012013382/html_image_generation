import { type ArtifactItem } from '../../store';

interface Props {
  item: ArtifactItem;
}

/**
 * HTML 工件预览组件
 * 用 iframe + srcDoc 隔离样式，避免污染主应用 CSS
 */
export default function HtmlArtifact({ item }: Props) {
  const html: string = item.payload?.html || '';
  const fileName: string = item.payload?.fileName || item.title;
  const summary: string | undefined = item.payload?.summary;
  const createdAt: string | undefined = item.payload?.createdAt;

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewWindow = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="gap-html-artifact">
      <div className="gap-html-meta">
        <div className="gap-html-meta-info">
          <span className="gap-html-meta-icon">📄</span>
          <div className="gap-html-meta-text">
            <div className="gap-html-meta-title">{fileName}</div>
            {(summary || createdAt) && (
              <div className="gap-html-meta-sub">
                {summary && <span>{summary}</span>}
                {summary && createdAt && <span className="gap-html-meta-divider">·</span>}
                {createdAt && <span>生成于 {createdAt}</span>}
              </div>
            )}
          </div>
        </div>
        <div className="gap-html-meta-actions">
          <button className="gap-html-btn" onClick={handleOpenNewWindow} title="新窗口打开">↗</button>
          <button className="gap-html-btn" onClick={handleDownload} title="下载">⬇</button>
        </div>
      </div>
      <div className="gap-html-frame-wrap">
        <iframe
          className="gap-html-frame"
          title={fileName}
          srcDoc={html}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
