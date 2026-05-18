import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Task, TaskDetailData } from '../mock/data';

export type UserRole = 'jiaojin' | 'jiaojinD' | 'xiaoer';

export interface UserInfo {
  role: UserRole;
  name: string;
  title: string;
}

const roleMap: Record<UserRole, UserInfo> = {
  jiaojin: { role: 'jiaojin', name: '循进', title: '焦进（业务线负责人）' },
  jiaojinD: { role: 'jiaojinD', name: '文一', title: '焦进D（业务线副负责人）' },
  xiaoer: { role: 'xiaoer', name: '血糖', title: '一线运营小二' },
};

export type ViewPerspective = '小二' | 'TL';

interface AppContextType {
  user: UserInfo;
  setRole: (role: UserRole) => void;
  chatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  dynamicTasks: Task[];
  addDynamicTask: (task: Task) => void;
  dynamicTaskDetails: Record<string, TaskDetailData>;
  addDynamicTaskDetail: (id: string, detail: TaskDetailData) => void;
  editingStrategy: string | null;
  setEditingStrategy: (name: string | null) => void;
  viewPerspective: ViewPerspective;
  setViewPerspective: (v: ViewPerspective) => void;
  artifactPanel: ArtifactPanelState;
  openArtifact: (item: Omit<ArtifactItem, 'id' | 'createdAt'>) => string;
  closeArtifactPanel: () => void;
  toggleArtifactPanel: () => void;
  setActiveArtifact: (id: string) => void;
  removeArtifact: (id: string) => void;
  updateArtifact: (id: string, patch: Partial<ArtifactItem>) => void;
  toggleArtifactFullscreen: () => void;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ArtifactItem {
  id: string;
  type: 'task-dispatch' | 'html' | 'excel' | 'doc';
  title: string;
  payload?: any;
  isReadonly: boolean;
  sourcePageId?: string;
  createdAt: number;
}

export interface ArtifactPanelState {
  isOpen: boolean;
  isFullscreen: boolean;
  activeId: string | null;
  items: ArtifactItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('jiaojin');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [dynamicTasks, setDynamicTasks] = useState<Task[]>([]);
  const [dynamicTaskDetails, setDynamicTaskDetails] = useState<Record<string, TaskDetailData>>({});
  const [editingStrategy, setEditingStrategy] = useState<string | null>(null);
  const [viewPerspective, setViewPerspective] = useState<ViewPerspective>('小二');

  const [artifactPanel, setArtifactPanelState] = useState<ArtifactPanelState>({
    isOpen: false,
    isFullscreen: false,
    activeId: null,
    items: []
  });

  const openArtifact = (item: Omit<ArtifactItem, 'id' | 'createdAt'>): string => {
    const newId = `artifact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newItem: ArtifactItem = { ...item, id: newId, createdAt: Date.now() };
    setArtifactPanelState(prev => ({
      ...prev,
      isOpen: true,
      activeId: newId,
      items: [...prev.items, newItem]
    }));
    return newId;
  };

  const closeArtifactPanel = () => {
    setArtifactPanelState(prev => ({ ...prev, isOpen: false, isFullscreen: false }));
  };

  const toggleArtifactPanel = () => {
    setArtifactPanelState(prev => ({ ...prev, isOpen: !prev.isOpen, isFullscreen: prev.isOpen ? false : prev.isFullscreen }));
  };

  const setActiveArtifact = (id: string) => {
    setArtifactPanelState(prev => ({ ...prev, activeId: id }));
  };

  const removeArtifact = (id: string) => {
    setArtifactPanelState(prev => {
      const newItems = prev.items.filter(item => item.id !== id);
      let newActiveId = prev.activeId;
      if (prev.activeId === id) {
        newActiveId = newItems.length > 0 ? newItems[newItems.length - 1].id : null;
      }
      return {
        ...prev,
        items: newItems,
        activeId: newActiveId,
        isOpen: newItems.length > 0 ? prev.isOpen : false,
        isFullscreen: newItems.length > 0 ? prev.isFullscreen : false
      };
    });
  };

  const updateArtifact = (id: string, patch: Partial<ArtifactItem>) => {
    setArtifactPanelState(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...patch } : item)
    }));
  };

  const toggleArtifactFullscreen = () => {
    setArtifactPanelState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen, isOpen: !prev.isFullscreen ? true : prev.isOpen }));
  };

  const setRole = (r: UserRole) => {
    setRoleState(r);
    setChatMessages([]);
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  };

  const clearChat = () => setChatMessages([]);

  const addDynamicTask = (task: Task) => {
    setDynamicTasks(prev => [...prev, task]);
  };

  const addDynamicTaskDetail = (id: string, detail: TaskDetailData) => {
    setDynamicTaskDetails(prev => ({ ...prev, [id]: detail }));
  };

  return (
    <AppContext.Provider
      value={{
        user: roleMap[role],
        setRole,
        chatbotOpen,
        setChatbotOpen,
        chatMessages,
        addChatMessage,
        clearChat,
        dynamicTasks,
        addDynamicTask,
        dynamicTaskDetails,
        addDynamicTaskDetail,
        editingStrategy,
        setEditingStrategy,
        viewPerspective,
        setViewPerspective,
        artifactPanel,
        openArtifact,
        closeArtifactPanel,
        toggleArtifactPanel,
        setActiveArtifact,
        removeArtifact,
        updateArtifact,
        toggleArtifactFullscreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be within AppProvider');
  return ctx;
}
