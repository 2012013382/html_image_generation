import type { UserRole } from '../store';

export type MetricTimeRange = 'MTD' | 'T-1' | '实时';

export interface MetricData {
  monthTarget: number;
  monthAchieved: number;
  achieveRate: number;
}

export interface Metric {
  id: string;
  name: string;
  category: string;
  unit: string;
  data: Record<MetricTimeRange, MetricData>;
}

export interface MetricValues {
  target: number;
  achieved: number;
  achieveRate: number;
  yoy: number;        // 年同比变化率，如 5.2 表示同比增长5.2%，-3.1 表示同比下降3.1%
}

export interface SubMetric {
  id: string;
  name: string;
  unit: string;
  data: Record<MetricTimeRange, MetricValues>;
}

export interface PrimaryMetric {
  id: string;
  label: string;
  metricName: string;
  unit: string;
  expandable: boolean;
  data: Record<MetricTimeRange, MetricValues>;
  subMetrics: SubMetric[];
}

export interface Strategy {
  id: string;
  title: string;
  status: 'pending' | 'adopted' | 'expired';
  relatedMetric: string;
  relatedMetricId: string;
  createTime: string;
  isFullAuto?: boolean;
  adoptedTime?: string;
  linkedTaskId?: string;
  problemSummary: string;
  strategySummary: string;
  problemDetail: string;
  strategyDetail: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done' | 'pending_confirm' | 'failed';
  source: 'delegated' | 'strategy' | 'chatbot' | 'user';
  sourceDetail: string;
  createTime: string;
  delegator?: string;
  owner?: string;
  progress?: number;
  strategyId?: string;
  children?: string[];
  isFullAuto?: boolean;
}

export interface SubManager {
  id: string;
  name: string;
  team: string;
}

export const subManagers: SubManager[] = [
  { id: 'mgr1', name: '尚赞', team: '品类1团队' },
  { id: 'mgr2', name: '云样', team: '品类2团队' },
  { id: 'mgr3', name: '尚赞', team: '品类3团队' },
  { id: 'mgr4', name: '靖熙', team: '品类4团队' },
  { id: 'mgr5', name: '楚川', team: '品类5团队' },
  { id: 'mgr6', name: '静跃', team: '品类6团队' },
  { id: 'mgr7', name: '绫君', team: '品类7团队' },
  { id: 'mgr8', name: '七禾', team: '品类8团队' },
  { id: 'mgr9', name: '大嫣', team: '品类9团队' },
];

export const mockPrimaryMetrics: PrimaryMetric[] = [
  {
    id: 'pm1',
    label: '成交指标',
    metricName: 'GMV确收',
    unit: '万',
    expandable: true,
    data: {
      'MTD': { target: 5200, achieved: 4350, achieveRate: 83.7, yoy: 8.5 },
      'T-1': { target: 173, achieved: 156, achieveRate: 90.2, yoy: 6.2 },
      '实时': { target: 173, achieved: 82, achieveRate: 47.4, yoy: 7.1 },
    },
    subMetrics: [
      { id: 'sm1', name: 'IPVUV', unit: '万', data: { 'MTD': { target: 8500, achieved: 7650, achieveRate: 90.0, yoy: 12.3 }, 'T-1': { target: 283, achieved: 261, achieveRate: 92.2, yoy: 9.8 }, '实时': { target: 283, achieved: 138, achieveRate: 48.8, yoy: 11.5 } } },
      { id: 'sm2', name: '转化率', unit: '%', data: { 'MTD': { target: 4.5, achieved: 3.8, achieveRate: 84.4, yoy: -2.1 }, 'T-1': { target: 4.5, achieved: 4.1, achieveRate: 91.1, yoy: 3.5 }, '实时': { target: 4.5, achieved: 3.6, achieveRate: 80.0, yoy: -1.8 } } },
      { id: 'sm3', name: '客单价', unit: '元', data: { 'MTD': { target: 165, achieved: 158, achieveRate: 95.8, yoy: 5.7 }, 'T-1': { target: 165, achieved: 162, achieveRate: 98.2, yoy: 6.3 }, '实时': { target: 165, achieved: 155, achieveRate: 93.9, yoy: 4.9 } } },
      { id: 'sm4', name: 'DAC', unit: '万', data: { 'MTD': { target: 320, achieved: 278, achieveRate: 86.9, yoy: 7.2 }, 'T-1': { target: 10.7, achieved: 9.5, achieveRate: 88.8, yoy: 5.4 }, '实时': { target: 10.7, achieved: 5.2, achieveRate: 48.6, yoy: 6.8 } } },
    ],
  },
  {
    id: 'pm2',
    label: '闪购指标',
    metricName: '闪购父订单量',
    unit: '万单',
    expandable: true,
    data: {
      'MTD': { target: 180, achieved: 162, achieveRate: 90.0, yoy: 15.8 },
      'T-1': { target: 6.0, achieved: 5.5, achieveRate: 91.7, yoy: 12.3 },
      '实时': { target: 6.0, achieved: 2.8, achieveRate: 46.7, yoy: 14.1 },
    },
    subMetrics: [
      { id: 'sm5', name: '闪购确收', unit: '万', data: { 'MTD': { target: 2800, achieved: 2380, achieveRate: 85.0, yoy: 18.5 }, 'T-1': { target: 93, achieved: 81, achieveRate: 87.1, yoy: 14.2 }, '实时': { target: 93, achieved: 42, achieveRate: 45.2, yoy: 16.7 } } },
      { id: 'sm6', name: '闪购UE', unit: '%', data: { 'MTD': { target: 3.2, achieved: 2.9, achieveRate: 90.6, yoy: -1.5 }, 'T-1': { target: 3.2, achieved: 3.0, achieveRate: 93.8, yoy: 5.2 }, '实时': { target: 3.2, achieved: 2.7, achieveRate: 84.4, yoy: -2.3 } } },
    ],
  },
  {
    id: 'pm3',
    label: '用户指标',
    metricName: '88VIP&高购AAC',
    unit: '万',
    expandable: true,
    data: {
      'MTD': { target: 420, achieved: 388, achieveRate: 92.4, yoy: 6.8 },
      'T-1': { target: 14.0, achieved: 13.2, achieveRate: 94.3, yoy: 4.5 },
      '实时': { target: 14.0, achieved: 7.1, achieveRate: 50.7, yoy: 5.3 },
    },
    subMetrics: [
      { id: 'sm7', name: 'MAC', unit: '万', data: { 'MTD': { target: 1500, achieved: 1320, achieveRate: 88.0, yoy: 8.2 }, 'T-1': { target: 50, achieved: 45, achieveRate: 90.0, yoy: 5.9 }, '实时': { target: 50, achieved: 24, achieveRate: 48.0, yoy: 7.1 } } },
      { id: 'sm8', name: '88VIP&高购MAC', unit: '万', data: { 'MTD': { target: 680, achieved: 612, achieveRate: 90.0, yoy: 3.4 }, 'T-1': { target: 22.7, achieved: 20.8, achieveRate: 91.6, yoy: 2.1 }, '实时': { target: 22.7, achieved: 10.5, achieveRate: 46.3, yoy: 4.6 } } },
    ],
  },
  {
    id: 'pm4',
    label: '自营TR率',
    metricName: '自营TR',
    unit: '%',
    expandable: true,
    data: {
      'MTD': { target: 12.5, achieved: 11.8, achieveRate: 94.4, yoy: -1.2 },
      'T-1': { target: 12.5, achieved: 12.1, achieveRate: 96.8, yoy: 0.8 },
      '实时': { target: 12.5, achieved: 11.5, achieveRate: 92.0, yoy: -0.5 },
    },
    subMetrics: [
      { id: 'sm9', name: 'EBITA%', unit: '%', data: { 'MTD': { target: 5.8, achieved: 5.2, achieveRate: 89.7, yoy: 2.3 }, 'T-1': { target: 5.8, achieved: 5.5, achieveRate: 94.8, yoy: 3.1 }, '实时': { target: 5.8, achieved: 5.0, achieveRate: 86.2, yoy: 1.5 } } },
    ],
  },
  {
    id: 'pm5',
    label: '招商托管',
    metricName: '招商托管GMV',
    unit: '万',
    expandable: true,
    data: {
      'MTD': { target: 4200, achieved: 3560, achieveRate: 84.8, yoy: 35.2 },
      'T-1': { target: 140, achieved: 118, achieveRate: 84.3, yoy: 33.8 },
      '实时': { target: 140, achieved: 62, achieveRate: 44.3, yoy: 30.5 },
    },
    subMetrics: [
      { id: 'sm13', name: '招商托管占比', unit: '%', data: {
        'MTD': { target: 32, achieved: 28.5, achieveRate: 89.1, yoy: 5.2 },
        'T-1': { target: 32, achieved: 29.1, achieveRate: 90.9, yoy: 4.8 },
        '实时': { target: 32, achieved: 26.3, achieveRate: 82.2, yoy: 3.9 },
      }},
    ],
  },
  {
    id: 'pm7',
    label: '投流托管',
    metricName: '投流托管GMV',
    unit: '万',
    expandable: true,
    data: {
      'MTD': { target: 8500, achieved: 7200, achieveRate: 84.7, yoy: 24.6 },
      'T-1': { target: 283, achieved: 242, achieveRate: 85.5, yoy: 22.3 },
      '实时': { target: 283, achieved: 118, achieveRate: 41.7, yoy: 20.1 },
    },
    subMetrics: [
      { id: 'sm10', name: '投流托管消耗', unit: '万', data: {
        'MTD': { target: 3800, achieved: 2900, achieveRate: 76.3, yoy: 32.1 },
        'T-1': { target: 127, achieved: 98, achieveRate: 77.2, yoy: 28.5 },
        '实时': { target: 127, achieved: 48, achieveRate: 37.8, yoy: 25.3 },
      }},
      { id: 'sm14', name: '投流托管占比', unit: '%', data: {
        'MTD': { target: 45, achieved: 38.2, achieveRate: 84.9, yoy: 6.8 },
        'T-1': { target: 45, achieved: 39.5, achieveRate: 87.8, yoy: 5.9 },
        '实时': { target: 45, achieved: 35.1, achieveRate: 78.0, yoy: 4.5 },
      }},
      { id: 'sm12', name: '投流托管ROI', unit: '', data: {
        'MTD': { target: 3.5, achieved: 3.1, achieveRate: 88.6, yoy: -3.2 },
        'T-1': { target: 3.5, achieved: 3.2, achieveRate: 91.4, yoy: -1.8 },
        '实时': { target: 3.5, achieved: 2.8, achieveRate: 80.0, yoy: -5.1 },
      }},
    ],
  },
  {
    id: 'pm6',
    label: '爆款链接数',
    metricName: '爆款链接数',
    unit: '个',
    expandable: false,
    data: {
      'MTD': { target: 1200, achieved: 780, achieveRate: 65.0, yoy: 12.8 },
      'T-1': { target: 40, achieved: 28, achieveRate: 70.0, yoy: 8.5 },
      '实时': { target: 40, achieved: 15, achieveRate: 37.5, yoy: 10.2 },
    },
    subMetrics: [],
  },
];

export const mockMetrics: Metric[] = [
  // 成交指标
  {
    id: 'm1', name: 'IPVUV', category: '成交指标', unit: '万',
    data: {
      'MTD': { monthTarget: 8500, monthAchieved: 7650, achieveRate: 90.0 },
      'T-1': { monthTarget: 283, monthAchieved: 261, achieveRate: 92.2 },
      '实时': { monthTarget: 283, monthAchieved: 138, achieveRate: 48.8 },
    },
  },
  {
    id: 'm2', name: '转化率', category: '成交指标', unit: '%',
    data: {
      'MTD': { monthTarget: 4.5, monthAchieved: 3.8, achieveRate: 84.4 },
      'T-1': { monthTarget: 4.5, monthAchieved: 4.1, achieveRate: 91.1 },
      '实时': { monthTarget: 4.5, monthAchieved: 3.6, achieveRate: 80.0 },
    },
  },
  {
    id: 'm3', name: '客单价', category: '成交指标', unit: '元',
    data: {
      'MTD': { monthTarget: 165, monthAchieved: 158, achieveRate: 95.8 },
      'T-1': { monthTarget: 5.5, monthAchieved: 5.3, achieveRate: 96.4 },
      '实时': { monthTarget: 5.5, monthAchieved: 2.8, achieveRate: 50.9 },
    },
  },
  {
    id: 'm4', name: 'DAC', category: '成交指标', unit: '万',
    data: {
      'MTD': { monthTarget: 320, monthAchieved: 278, achieveRate: 86.9 },
      'T-1': { monthTarget: 10.7, monthAchieved: 9.5, achieveRate: 88.8 },
      '实时': { monthTarget: 10.7, monthAchieved: 5.1, achieveRate: 47.7 },
    },
  },
  {
    id: 'm5', name: '确收', category: '成交指标', unit: '万',
    data: {
      'MTD': { monthTarget: 5200, monthAchieved: 4350, achieveRate: 83.7 },
      'T-1': { monthTarget: 173, monthAchieved: 156, achieveRate: 90.2 },
      '实时': { monthTarget: 173, monthAchieved: 82, achieveRate: 47.4 },
    },
  },

  // 闪购指标
  {
    id: 'm6', name: '闪购父订单', category: '闪购指标', unit: '万单',
    data: {
      'MTD': { monthTarget: 180, monthAchieved: 162, achieveRate: 90.0 },
      'T-1': { monthTarget: 6.0, monthAchieved: 5.6, achieveRate: 93.3 },
      '实时': { monthTarget: 6.0, monthAchieved: 2.9, achieveRate: 48.3 },
    },
  },
  {
    id: 'm7', name: '闪购确收', category: '闪购指标', unit: '万',
    data: {
      'MTD': { monthTarget: 2800, monthAchieved: 2380, achieveRate: 85.0 },
      'T-1': { monthTarget: 93, monthAchieved: 82, achieveRate: 88.2 },
      '实时': { monthTarget: 93, monthAchieved: 43, achieveRate: 46.2 },
    },
  },
  {
    id: 'm8', name: '闪购UE', category: '闪购指标', unit: '%',
    data: {
      'MTD': { monthTarget: 3.2, monthAchieved: 2.9, achieveRate: 90.6 },
      'T-1': { monthTarget: 3.2, monthAchieved: 3.0, achieveRate: 93.8 },
      '实时': { monthTarget: 3.2, monthAchieved: 2.7, achieveRate: 84.4 },
    },
  },

  // 用户指标
  {
    id: 'm9', name: '88VIP&高购AAC', category: '用户指标', unit: '万',
    data: {
      'MTD': { monthTarget: 420, monthAchieved: 388, achieveRate: 92.4 },
      'T-1': { monthTarget: 14.0, monthAchieved: 13.2, achieveRate: 94.3 },
      '实时': { monthTarget: 14.0, monthAchieved: 7.1, achieveRate: 50.7 },
    },
  },
  {
    id: 'm10', name: 'MAC', category: '用户指标', unit: '万',
    data: {
      'MTD': { monthTarget: 1500, monthAchieved: 1320, achieveRate: 88.0 },
      'T-1': { monthTarget: 50, monthAchieved: 45, achieveRate: 90.0 },
      '实时': { monthTarget: 50, monthAchieved: 24, achieveRate: 48.0 },
    },
  },
  {
    id: 'm11', name: '88VIP&高购MAC', category: '用户指标', unit: '万',
    data: {
      'MTD': { monthTarget: 680, monthAchieved: 612, achieveRate: 90.0 },
      'T-1': { monthTarget: 22.7, monthAchieved: 20.8, achieveRate: 91.6 },
      '实时': { monthTarget: 22.7, monthAchieved: 11.2, achieveRate: 49.3 },
    },
  },

  // 经营指标
  {
    id: 'm12', name: 'EBITA%', category: '经营指标', unit: '%',
    data: {
      'MTD': { monthTarget: 5.8, monthAchieved: 5.2, achieveRate: 89.7 },
      'T-1': { monthTarget: 5.8, monthAchieved: 5.5, achieveRate: 94.8 },
      '实时': { monthTarget: 5.8, monthAchieved: 4.9, achieveRate: 84.5 },
    },
  },
  {
    id: 'm13', name: '自营TR', category: '经营指标', unit: '%',
    data: {
      'MTD': { monthTarget: 12.5, monthAchieved: 11.8, achieveRate: 94.4 },
      'T-1': { monthTarget: 12.5, monthAchieved: 12.1, achieveRate: 96.8 },
      '实时': { monthTarget: 12.5, monthAchieved: 11.3, achieveRate: 90.4 },
    },
  },

  // 智能托管
  {
    id: 'm14', name: '投流托管消耗', category: '智能托管', unit: '万',
    data: {
      'MTD': { monthTarget: 3800, monthAchieved: 2900, achieveRate: 76.3 },
      'T-1': { monthTarget: 127, monthAchieved: 102, achieveRate: 80.3 },
      '实时': { monthTarget: 127, monthAchieved: 56, achieveRate: 44.1 },
    },
  },
  {
    id: 'm15', name: '投流托管GMV&占比', category: '智能托管', unit: '万',
    data: {
      'MTD': { monthTarget: 8500, monthAchieved: 7200, achieveRate: 84.7 },
      'T-1': { monthTarget: 283, monthAchieved: 248, achieveRate: 87.6 },
      '实时': { monthTarget: 283, monthAchieved: 132, achieveRate: 46.6 },
    },
  },
  {
    id: 'm16', name: '投流托管ROI', category: '智能托管', unit: '',
    data: {
      'MTD': { monthTarget: 3.5, monthAchieved: 3.1, achieveRate: 88.6 },
      'T-1': { monthTarget: 3.5, monthAchieved: 3.3, achieveRate: 94.3 },
      '实时': { monthTarget: 3.5, monthAchieved: 2.8, achieveRate: 80.0 },
    },
  },
  {
    id: 'm17', name: '招商托管GMV&占比', category: '智能托管', unit: '万',
    data: {
      'MTD': { monthTarget: 4200, monthAchieved: 3560, achieveRate: 84.8 },
      'T-1': { monthTarget: 140, monthAchieved: 122, achieveRate: 87.1 },
      '实时': { monthTarget: 140, monthAchieved: 65, achieveRate: 46.4 },
    },
  },
];

// 为每个焦进D生成差异化的指标数据（旧版 Metric）
export function getMetricsForManager(managerId: string | null): Metric[] {
  if (!managerId) return mockMetrics;
  const seed = managerId.charCodeAt(managerId.length - 1);
  return mockMetrics.map((m, idx) => {
    const factor = 0.06 + ((seed * (idx + 1) * 7) % 20) / 100;
    const newData: Record<MetricTimeRange, MetricData> = {} as Record<MetricTimeRange, MetricData>;
    (['MTD', 'T-1', '实时'] as MetricTimeRange[]).forEach(tr => {
      const orig = m.data[tr];
      const targetFactor = factor + ((seed * 3) % 5) / 100;
      const newTarget = Math.round(orig.monthTarget * targetFactor * 100) / 100;
      const achieveVariance = -5 + ((seed + idx) % 11);
      const newRate = Math.min(99.9, Math.max(40, orig.achieveRate + achieveVariance));
      const newAchieved = Math.round(newTarget * newRate / 100 * 100) / 100;
      newData[tr] = { monthTarget: newTarget, monthAchieved: newAchieved, achieveRate: Math.round(newRate * 10) / 10 };
    });
    return { ...m, data: newData };
  });
}

// 为每个焦进D生成差异化的 PrimaryMetric 数据
export function getPrimaryMetricsForManager(managerId: string): PrimaryMetric[] {
  const seed = managerId.charCodeAt(managerId.length - 1);
  return mockPrimaryMetrics.map(pm => ({
    ...pm,
    data: Object.fromEntries(
      (['MTD', 'T-1', '实时'] as MetricTimeRange[]).map(t => {
        const orig = pm.data[t];
        const factor = 0.7 + ((seed * 17 + t.charCodeAt(0)) % 30) / 100;
        return [t, {
          target: orig.target,
          achieved: Math.round(orig.achieved * factor),
          achieveRate: Math.round(orig.achieveRate * factor * 10) / 10,
          yoy: Math.round((orig.yoy + (-3 + ((seed * 7 + t.charCodeAt(0)) % 7))) * 10) / 10,
        }];
      })
    ) as Record<MetricTimeRange, MetricValues>,
    subMetrics: pm.subMetrics.map(sm => ({
      ...sm,
      data: Object.fromEntries(
        (['MTD', 'T-1', '实时'] as MetricTimeRange[]).map(t => {
          const orig = sm.data[t];
          const factor = 0.7 + ((seed * 13 + t.charCodeAt(0)) % 30) / 100;
          return [t, {
            target: orig.target,
            achieved: Math.round(orig.achieved * factor),
            achieveRate: Math.round(orig.achieveRate * factor * 10) / 10,
            yoy: Math.round((orig.yoy + (-3 + ((seed * 11 + t.charCodeAt(0)) % 7))) * 10) / 10,
          }];
        })
      ) as Record<MetricTimeRange, MetricValues>,
    })),
  }));
}

export const mockStrategies: Strategy[] = [
  {
    id: 's-gap1',
    title: '爆款链接数追GAP策略',
    status: 'pending',
    relatedMetric: '爆款链接数',
    relatedMetricId: 'hot-links',
    createTime: '2026-04-23 14:30',
    linkedTaskId: 't-pc1',
    problemSummary: '当前爆款链接数MTD达成率仅78%，距目标缺口22%，主要因高潜力链接转化周期延长及流失爆品未及时补位',
    strategySummary: '通过扩大潜力池筛选范围、加速打爆周期、建立流失预警机制三管齐下追回GAP',
    problemDetail: '当前爆款链接数MTD达成率仅78%，距目标缺口22%，主要原因：1）高潜力链接打爆转化周期从7天延长至12天；2）本月流失爆品15个未及时补位；3）百补/秒杀渠道招商效率下降30%',
    strategyDetail: '三维度追GAP方案：1）扩大潜力池：将筛选阈值从TOP100放宽至TOP200，覆盖更多潜力链接；2）加速打爆：集中资源位+提升补贴力度，将打爆周期压缩至7天内；3）流失补位：建立日频流失预警，24小时内完成替补链接上架',
  },
  {
    id: 's1',
    title: '确收增长突破策略',
    status: 'pending',
    relatedMetric: '确收',
    relatedMetricId: 'pm1',
    createTime: '2026-04-22 10:30',
    linkedTaskId: 't-pc1',
    problemSummary: '爆款链接数达成率仅65%，出爆率低于行业均值，主要原因为潜力品挖掘不足、打爆周期过长。',
    strategySummary: '加大潜力链接挖掘力度，优化打爆节奏，重点攻坚Top品类。',
    problemDetail: `1. 爆款链接数当前达成780个，距月度目标1200个存在420个gap，达成率仅65%。\n2. 经分析，主要问题集中在以下方面：\n   - 潜力商品挖掘不足：当前潜力池仅覆盖60%的目标品类，存在大量未被识别的高潜力商品。\n   - 打爆周期超标：平均打爆周期为12天，高于目标7天，导致爆款产出效率低下。\n   - 出爆率低于目标：当前出爆率18%，低于25%的目标线。\n3. 品类分析：3C数码、家居日用品类出爆率远低于均值，需重点关注。`,
    strategyDetail: `1. 扩大潜力商品池：\n   - 利用AI模型对全品类商品进行潜力评估，新增识别500+潜力链接。\n   - 重点扩展3C数码、家居日用品类的潜力池。\n2. 缩短打爆周期：\n   - 对在爆链接加大资源投入，集中火力7天内完成打爆。\n   - 优化百补-全域直降的报名流程，缩短商家参与周期。\n3. 提升出爆率：\n   - 聚焦高转化潜力链接，优先分配流量资源。\n   - 联动超补、淘秒-爆品续期团提升复购率。\n4. 任务拆解与执行：\n   - 按品类将任务委派给对应焦进D，每人负责50-80个潜力链接的打爆。`,
  },
  {
    id: 's2',
    title: '投流托管消耗提升方案',
    status: 'pending',
    relatedMetric: '投流托管消耗',
    relatedMetricId: 'pm7',
    createTime: '2026-04-22 09:15',
    linkedTaskId: 't-pc1',
    problemSummary: '投流托管消耗额达成率76.3%，核心问题为商家参与率低及单商家消耗额下降。',
    strategySummary: '拓展托管商家数量，优化投放策略提升单商家消耗。',
    problemDetail: `1. 投流托管消耗额当前达成2900万，距目标3800万有900万gap。\n2. 问题归因：\n   - 托管商家参与率下降：本月新增托管商家较上月减少22%。\n   - 单商家平均消耗下降：受ROI波动影响，部分商家主动降低投放预算。\n   - 行业竞争加剧：竞品平台推出更优惠的投放政策。`,
    strategyDetail: `1. 商家拓展：针对高GMV但未参与托管的商家进行定向邀约。\n2. 策略优化：为托管商家提供更精准的人群定向，提升ROI。\n3. 激励机制：对新增托管商家给予首月消耗返点激励。`,
  },
  {
    id: 's3',
    title: '核心品类确收增长策略',
    status: 'adopted',
    relatedMetric: '确收',
    relatedMetricId: 'pm1',
    createTime: '2026-04-20 14:00',
    isFullAuto: true,
    adoptedTime: '04-20',
    linkedTaskId: 't-d1',
    problemSummary: '核心品类确收达成率83.7%，服饰和美妆品类贡献不足。',
    strategySummary: '聚焦服饰、美妆品类，通过大促活动和商家激励提升确收。',
    problemDetail: `1. 核心品类确收4350万，距目标5200万有850万gap。\n2. 分品类看，服饰品类达成率仅72%，美妆品类78%，为主要拖累项。`,
    strategyDetail: `1. 服饰品类：联合头部商家推出限时折扣活动。\n2. 美妆品类：打造爆款单品，利用直播带货拉升GMV。\n3. 全品类：优化搜索推荐算法，提升品类页面转化率。`,
  },
  {
    id: 's4',
    title: '88VIP用户AAC提升计划',
    status: 'expired',
    relatedMetric: '88VIP&高购AAC',
    relatedMetricId: 'pm3',
    createTime: '2026-04-15 11:20',
    problemSummary: '88VIP用户活跃度环比下降，需通过权益优化和精准触达提升。',
    strategySummary: '优化会员权益结构，加强精准营销触达。',
    problemDetail: `88VIP用户AAC 388万，距420万目标存在32万gap。高购用户复购率下降是主因。`,
    strategyDetail: `1. 优化专属权益：增加品类专属优惠券。\n2. 精准触达：基于用户购买偏好进行个性化推荐。`,
  },
  {
    id: 's5',
    title: 'DAC日活跃消费者提升计划',
    status: 'pending',
    relatedMetric: 'DAC',
    relatedMetricId: 'pm1',
    createTime: '2026-04-21 09:15',
    linkedTaskId: 't-pc1',
    problemSummary: 'DAC达成率偏低，日活消费者增长乏力，需通过精细化运营提升用户活跃度。',
    strategySummary: '通过个性化推送、限时优惠和会员权益升级，拉动日活消费者增长。',
    problemDetail: 'DAC达成率86.9%，距月度目标有差距，主要受新客引入不足和老客复购率下降双重影响。',
    strategyDetail: '1. 精准推送：基于用户画像优化Push策略\n2. 限时优惠：设置每日限时闪购吸引活跃\n3. 会员权益：升级88VIP专属权益提升粘性',
  },
  {
    id: 's6',
    title: '闪购订单量冲刺方案',
    status: 'pending',
    relatedMetric: '闪购父订单',
    relatedMetricId: 'pm2',
    createTime: '2026-04-20 14:30',
    linkedTaskId: 't-pc1',
    problemSummary: '闪购父订单达成率有提升空间，需优化商品结构和流量策略。',
    strategySummary: '通过优质选品、时段策略和流量加持，冲刺闪购订单目标。',
    problemDetail: '当前闪购父订单达成率90.0%，虽接近目标但仍有优化空间，部分时段转化率偏低。',
    strategyDetail: '1. 优化选品：引入高转化品类商品\n2. 时段策略：调整高峰时段上新节奏\n3. 流量加持：配合推荐算法增加曝光',
  },
  {
    id: 's7',
    title: '爆款链接标题智能优化',
    status: 'adopted',
    relatedMetric: '爆款链接数',
    relatedMetricId: 'pm6',
    createTime: '2026-04-21 08:00',
    isFullAuto: true,
    adoptedTime: '04-21',
    linkedTaskId: 't-d2',
    problemSummary: 'TOP50爆款链接中有23个标题CTR低于类目均值，影响UV获取效率',
    strategySummary: 'AI自动分析低CTR链接特征，批量生成优化标题并AB测试，择优替换',
    problemDetail: '通过对TOP50爆款链接的CTR数据分析，发现23个链接的标题点击率低于类目均值15%以上...',
    strategyDetail: '系统自动识别低效标题 → 基于高CTR标题模式生成候选方案 → 自动部署AB测试 → 48小时后择优切换...',
  },
  {
    id: 's8',
    title: '投流出价实时动态调优',
    status: 'adopted',
    relatedMetric: '投流托管ROI',
    relatedMetricId: 'pm7',
    createTime: '2026-04-20 06:30',
    isFullAuto: true,
    adoptedTime: '04-20',
    linkedTaskId: 't-d5',
    problemSummary: '部分投放计划ROI波动大，人工调价响应滞后导致预算浪费',
    strategySummary: 'AI实时监控投放ROI，基于预设规则自动调整出价，确保ROI稳定在目标区间',
    problemDetail: '过去7天中，有18个投放计划的ROI波动超过±20%，人工调价平均滞后4小时...',
    strategyDetail: '部署实时ROI监控 → 每15分钟评估投放效果 → 自动调整出价（步长±5%，单日上限±20%）→ 异常熔断机制...',
  },
  {
    id: 's9',
    title: '88VIP用户精准运营方案',
    status: 'adopted',
    relatedMetric: '88VIP&高购AAC',
    relatedMetricId: 'pm3',
    createTime: '2026-04-16 10:00',
    adoptedTime: '04-18',
    linkedTaskId: 't-pc1',
    problemSummary: '88VIP用户购买频次环比下降8%，高价值用户留存率需提升。',
    strategySummary: '基于用户分层模型，为88VIP用户定制专属权益包和精准推荐策略。',
    problemDetail: '88VIP用户近30天购买频次从月均4.2次降至3.9次，复购周期延长。高购用户中，30%用户近2周无下单行为。',
    strategyDetail: '1. 用户分层：按消费力和活跃度将88VIP分为4个层级\n2. 精准权益：为不同层级用户配置差异化优惠券包\n3. 智能触达：基于用户偏好时段进行个性化Push',
  },
  {
    id: 's10',
    title: '闪购父订单量提升计划',
    status: 'adopted',
    relatedMetric: '闪购父订单',
    relatedMetricId: 'pm2',
    createTime: '2026-04-14 09:30',
    adoptedTime: '04-15',
    linkedTaskId: 't-pc2',
    problemSummary: '闪购时段订单转化率波动大，部分时段流量利用率不足。',
    strategySummary: '优化闪购选品结构和时段策略，配合流量加持提升父订单量。',
    problemDetail: '闪购高峰时段（10:00、14:00、20:00）转化率差异达3倍，非高峰时段流量浪费严重。部分品类商品复购率偏低。',
    strategyDetail: '1. 时段优化：调整各时段选品策略，匹配用户购买偏好\n2. 选品升级：引入高转化率品类商品补充闪购池\n3. 流量策略：非高峰时段增加Push触达和首页曝光',
  },
  {
    id: 's11',
    title: 'Q1库存周转优化方案',
    status: 'expired',
    relatedMetric: '确收',
    relatedMetricId: 'pm1',
    createTime: '2026-03-28 11:00',
    problemSummary: 'Q1末库存周转天数偏高，滞销品占比达15%，资金占用严重。',
    strategySummary: '通过智能补货模型和滞销品清仓策略，优化库存结构降低周转天数。',
    problemDetail: 'Q1库存周转天数达28天，高于目标22天。其中食品饮料品类周转天数最高达35天，滞销品（90天未动销）占比15%。',
    strategyDetail: '1. 智能补货：基于销量预测模型调整补货频次和批量\n2. 滞销清仓：对90天未动销商品启动阶梯降价清仓\n3. 品类优化：缩减低动销品类SKU数量',
  },
  {
    id: 's12',
    title: '日常补货自动执行',
    status: 'adopted',
    relatedMetric: '确收',
    relatedMetricId: 'pm1',
    createTime: '2026-04-20 08:00',
    isFullAuto: true,
    adoptedTime: '04-20',
    linkedTaskId: 't-x1',
    problemSummary: '日常补货依赖人工判断，响应滞后导致部分品类缺货率上升至8%。',
    strategySummary: 'AI基于销量预测模型自动触发补货，全流程无需人工干预。',
    problemDetail: '日常补货流程人工环节多，从发现缺货到完成补货平均耗时6小时，导致高频动销品类缺货率上升。近7天因补货滞后损失GMV约120万。',
    strategyDetail: '系统每小时自动评估库存水位 → 低于安全库存自动生成补货单 → 自动匹配最优供应商 → 自动下发补货指令 → 异常情况自动熔断并告警。',
  },
  {
    id: 's13',
    title: '常规促销排期自动生成',
    status: 'adopted',
    relatedMetric: '确收',
    relatedMetricId: 'pm1',
    createTime: '2026-04-20 09:30',
    isFullAuto: true,
    adoptedTime: '04-20',
    linkedTaskId: 't-x3',
    problemSummary: '常规促销排期人工编排效率低，每周耗时约4小时，且存在品类冲突和资源浪费。',
    strategySummary: 'AI根据品类节奏、库存状态和历史效果自动生成最优促销排期。',
    problemDetail: '每周常规促销排期需要人工协调多个品类，编排耗时长且容易出现品类活动冲突。上月因排期冲突导致3次活动资源浪费。',
    strategyDetail: '系统自动采集品类节奏日历 → 结合库存状态和历史转化数据 → 智能生成无冲突最优排期 → 自动分发给对应品类负责人 → 执行结果自动回收评估。',
  },
];

// 待授权执行任务
export interface PendingAuthTask {
  id: string;
  title: string;
  agent: string;
  taskId: string; // 关联的任务ID，点击跳转到任务详情页
}

export const mockPendingAuthTasks: PendingAuthTask[] = [
  { id: 'pa-1', title: '百亿补贴商品池更新审核', agent: '采购Agent', taskId: 't2' },
  { id: 'pa-2', title: '投流预算自动调整（ROI优化）', agent: '运营Agent', taskId: 't1' },
];

// 上下文消息
export interface ContextMessage {
  id: string;
  time: string;
  role: 'user' | 'agent' | 'system';
  roleName: string;
  content: string;
  actions?: string[];
  evidence?: string[];
  category: 'instruction' | 'judgment' | 'execution' | 'file';
  // AI 生成的 HTML 报告附件，渲染为可点击文件卡片，点击后在右侧 Artifact 面板预览
  htmlReport?: {
    fileName: string;
    title: string;
    summary?: string;
    createdAt?: string;
    htmlContent: string;
  };
}

// 任务血缘子任务
export interface LineageTask {
  id: string;
  title: string;
  status: string;
  statusLabel: string;
  owner: string;
  createTime?: string;
}

// 生成文件
export interface GeneratedFile {
  id: string;
  name: string;
  type: 'xlsx' | 'docx' | 'pdf' | 'png' | 'doc';
  size: string;
  createdAt: string;
}

// 执行数据指标
export interface ExecutionMetric {
  label: string;
  value: string;
  change: string;
  trend?: 'up' | 'down' | 'neutral';
  updatedAt: string;
  action: string;
  impact: string;
}

export interface ExecutionDetailRow {
  category: string;
  metric: string;
  before: string;
  after: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

// 任务详情扩展数据
export interface SubTaskItem {
  id: string;
  title: string;
  status: 'done' | 'inprogress' | 'todo' | 'pending_confirm';
  owner: string;
  time: string;
  feedback?: string;
  feedbackTime?: string;
  feedbackStatus?: 'done' | 'blocked';
}

export interface ProgressStep {
  name: string;
  agent: string;
  description?: string;
}

export interface StrategyContext {
  title: string;
  cause: string;
  solution: string;
  status: 'pending_confirm' | 'executing' | 'completed';
  detailKey?: string;
}

export interface TaskDetailData {
  isFullAuto?: boolean;
  overview: {
    goal: string;
    currentPhase: string;
    nextStep: string;
    risk: string;
  };
  contextMessages: ContextMessage[];
  lineage: {
    upstream: LineageTask[];
    downstream: LineageTask[];
  };
  generatedFiles: GeneratedFile[];
  executionMetrics: ExecutionMetric[];
  executionDetails?: ExecutionDetailRow[];
  conclusions: {
    mainCause: string;
    recommendedAction: string;
    pendingConfirmation: string;
  };
  subTasks?: SubTaskItem[];
  progressSteps?: ProgressStep[];
  strategyContext?: StrategyContext;
}

// 策略详情的结构化数据
export interface StrategyDetailSection {
  title: string;
  summary?: string;
  highlights?: { label: string; value: string; trend?: 'up' | 'down' | 'neutral'; delta?: string }[];
  items?: { label: string; desc: string }[];
  table?: { columns: string[]; rows: string[][] };
}

export interface StrategyDetailData {
  problemSections: StrategyDetailSection[];
  strategySections: StrategyDetailSection[];
}

export const mockStrategyDetails: Record<string, StrategyDetailData> = {
  s1: {
    problemSections: [
      {
        title: '目标完成总览',
        summary: '近30天爆品数量7154个，目标达成率89.4%，整体未达预期，同比去年减少863个（-10.8%）。',
        highlights: [
          { label: '爆品数量', value: '7,154', trend: 'down', delta: '-863' },
          { label: '目标达成率', value: '89.4%', trend: 'down', delta: '-10.6%' },
          { label: '同比变化', value: '-10.8%', trend: 'down', delta: '' },
        ],
      },
      {
        title: '爆款分层指标变化',
        summary: '近30天日爆品的确收GMV同比下滑8.2%，主要受「存量爆品-品效下滑」(-1513.2万) 和「流失爆品」(-3038.6万) 影响。',
        items: [
          { label: '存量爆品-品效下滑', desc: '核心受 IPV 下滑42.5%，叠加 CVR 下滑4.5pt，导致确收GMV减少1513.2万' },
          { label: '流失爆品-品效下滑', desc: '核心受 IPV 下滑77.5%，叠加 CVR 下滑15.3pt，导致确收GMV减少2069.2万' },
          { label: '流失爆品-下架', desc: '去年同期1142个爆品下架，确收GMV损失969.5万' },
        ],
        table: {
          columns: ['爆品分层', '商品数', '确收GMV', 'GMV差值', 'GMV同比', 'IPV同比', 'CVR同比'],
          rows: [
            ['存量爆品-品效下滑', '2,134', '1,947.9万', '-1,513.2万', '-43.7%', '-42.5%', '-4.5pt'],
            ['存量爆品-品效提升', '1,308', '2,448.8万', '+1,011.9万', '+70.4%', '+63.5%', '+6.3pt'],
            ['新增爆品', '3,712', '3,151.8万', '+2,823.2万', '+859.2%', '+782.0%', '+42.2pt'],
            ['流失爆品-下架', '1,142', '0', '-969.5万', '-100.0%', '-99.7%', '-100.0pt'],
            ['流失爆品-品效下滑', '3,433', '504.8万', '-2,069.2万', '-80.4%', '-77.5%', '-15.3pt'],
          ],
        },
      },
      {
        title: '品类归因',
        summary: '对存量品效下滑、流失品效下滑、流失下架三类爆品定位到具体品类问题。',
        items: [
          { label: '存量爆品-品效下滑', desc: '整体下滑1513.2万，TOP4大组：乳饮冲调/家清/个人护理/休闲零食' },
          { label: '流失爆品-品效下滑', desc: '整体下滑2069.2万，TOP4大组：乳饮冲调/家清/个人护理/电器数码' },
          { label: '流失爆品-下架', desc: '整体下滑969.5万，TOP4大组：电器数码/乳饮冲调/家清/个人洗护' },
        ],
        table: {
          columns: ['爆品分层', '大组', '确收GMV', 'GMV差值', 'GMV同比'],
          rows: [
            ['存量爆品-品效下滑', '乳饮冲调', '451.8万', '-451.1万', '-50.0%'],
            ['存量爆品-品效下滑', '家清', '326.1万', '-246.7万', '-43.1%'],
            ['存量爆品-品效下滑', '个人护理', '251.3万', '-172.8万', '-40.7%'],
            ['流失爆品-品效下滑', '乳饮冲调', '84.7万', '-377.1万', '-81.7%'],
            ['流失爆品-品效下滑', '家清', '39.0万', '-196.8万', '-83.4%'],
            ['流失爆品-下架', '电器数码', '0', '-205.2万', '-100.0%'],
            ['流失爆品-下架', '乳饮冲调', '0', '-193.1万', '-100.0%'],
          ],
        },
      },
      {
        title: '渠道归因',
        summary: '对三类问题爆品定位到具体渠道问题。',
        items: [
          { label: '存量爆品-品效下滑', desc: '整体下滑1513.2万，TOP3渠道：主搜/淘客/换购' },
          { label: '流失爆品-品效下滑', desc: '整体下滑2069.2万，TOP3渠道：淘客/主搜/换购' },
          { label: '流失爆品-下架', desc: '整体下滑969.5万，TOP3渠道：淘客/主搜/店播' },
        ],
        table: {
          columns: ['爆品分层', '渠道', '确收GMV', 'GMV差值', 'GMV同比'],
          rows: [
            ['存量爆品-品效下滑', '主搜', '375.2万', '-559.9万', '-59.9%'],
            ['存量爆品-品效下滑', '淘客', '481.1万', '-448.5万', '-48.2%'],
            ['存量爆品-品效下滑', '换购', '292.3万', '-324.2万', '-52.6%'],
            ['流失爆品-品效下滑', '淘客', '113.5万', '-764.0万', '-87.1%'],
            ['流失爆品-品效下滑', '主搜', '117.9万', '-730.1万', '-86.1%'],
            ['流失爆品-下架', '淘客', '0', '-469.1万', '-100.0%'],
            ['流失爆品-下架', '主搜', '0', '-273.2万', '-100.0%'],
          ],
        },
      },
    ],
    strategySections: [
      {
        title: '扩大潜力商品池',
        items: [
          { label: 'AI潜力评估', desc: '利用AI模型对全品类商品进行潜力评估，新增识别500+潜力链接' },
          { label: '重点品类扩展', desc: '重点扩展3C数码、家居日用品类的潜力池' },
        ],
      },
      {
        title: '缩短打爆周期',
        items: [
          { label: '资源集中投入', desc: '对在爆链接加大资源投入，集中火力7天内完成打爆' },
          { label: '流程优化', desc: '优化百补-全域直降的报名流程，缩短商家参与周期' },
        ],
      },
      {
        title: '提升出爆率',
        items: [
          { label: '流量优先分配', desc: '聚焦高转化潜力链接，优先分配流量资源' },
          { label: '复购联动', desc: '联动超补、淘秒-爆品续期团提升复购率' },
        ],
      },
      {
        title: '任务拆解与执行',
        items: [
          { label: '品类委派', desc: '按品类将任务委派给对应焦进D，每人负责50-80个潜力链接的打爆' },
        ],
      },
    ],
  },
  s2: {
    problemSections: [
      {
        title: '目标达成概览',
        summary: '投流托管消耗额当前达成2900万，距目标3800万有900万gap。',
        highlights: [
          { label: '当前消耗', value: '2,900万', trend: 'down', delta: '-900万' },
          { label: '目标达成率', value: '76.3%', trend: 'down', delta: '-23.7%' },
        ],
      },
      {
        title: '问题分析',
        items: [
          { label: '商家参与率下降', desc: '本月新增托管商家较上月减少22%' },
          { label: '单商家消耗下降', desc: '受ROI波动影响，部分商家主动降低投放预算' },
          { label: '行业竞争加剧', desc: '竞品平台推出更优惠的投放政策' },
        ],
      },
    ],
    strategySections: [
      {
        title: '商家拓展',
        items: [
          { label: '定向邀约', desc: '针对高GMV但未参与托管的商家进行定向邀约' },
        ],
      },
      {
        title: '策略优化',
        items: [
          { label: '人群定向', desc: '为托管商家提供更精准的人群定向，提升ROI' },
        ],
      },
      {
        title: '激励机制',
        items: [
          { label: '首月返点', desc: '对新增托管商家给予首月消耗返点激励' },
        ],
      },
    ],
  },
  s3: {
    problemSections: [
      {
        title: '目标达成概览',
        summary: '核心品类确收4350万，距目标5200万有850万gap。',
        highlights: [
          { label: '当前确收', value: '4,350万', trend: 'down', delta: '-850万' },
          { label: '目标达成率', value: '83.7%', trend: 'down', delta: '-16.3%' },
        ],
      },
      {
        title: '品类分析',
        items: [
          { label: '服饰品类', desc: '达成率仅72%，为主要拖累项' },
          { label: '美妆品类', desc: '达成率78%，贡献不足' },
        ],
      },
    ],
    strategySections: [
      {
        title: '服饰品类',
        items: [
          { label: '大促活动', desc: '联合头部商家推出限时折扣活动' },
        ],
      },
      {
        title: '美妆品类',
        items: [
          { label: '爆款单品', desc: '打造爆款单品，利用直播带货拉升GMV' },
        ],
      },
      {
        title: '全品类优化',
        items: [
          { label: '算法优化', desc: '优化搜索推荐算法，提升品类页面转化率' },
        ],
      },
    ],
  },
  s4: {
    problemSections: [
      {
        title: '目标达成概览',
        summary: '88VIP用户AAC 388万，距420万目标存在32万gap。高购用户复购率下降是主因。',
        highlights: [
          { label: '当前AAC', value: '388万', trend: 'down', delta: '-32万' },
          { label: '目标达成率', value: '92.4%', trend: 'down', delta: '-7.6%' },
        ],
      },
    ],
    strategySections: [
      {
        title: '优化专属权益',
        items: [
          { label: '品类优惠券', desc: '增加品类专属优惠券' },
        ],
      },
      {
        title: '精准触达',
        items: [
          { label: '个性化推荐', desc: '基于用户购买偏好进行个性化推荐' },
        ],
      },
    ],
  },
};

export interface AIWorkItem {
  id: string;
  title: string;
  result?: string;
  status: 'done' | 'running' | 'planned' | 'need_confirm';
  agent: string;
}

export const mockAIWorkReport = {
  yesterday: {
    total: 6,
    items: [
      { id: 'wr-1', title: '业务指标日报生成，发现3项异常预警', result: '已发送日报', status: 'done' as const, agent: '章鱼' },
      { id: 'wr-2', title: '3C数码品类投放效果评估', result: 'ROI提升2.1%', status: 'done' as const, agent: '运营Agent' },
      { id: 'wr-3', title: '家居品类爆款链接第二批筛选', result: '筛选出52条潜力链接', status: 'done' as const, agent: '运营Agent' },
      { id: 'wr-4', title: '服饰商家A活动数据复盘', result: '复盘报告已生成', status: 'done' as const, agent: '运营Agent' },
      { id: 'wr-5', title: '自动调整2个品类投流预算', result: 'ROI优化+3.2%', status: 'done' as const, agent: '运营Agent' },
      { id: 'wr-6', title: '全品类库存预警扫描', result: '无异常', status: 'done' as const, agent: '章鱼' },
    ],
  },
  today: {
    total: 4,
    items: [
      { id: 'wr-t1', title: '业务指标日报生成与异常预警', status: 'running' as const, agent: '章鱼' },
      { id: 'wr-t2', title: '新一批潜力链接AI自动筛选', status: 'planned' as const, agent: '运营Agent' },
      { id: 'wr-t4', title: '投流预算自动调整（ROI优化）', status: 'planned' as const, agent: '运营Agent' },
      { id: 'wr-t5', title: '生成本周运营周中小结', status: 'planned' as const, agent: '章鱼' },
    ],
  },
};

export interface CalendarEvent {
  id: string;
  date: string;
  weekday: string;
  events: {
    time: string;
    title: string;
    type: 'auto' | 'review' | 'report';
    agent: string;
  }[];
}

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-1',
    date: '04-24',
    weekday: '周四',
    events: [
      { time: '09:00', title: '业务指标日报生成与异常预警', type: 'auto', agent: '章鱼' },
      { time: '10:00', title: '3C数码品类投放效果评估', type: 'review', agent: '投流Agent' },
      { time: '14:00', title: '家居品类爆款链接第二批筛选', type: 'auto', agent: '品类Agent' },
      { time: '16:00', title: '服饰商家A活动数据复盘', type: 'report', agent: '招商Agent' },
    ],
  },
  {
    id: 'cal-2',
    date: '04-25',
    weekday: '周五',
    events: [
      { time: '09:00', title: '全品类周度数据汇总报告', type: 'report', agent: '章鱼' },
      { time: '10:30', title: '新一批潜力链接AI自动筛选', type: 'auto', agent: '品类Agent' },
      { time: '14:00', title: '百亿补贴商品池更新审核', type: 'review', agent: '招商Agent' },
      { time: '15:30', title: '投流预算自动调整（ROI优化）', type: 'auto', agent: '投流Agent' },
    ],
  },
  {
    id: 'cal-3',
    date: '04-26',
    weekday: '周六',
    events: [
      { time: '09:00', title: '周末流量趋势预测分析', type: 'auto', agent: '章鱼' },
      { time: '11:00', title: '爆款链接库存预警监控', type: 'auto', agent: '品类Agent' },
      { time: '15:00', title: '竞品价格动态追踪', type: 'auto', agent: '投流Agent' },
    ],
  },
  {
    id: 'cal-4',
    date: '04-27',
    weekday: '周日',
    events: [
      { time: '09:00', title: '周末运营数据实时看板更新', type: 'auto', agent: '章鱼' },
      { time: '14:00', title: '下周运营策略预生成', type: 'review', agent: '章鱼' },
    ],
  },
  {
    id: 'cal-5',
    date: '04-28',
    weekday: '周一',
    events: [
      { time: '09:00', title: '上周运营周报自动生成', type: 'report', agent: '章鱼' },
      { time: '10:00', title: '新一周投放计划制定', type: 'review', agent: '投流Agent' },
      { time: '11:00', title: '商家活动续期沟通（自动触达）', type: 'auto', agent: '招商Agent' },
      { time: '14:00', title: '品类确收GAP分析更新', type: 'auto', agent: '品类Agent' },
      { time: '16:00', title: '场景导购推荐策略刷新', type: 'auto', agent: '场景导购Agent' },
    ],
  },
];

export interface UpcomingTask {
  id: string;
  name: string;
  date: string;
  taskId: string;
  prompt: string;
}

export const mockUpcomingTasks: UpcomingTask[] = [
  { id: 'upcoming-1', name: '百亿补贴盘货', date: '04-25', taskId: 't-inv1', prompt: '对百亿补贴选品池进行全量盘货，核查商品库存、价格竞争力和补贴力度，确保活动期间不出现缺货或价格倒挂问题。' },
  { id: 'upcoming-2', name: '百亿补贴进度播报', date: '04-25', taskId: 't-report1', prompt: '汇总百补渠道各品类招商进度、选品池覆盖率、商家签约率等核心数据，生成今日进度播报推送给相关负责人。' },
  { id: 'upcoming-3', name: '百亿补贴审核', date: '04-26', taskId: 't-audit1', prompt: '审核本批次百亿补贴商品的资质合规性、补贴金额合理性和活动规则一致性，标记异常商品并通知商家整改。' },
];

export const mockTasks: Record<UserRole, Task[]> = {
  jiaojin: [
    {
      id: 't-pc1', title: '百亿补贴选品方案确认', description: 'AI已生成百亿补贴选品方案，包含50个高潜力商品，需确认选品范围和补贴力度。',
      status: 'pending_confirm', source: 'user', sourceDetail: '百亿补贴选品优化策略', createTime: '2026-04-22 09:30',
      strategyId: 's2',
    },
    {
      id: 't-pc2', title: '投流预算调整审批', description: 'AI建议将投流预算从3200万调整至3800万，预计ROI提升12%，需您确认预算变更。',
      status: 'pending_confirm', source: 'user', sourceDetail: '投流预算优化策略', createTime: '2026-04-22 10:15',
      strategyId: 's3',
    },
    {
      id: 't-pc3', title: '618大促节奏排期确认', description: 'AI已规划618大促三波段节奏，涉及资源位分配和商家沟通计划，需确认整体排期。',
      status: 'pending_confirm', source: 'delegated', sourceDetail: '618大促节奏规划', createTime: '2026-04-22 11:00',
      delegator: '焦进', owner: '楚川',
    },
    {
      id: 't-fail1', title: '爆品流失预警触发失败', description: 'AI自动执行爆品流失预警策略时，因数据源接口超时导致触发失败，需人工排查。',
      status: 'failed', source: 'strategy', sourceDetail: '爆品流失预警策略', createTime: '2026-05-07 16:30',
    },
    {
      id: 't-fail2', title: '淘客佣金批量调整异常', description: '批量调整淘客佣金比例时出现部分商品调整失败，涉及23个SKU未成功更新。',
      status: 'failed', source: 'strategy', sourceDetail: '淘客佣金优化策略', createTime: '2026-05-08 09:15',
    },
    {
      id: 't1', title: '爆款链接数打爆提升专项', description: '根据AI策略，将爆款链接数打爆任务拆解并委派给各品类负责人，目标本月达成1200个爆款链接。',
      status: 'inprogress', source: 'strategy', sourceDetail: '提升爆款链接出爆率策略', createTime: '2026-04-20 14:30',
      progress: 45, strategyId: 's1', children: ['t-d1', 't-d2', 't-d3'],
    },
    {
      id: 't-invite1', title: '百亿补贴定品邀约', description: '根据5月百补选品池，向30个高潜力商家发起定品邀约，覆盖美妆、食品、家清三大品类，目标完成率85%以上。',
      status: 'inprogress', source: 'strategy', sourceDetail: 'AI托管', createTime: '2026-04-21 15:30',
      progress: 45,
    },
    {
      id: 't-report1', title: '百亿补贴渠道进度播报', description: '每日自动汇总百补渠道各品类招商进度、选品池覆盖率、商家签约率等核心数据，生成进度播报并同步至相关负责人。',
      status: 'inprogress', source: 'strategy', sourceDetail: 'AI托管', createTime: '2026-04-20 08:00',
      progress: 60,
    },
    {
      id: 't-cron-report', title: '【定时任务】派发任务进度日报', description: 'AI 每日 09:00 自动拉取您创建并派发的任务完成情况，生成可视化 HTML 日报供快速查阅。',
      status: 'inprogress', source: 'strategy', sourceDetail: '定时任务·AI托管', createTime: '2026-05-18 09:00',
      progress: 100, isFullAuto: true,
    },
    {
      id: 't-delegate-tl1', title: '百补商家服务体验优化方案确认', description: '上级委派：确认百亿补贴商家服务体验优化方案，涉及售后响应时效和物流时效考核标准调整。',
      status: 'inprogress', source: 'delegated', delegator: '老板', sourceDetail: '被委派', createTime: '2026-04-22 10:30',
      progress: 40,
    },
    {
      id: 't2', title: '核心品类确收冲刺计划', description: '聚焦服饰、美妆品类确收提升，联动商家推出促销活动。',
      status: 'inprogress', source: 'user', sourceDetail: '用户发起', createTime: '2026-04-20 15:00',
      progress: 60, children: ['t-d4'], isFullAuto: true,
    },
    {
      id: 't-plan1', title: '百亿补贴运营计划生成', description: 'AI根据当前业务数据和历史表现，自动生成5月百亿补贴运营计划，包含选品策略、流量分配、预算规划和节奏安排。',
      status: 'done', source: 'strategy', sourceDetail: 'AI托管', createTime: '2026-04-19 10:00',
      progress: 100,
    },
    {
      id: 't3', title: '查询本周直播间GMV数据', description: '通过Chatbot查询本周各品类直播间GMV表现。',
      status: 'done', source: 'chatbot', sourceDetail: 'Chatbot发起', createTime: '2026-04-19 09:00',
    },
  ],
  jiaojinD: [
    {
      id: 't-d1', title: '3C数码品类爆款链接打爆', description: '负责3C数码品类50个潜力链接的打爆任务，目标7天内完成。',
      status: 'inprogress', source: 'delegated', sourceDetail: '', createTime: '2026-04-20 15:00',
      delegator: '焦进', progress: 35, children: ['t-x1', 't-x2'],
    },
    {
      id: 't-d2', title: '家居日用品类爆款打爆', description: '负责家居日用品类60个潜力链接的打爆，重点关注出爆率提升。',
      status: 'todo', source: 'delegated', sourceDetail: '', createTime: '2026-04-21 10:00',
      delegator: '焦进',
    },
    {
      id: 't-d4', title: '服饰品类确收提升', description: '联合服饰头部商家推出限时折扣活动，目标提升确收300万。',
      status: 'inprogress', source: 'delegated', sourceDetail: '', createTime: '2026-04-20 16:00',
      delegator: '焦进', progress: 55, children: ['t-x3'],
    },
    {
      id: 't-d5', title: '排查托管商家消耗异常', description: '排查本周投流托管消耗异常下降的TOP10商家。',
      status: 'done', source: 'chatbot', sourceDetail: 'Chatbot发起', createTime: '2026-04-18 16:00',
    },
  ],
  xiaoer: [
    {
      id: 't-delegate1', title: '618大促资源位确认', description: 'TL委派：确认首页Banner和搜索推荐位的618大促资源位排期，需在4月25日前完成确认。',
      status: 'pending_confirm', source: 'delegated', sourceDetail: '焦进委派', createTime: '2026-04-22 09:00',
      delegator: '焦进',
    },
    {
      id: 't-delegate2', title: '品类目标拆解确认', description: 'TL委派：确认5月各子品类GMV目标拆解方案，涉及美妆、食品、家清三大品类。',
      status: 'pending_confirm', source: 'delegated', sourceDetail: '焦进委派', createTime: '2026-04-21 16:30',
      delegator: '焦进',
    },
    {
      id: 't-delegate3', title: '5月促销节奏对齐', description: 'TL委派：对齐5月各品类促销节奏和资源投放计划，需在本周内完成确认。',
      status: 'pending_confirm', source: 'delegated', sourceDetail: '焦进委派', createTime: '2026-04-23 14:00',
      delegator: '焦进',
    },
    {
      id: 't-delegate4', title: '母婴品类渠道拓展确认', description: 'TL委派：确认母婴品类新渠道合作方案，涉及3个新入驻平台的资源对接。',
      status: 'pending_confirm', source: 'delegated', sourceDetail: '焦进委派', createTime: '2026-04-23 15:30',
      delegator: '焦进',
    },
    {
      id: 't-delegate5', title: '618商家激励方案审批', description: 'TL委派：审批618大促期间商家激励政策，包含阶梯返佣和流量扶持方案。',
      status: 'pending_confirm', source: 'delegated', sourceDetail: '焦进委派', createTime: '2026-04-24 09:00',
      delegator: '焦进',
    },
    {
      id: 't-x-ai-confirm1', title: '乳饮冲调品类流量补充方案', description: 'AI建议：针对乳饮冲调品类IPV下滑42.5%，建议增加主搜和推荐渠道的流量投放，预计可恢复15%流量。',
      status: 'pending_confirm', source: 'strategy', sourceDetail: 'AI策略生成', createTime: '2026-04-22 08:15',
    },
    {
      id: 't-x-ai-confirm2', title: '家清品类竞价商品价格调整', description: 'AI建议：检测到家清品类3款核心商品价格竞争力下降，建议启动自动比价并调整补贴力度。',
      status: 'pending_confirm', source: 'strategy', sourceDetail: 'AI策略生成', createTime: '2026-04-21 20:00',
    },
    {
      id: 't-ai-confirm3', title: '食品品类库存预警方案', description: 'AI检测到食品品类3个SKU库存低于安全线，已生成紧急补货方案，需确认执行。',
      status: 'pending_confirm', source: 'strategy', sourceDetail: 'AI策略生成', createTime: '2026-04-23 09:30',
    },
    {
      id: 't-ai-confirm4', title: '美妆爆品流量追投方案', description: 'AI识别到3款美妆爆品流量趋势上升，建议追加投流预算200万，需确认执行。',
      status: 'pending_confirm', source: 'strategy', sourceDetail: 'AI策略生成', createTime: '2026-04-23 11:00',
    },
    {
      id: 't-ai-confirm5', title: '竞品价格异常应对策略', description: 'AI监测到竞品在家清品类进行大幅降价，已生成应对方案包含3个调价建议，需确认。',
      status: 'pending_confirm', source: 'strategy', sourceDetail: 'AI策略生成', createTime: '2026-04-23 16:45',
    },
    {
      id: 't-x1', title: '联系XX品牌报名全域直降', description: '联系XX品牌商家，推动其报名百亿补贴-全域直降活动，确保价格达标。',
      status: 'todo', source: 'delegated', sourceDetail: '', createTime: '2026-04-21 11:00',
      delegator: '尚赞',
    },
    {
      id: 't-x2', title: 'YY商品提报淘秒爆品续期团', description: '推动YY商品完成淘宝秒杀-爆品续期团的提报，协调商家完成降价要求。',
      status: 'inprogress', source: 'delegated', sourceDetail: '', createTime: '2026-04-21 11:30',
      delegator: '尚赞', progress: 20,
    },
    {
      id: 't-x3', title: '服饰商家A限时折扣活动对接', description: '与服饰商家A对接限时折扣活动详情，确认活动时间和折扣力度。',
      status: 'inprogress', source: 'delegated', sourceDetail: '', createTime: '2026-04-21 14:00',
      delegator: '尚赞', progress: 40,
    },
    {
      id: 't-x4', title: '查询商品A竞品价格', description: '通过Chatbot查询商品A的竞品平台价格。',
      status: 'done', source: 'chatbot', sourceDetail: 'Chatbot发起', createTime: '2026-04-20 10:00',
    },
  ],
};

// AI 定时任务生成的《派发任务进度日报》 HTML 内容
const cronReportHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>派发任务进度日报</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; background: #F5F7FA; color: #1F2937; padding: 24px; line-height: 1.6; }
  .container { max-width: 920px; margin: 0 auto; }
  .report-header { background: linear-gradient(135deg, #00B578 0%, #00A56C 100%); color: #fff; padding: 28px 32px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 16px rgba(0, 181, 120, 0.18); }
  .report-header .badge { display: inline-block; background: rgba(255,255,255,0.22); padding: 4px 10px; border-radius: 999px; font-size: 12px; margin-bottom: 10px; }
  .report-header h1 { font-size: 24px; font-weight: 600; margin-bottom: 6px; }
  .report-header .meta { font-size: 13px; opacity: 0.85; }
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  .stat-card { background: #fff; border-radius: 10px; padding: 18px 16px; border: 1px solid #E5E7EB; }
  .stat-card .label { font-size: 12px; color: #6B7280; margin-bottom: 6px; }
  .stat-card .value { font-size: 28px; font-weight: 700; color: #1F2937; }
  .stat-card .value.green { color: #00B578; }
  .stat-card .value.orange { color: #F59E0B; }
  .progress-card { background: #fff; border-radius: 10px; padding: 20px 22px; border: 1px solid #E5E7EB; margin-bottom: 20px; }
  .progress-card .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .progress-card .title { font-size: 14px; font-weight: 600; color: #374151; }
  .progress-card .pct { font-size: 18px; font-weight: 700; color: #00B578; }
  .progress-bar { height: 10px; background: #F3F4F6; border-radius: 999px; overflow: hidden; }
  .progress-bar .fill { height: 100%; background: linear-gradient(90deg, #10B981 0%, #00B578 100%); border-radius: 999px; transition: width 0.6s ease; }
  .section { background: #fff; border-radius: 10px; border: 1px solid #E5E7EB; margin-bottom: 16px; overflow: hidden; }
  .section-header { padding: 14px 20px; border-bottom: 1px solid #F0F0F0; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; color: #1F2937; }
  .section-header .count { background: #F3F4F6; color: #6B7280; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
  .section-header.done { background: #F0FDF4; color: #065F46; }
  .section-header.done .count { background: #DCFCE7; color: #047857; }
  .section-header.pending { background: #FFF7ED; color: #9A3412; }
  .section-header.pending .count { background: #FFEDD5; color: #C2410C; }
  .task-row { padding: 14px 20px; border-bottom: 1px solid #F5F5F5; display: grid; grid-template-columns: 28px 1fr auto auto; gap: 12px; align-items: center; }
  .task-row:last-child { border-bottom: none; }
  .task-row .check { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
  .task-row .check.done { background: #DCFCE7; color: #047857; }
  .task-row .check.pending { background: #FEF3C7; color: #B45309; }
  .task-row .info .title { font-size: 14px; color: #1F2937; font-weight: 500; margin-bottom: 4px; }
  .task-row .info .sub { font-size: 12px; color: #6B7280; }
  .task-row .owner { font-size: 12px; color: #4B5563; background: #F3F4F6; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
  .task-row .date { font-size: 12px; color: #9CA3AF; white-space: nowrap; }
  .footer-note { background: #FEF9C3; border-left: 3px solid #EAB308; padding: 14px 18px; border-radius: 8px; font-size: 13px; color: #713F12; margin-top: 20px; }
  .footer-note strong { color: #854D0E; }
  .report-footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px dashed #E5E7EB; }
</style>
</head>
<body>
  <div class="container">
    <div class="report-header">
      <div class="badge">⏰ 定时任务 · 每日 09:00 自动生成</div>
      <h1>📊 派发任务进度日报</h1>
      <div class="meta">报告日期：2026年05月18日　·　生成人：章鱼 Agent　·　负责人：循进</div>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="label">派发总数</div><div class="value">9</div></div>
      <div class="stat-card"><div class="label">已完成</div><div class="value green">3</div></div>
      <div class="stat-card"><div class="label">未完成</div><div class="value orange">6</div></div>
      <div class="stat-card"><div class="label">完成率</div><div class="value green">33.3%</div></div>
    </div>
    <div class="progress-card">
      <div class="top"><div class="title">整体进度</div><div class="pct">3 / 9</div></div>
      <div class="progress-bar"><div class="fill" style="width: 33.3%;"></div></div>
    </div>
    <div class="section">
      <div class="section-header done"><span>✅ 已完成任务</span><span class="count">3</span></div>
      <div class="task-row"><div><span class="check done">✓</span></div><div class="info"><div class="title">百亿补贴运营计划生成</div><div class="sub">派发给：章鱼 Agent（AI 托管）</div></div><div class="owner">🤖 AI</div><div class="date">04-19</div></div>
      <div class="task-row"><div><span class="check done">✓</span></div><div class="info"><div class="title">3C 数码品类爆款选品初筛</div><div class="sub">派发给：文一（品类负责人）</div></div><div class="owner">👤 文一</div><div class="date">04-21</div></div>
      <div class="task-row"><div><span class="check done">✓</span></div><div class="info"><div class="title">托管商家消耗异常排查</div><div class="sub">派发给：文一（品类负责人）</div></div><div class="owner">👤 文一</div><div class="date">04-18</div></div>
    </div>
    <div class="section">
      <div class="section-header pending"><span>⏳ 未完成任务</span><span class="count">6</span></div>
      <div class="task-row"><div><span class="check pending">·</span></div><div class="info"><div class="title">3C 数码品类爆款链接打爆</div><div class="sub">派发给：文一（品类负责人）</div></div><div class="owner">👤 文一</div><div class="date">04-20</div></div>
      <div class="task-row"><div><span class="check pending">·</span></div><div class="info"><div class="title">家居日用品类爆款打爆</div><div class="sub">派发给：文一（品类负责人）</div></div><div class="owner">👤 文一</div><div class="date">04-21</div></div>
      <div class="task-row"><div><span class="check pending">·</span></div><div class="info"><div class="title">服饰品类确收提升</div><div class="sub">派发给：文一（品类负责人）</div></div><div class="owner">👤 文一</div><div class="date">04-20</div></div>
      <div class="task-row"><div><span class="check pending">·</span></div><div class="info"><div class="title">618 大促资源位确认</div><div class="sub">派发给：血糖（一线小二）</div></div><div class="owner">👤 血糖</div><div class="date">04-22</div></div>
      <div class="task-row"><div><span class="check pending">·</span></div><div class="info"><div class="title">品类目标拆解确认</div><div class="sub">派发给：血糖（一线小二）</div></div><div class="owner">👤 血糖</div><div class="date">04-21</div></div>
      <div class="task-row"><div><span class="check pending">·</span></div><div class="info"><div class="title">618 大促节奏排期确认</div><div class="sub">派发给：楚川（品类 5 团队）</div></div><div class="owner">👤 楚川</div><div class="date">04-22</div></div>
    </div>
    <div class="footer-note">
      <strong>💡 数据说明：</strong>当前定时任务仅能拉取任务是否完成。任务结果详情（如达成金额、收集反馈、转化指标等）需等后续任务中心 Skill 扩充后才能自动采集。
    </div>
    <div class="report-footer">本报告由章鱼 Agent 自动生成 · 2026-05-18 09:01</div>
  </div>
</body>
</html>`;

export const mockTaskDetails: Record<string, TaskDetailData> = {
  t1: {
    overview: {
      goal: '诊断并修复转化下滑',
      currentPhase: '策略执行中',
      nextStep: '确认资源位调整',
      risk: '库存不足影响恢复效果',
    },
    contextMessages: [
      {
        id: 'msg-1',
        time: '10:20',
        role: 'user' as const,
        roleName: '用户',
        content: '帮我分析一下为什么爆款链接数达成率这么低，给出改进策略。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-2',
        time: '10:21',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '已理解您的需求：诊断爆款链接数达成率低的根因，并生成针对性策略方案。\n\n我将协调多个专家Agent进行深度分析，请稍候...',
        actions: ['确认目标', '修改目标'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-3',
        time: '10:22',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '🔍 正在调用「数据分析Agent」获取爆品分层数据...',
        category: 'execution' as const,
      },
      {
        id: 'msg-4',
        time: '10:25',
        role: 'agent' as const,
        roleName: '数据分析Agent',
        content: '分析完成，以下为爆品分层数据摘要：\n\n• 存量爆品-品效下滑：2,134个商品，确收GMV下滑43.7%，IPV下滑42.5%\n• 流失爆品-品效下滑：3,433个商品，确收GMV下滑80.4%，IPV下滑77.5%\n• 流失爆品-下架：1,142个商品，确收GMV损失969.5万\n• 新增爆品：3,712个，GMV增长859.2%，为正向贡献\n\n整体爆品数量7,154个，目标达成率89.4%，同比减少863个。',
        evidence: ['爆品分层指标表', '确收GMV同比数据', 'IPV/CVR趋势'],
        category: 'execution' as const,
      },
      {
        id: 'msg-5',
        time: '10:26',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '收到数据分析结果。核心问题集中在「存量品效下滑」和「流失爆品」两个维度。\n\n🔍 正在调用「品类运营Agent」进行品类维度归因...',
        category: 'judgment' as const,
      },
      {
        id: 'msg-6',
        time: '10:30',
        role: 'agent' as const,
        roleName: '品类运营Agent',
        content: '品类归因分析完成：\n\n📦 存量爆品-品效下滑（-1,513.2万）：\n  TOP4大组：乳饮冲调(-451.1万)、家清(-246.7万)、个人护理(-172.8万)、休闲零食(-122.1万)\n\n📦 流失爆品-品效下滑（-2,069.2万）：\n  TOP4大组：乳饮冲调(-377.1万)、家清(-196.8万)、个人护理(-174.3万)、电器数码(-170.2万)\n\n建议重点关注乳饮冲调和家清品类，两者在三个维度均为TOP影响因子。',
        evidence: ['品类归因数据表', '大组维度GMV差值'],
        actions: ['查看品类明细', '导出数据'],
        category: 'execution' as const,
      },
      {
        id: 'msg-7',
        time: '10:31',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '品类归因已明确，乳饮冲调和家清为核心问题品类。\n\n🔍 正在调用「渠道分析Agent」进行渠道维度归因...',
        category: 'judgment' as const,
      },
      {
        id: 'msg-8',
        time: '10:35',
        role: 'agent' as const,
        roleName: '渠道分析Agent',
        content: '渠道归因分析完成：\n\n📊 存量爆品-品效下滑（-1,513.2万）：\n  TOP3渠道：主搜(-559.9万)、淘客(-448.5万)、换购(-324.2万)\n\n📊 流失爆品-品效下滑（-2,069.2万）：\n  TOP3渠道：淘客(-764.0万)、主搜(-730.1万)、换购(-188.1万)\n\n淘客和主搜渠道影响最为显著，建议优先调整这两个渠道的流量分配策略。',
        evidence: ['渠道归因数据表', '渠道GMV差值'],
        category: 'execution' as const,
      },
      {
        id: 'msg-8b',
        time: '10:36',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '渠道归因已锁定，正在进一步评估商家端的配合意愿。\n\n🔍 正在调用「招商Agent」评估商家配合度和招商方案...',
        category: 'judgment' as const,
      },
      {
        id: 'msg-8c',
        time: '10:40',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '招商方案评估完成：\n\n🤝 商家配合度分析：\n  • 乳饮冲调TOP商家：80%愿意参与爆品打爆活动\n  • 家清TOP商家：75%愿意配合降价促销\n  • 建议激励策略：返佣+流量倾斜双重激励\n\n📋 招商执行建议：\n  1. 优先沟通TOP10核心商家，确保关键爆品供给\n  2. 新增商家定向邀约30家，补充潜力链接池\n  3. 设置阶梯式佣金激励，提升商家参与积极性\n\n预计可新增覆盖200+潜力链接。',
        evidence: ['商家意愿调研数据', '招商激励方案', '新商家邀约清单'],
        category: 'execution' as const,
      },
      {
        id: 'msg-9',
        time: '10:36',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 所有专家Agent分析已完成，综合各方数据，我为您整理了完整的策略方案：\n\n━━━━━━━━━━━━━━━━━━━━\n📋 策略总结：提升爆款链接出爆率\n━━━━━━━━━━━━━━━━━━━━\n\n🔴 核心问题：\n爆品数量达成率89.4%，缺口863个。主因为存量品效下滑(-1,513万)和流失爆品(-3,039万)，乳饮冲调/家清为重灾品类，淘客/主搜为主要流失渠道。\n\n🟢 策略方案（4大方向）：\n\n1️⃣ 扩大潜力商品池\n2️⃣ 缩短打爆周期（12天→7天）\n3️⃣ 提升出爆率（主搜+35%，淘客佣金+15%）\n4️⃣ 按品类委派焦进D执行\n\n📊 预期效果：出爆率18%→25%，新增500+爆品，月GMV+2,200万',
        evidence: ['完整归因报告', '策略执行计划', 'ROI测算'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-10',
        time: '10:48',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '以上策略方案已准备就绪。是否需要我立即执行以下操作？\n\n1. 生成详细的任务拆解计划\n2. 将子任务自动委派给对应的焦进D\n3. 发送钉钉通知给相关负责人',
        actions: ['立即执行', '调整方案', '暂不执行'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-11',
        time: '10:52',
        role: 'user' as const,
        roleName: '用户',
        content: '方案没问题，立即执行。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-12',
        time: '10:53',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 收到执行指令！正在为您拆解任务并分发...\n\n━━━━━━━━━━━━━━━━━━━━\n📋 子任务已创建并分发\n━━━━━━━━━━━━━━━━━━━━\n\n已基于策略方案生成 3 个子任务：\n\n1️⃣ 3C数码品类爆款链接打爆\n   → 委派给：尚赞\n\n2️⃣ 家居日用品类爆款打爆\n   → 委派给：尚赞\n\n3️⃣ 乳饮冲调品类爆款打爆\n   → 委派给：尚赞\n\n📢 已通过钉钉通知相关负责人。',
        actions: ['查看子任务', '查看看板', '派发任务'],
        evidence: ['任务分发记录', '钉钉通知记录'],
        category: 'execution' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [
        { id: 't-d1', title: '3C数码品类爆款链接打爆', status: 'inprogress', statusLabel: '执行中', owner: '尚赞', createTime: '2026-04-20 15:00' },
        { id: 't-d2', title: '家居日用品类爆款打爆', status: 'todo', statusLabel: '待执行', owner: '尚赞', createTime: '2026-04-21 10:00' },
        { id: 't-d3', title: '乳饮冲调品类爆款打爆', status: 'todo', statusLabel: '待执行', owner: '尚赞', createTime: '2026-04-21 11:00' },
      ],
    },
    generatedFiles: [
      { id: 'f-1', name: '类目诊断报告.xlsx', type: 'xlsx', size: '2.4 MB', createdAt: '04-24 14:30' },
      { id: 'f-2', name: '策略执行计划.docx', type: 'docx', size: '1.1 MB', createdAt: '04-24 14:30' },
      { id: 'f-3', name: '资源位调整方案.pdf', type: 'pdf', size: '3.7 MB', createdAt: '04-24 14:28' },
      { id: 'f-4', name: '爆品分层分析明细.xlsx', type: 'xlsx', size: '5.2 MB', createdAt: '04-24 10:15' },
      { id: 'f-5', name: '品类归因数据报表.xlsx', type: 'xlsx', size: '4.8 MB', createdAt: '04-24 10:12' },
      { id: 'f-6', name: '渠道流量分析报告.pdf', type: 'pdf', size: '2.9 MB', createdAt: '04-23 18:40' },
      { id: 'f-7', name: '招商执行方案.docx', type: 'docx', size: '890 KB', createdAt: '04-23 16:20' },
    ],
    executionMetrics: [
      { label: '爆品出爆率', value: '21.3%', change: '+3.3pp', trend: 'up', updatedAt: '1小时前', action: 'AI潜力评估模型扩大覆盖', impact: '新增识别320个高潜力链接，出爆率提升3.3pp' },
      { label: '爆品数量', value: '823个', change: '+43', trend: 'up', updatedAt: '1小时前', action: '3C数码/家居品类重点打爆', impact: '3C数码新增18个爆品，家居新增25个爆品' },
      { label: '确收GMV', value: '3,892万', change: '+342万', trend: 'up', updatedAt: '1小时前', action: '主搜曝光PV提升35%', impact: '主搜渠道GMV回升212万，带动整体确收增长' },
      { label: '缺货SKU', value: '5个', change: '-7', trend: 'down', updatedAt: '1小时前', action: '紧急补货+库存预警机制', impact: '缺货SKU从12个降至5个，减少断货损失约89万' },
      { label: '打爆周期', value: '9.2天', change: '-2.8天', trend: 'down', updatedAt: '1小时前', action: '百补-全域直降报名流程优化', impact: '商家参与周期缩短2天，打爆效率提升23%' },
    ],
    executionDetails: [
      { category: '存量爆品-品效提升', metric: '确收GMV', before: '1,436.9万', after: '2,448.8万', change: '+70.4%', trend: 'up' },
      { category: '存量爆品-品效提升', metric: 'IPV', before: '4,746,564', after: '7,759,400', change: '+63.5%', trend: 'up' },
      { category: '存量爆品-品效提升', metric: 'CVR', before: '2.7%', after: '9.0%', change: '+6.3pp', trend: 'up' },
      { category: '新增爆品', metric: '确收GMV', before: '328.6万', after: '3,151.8万', change: '+859.2%', trend: 'up' },
      { category: '新增爆品', metric: '商品数', before: '428', after: '3,712', change: '+767.3%', trend: 'up' },
      { category: '存量爆品-品效下滑', metric: '确收GMV', before: '3,461.1万', after: '1,947.9万', change: '-43.7%', trend: 'down' },
      { category: '存量爆品-品效下滑', metric: 'IPV', before: '12,051,476', after: '6,929,099', change: '-42.5%', trend: 'down' },
      { category: '流失爆品-品效下滑', metric: '确收GMV', before: '2,574.0万', after: '504.8万', change: '-80.4%', trend: 'down' },
      { category: '流失爆品-下架', metric: '确收GMV', before: '969.5万', after: '0', change: '-100.0%', trend: 'down' },
      { category: '乳饮冲调', metric: 'GMV差值', before: '-', after: '-451.1万', change: '-50.0%', trend: 'down' },
      { category: '家清', metric: 'GMV差值', before: '-', after: '-246.7万', change: '-43.1%', trend: 'down' },
      { category: '主搜渠道', metric: 'GMV差值', before: '-', after: '-559.9万', change: '-59.9%', trend: 'down' },
      { category: '淘客渠道', metric: 'GMV差值', before: '-', after: '-448.5万', change: '-48.2%', trend: 'down' },
    ],
    conclusions: {
      mainCause: '库存 + 流量资源',
      recommendedAction: '补货 + 资源位恢复',
      pendingConfirmation: '资源位调整',
    },
    subTasks: [
      { id: 'st-1', title: '全店诊断完成', status: 'done', owner: '店长', time: '2分钟前' },
      { id: 'st-2', title: '月度数据汇总', status: 'done', owner: '店长', time: '1小时前' },
      { id: 'st-3', title: '策略优化分析', status: 'inprogress', owner: '店长', time: '2小时前' },
      { id: 'st-4', title: '下周经营目标拆解', status: 'todo', owner: '店长', time: '待安排' },
    ],
  },
  t2: {
    isFullAuto: true,
    overview: {
      goal: '核心品类确收达成率提升至95%',
      currentPhase: 'AI自动执行中',
      nextStep: '持续监控确收数据，动态调整活动策略',
      risk: '部分商家活动参与意愿不足',
    },
    contextMessages: [
      {
        id: 'msg-t2-1',
        time: '06:00',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '🔔 系统自动巡检触发：检测到「核心品类确收」达成率83.7%，低于目标阈值95%，GAP为850万。自动启动诊断与策略生成流程。',
        category: 'judgment' as const,
      },
      {
        id: 'msg-t2-2',
        time: '06:01',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '🔍 正在调用「数据分析Agent」分析核心品类确收数据...',
        category: 'execution' as const,
      },
      {
        id: 'msg-t2-3',
        time: '06:05',
        role: 'agent' as const,
        roleName: '数据分析Agent',
        content: '分析完成：\n\n• 当前确收：4,350万，目标5,200万，GAP 850万\n• 服饰品类：确收1,200万，同比-12.5%，为最大下滑品类\n• 美妆品类：确收890万，同比-8.3%\n• 食品品类：确收760万，同比+5.2%，正向贡献\n\n服饰和美妆品类合计贡献约65%的GAP。',
        evidence: ['品类确收数据表', '同比趋势分析'],
        category: 'execution' as const,
      },
      {
        id: 'msg-t2-4',
        time: '06:06',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '数据分析完成，服饰和美妆为核心问题品类。\n\n🔍 正在调用「招商Agent」分析商家侧情况...',
        category: 'judgment' as const,
      },
      {
        id: 'msg-t2-5',
        time: '06:10',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '招商侧分析完成：\n\n🏪 服饰品类：\n• 头部商家大促活动参与率下降15%\n• 库存充足，但折扣力度较竞品平台偏弱\n\n🏪 美妆品类：\n• 国际品牌确收贡献下滑，本土品牌增长强劲\n• 建议加大本土品牌扶持力度\n\n建议：联动服饰头部商家推出限时折扣，同时扩大美妆本土品牌活动覆盖。',
        evidence: ['商家参与率数据', '品类竞争分析'],
        category: 'execution' as const,
      },
      {
        id: 'msg-t2-6',
        time: '06:11',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 全链路分析已完成。自动生成策略方案：\n\n━━━━━━━━━━━━━━━━━━━━\n📋 AI自主策略：核心品类确收增长\n━━━━━━━━━━━━━━━━━━━━\n\n🟢 3大执行方向：\n1️⃣ 服饰品类：联动头部商家限时折扣，目标+300万确收\n2️⃣ 美妆品类：本土品牌专项扶持活动，目标+200万确收\n3️⃣ 动态定价：AI实时调整促销力度，追平竞品\n\n📊 预期效果：确收达成率83.7%→93.5%，缩小GAP至340万',
        evidence: ['策略方案', '预期效果测算'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-t2-7',
        time: '06:12',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '⚡ 策略已自动采纳，正在执行任务拆解与分发...',
        category: 'execution' as const,
      },
      {
        id: 'msg-t2-8',
        time: '06:15',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 任务自动拆解与分发完成：\n\n━━━━━━━━━━━━━━━━━━━━\n📋 已自动创建 1 个子任务\n━━━━━━━━━━━━━━━━━━━━\n\n1️⃣ 服饰品类确收提升\n   → 自动执行中 · 联动头部商家推出限时折扣\n\n📢 全程AI自动托管，无需人工介入。执行进展将实时更新至「执行结果」面板。',
        actions: ['查看子任务', '查看执行结果'],
        category: 'execution' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [
        { id: 't-d4', title: '服饰品类确收提升', status: 'inprogress', statusLabel: '执行中', owner: 'AI自动', createTime: '2026-04-20 16:00' },
      ],
    },
    generatedFiles: [
      { id: 'f-t2-1', name: '核心品类确收诊断报告.xlsx', type: 'xlsx', size: '1.8 MB', createdAt: '04-20 15:00' },
      { id: 'f-t2-2', name: '商家活动执行方案.docx', type: 'docx', size: '960 KB', createdAt: '04-20 15:00' },
      { id: 'f-t2-3', name: '投流策略方案.pdf', type: 'pdf', size: '1.2 MB', createdAt: '04-20 16:00' },
      { id: 'f-t2-4', name: '竞品分析报告.pdf', type: 'pdf', size: '1.5 MB', createdAt: '04-20 16:10' },
      { id: 'f-t2-5', name: '数据可视化看板.png', type: 'png', size: '3.5 MB', createdAt: '04-20 16:20' },
      { id: 'f-t2-6', name: '执行排期表.xlsx', type: 'xlsx', size: '780 KB', createdAt: '04-20 16:30' },
      { id: 'f-t2-7', name: '商家沟通话术.doc', type: 'doc', size: '420 KB', createdAt: '04-20 16:45' },
    ],
    executionMetrics: [
      { label: '确收达成率', value: '87.2%', change: '+3.5pp', trend: 'up' as const, updatedAt: '1小时前', action: '服饰头部商家限时折扣上线', impact: '服饰品类确收增加180万，达成率提升3.5pp' },
      { label: '确收GMV', value: '4,532万', change: '+182万', trend: 'up' as const, updatedAt: '1小时前', action: '美妆本土品牌扶持活动', impact: '美妆品类确收增加62万，食品增加38万' },
      { label: '活动参与商家', value: '128家', change: '+23家', trend: 'up' as const, updatedAt: '1小时前', action: 'AI智能邀约系统推送', impact: '新增23家商家参与大促活动' },
    ],
    executionDetails: [
      { category: '服饰品类', metric: '确收GMV', before: '1,200万', after: '1,380万', change: '+15.0%', trend: 'up' as const },
      { category: '服饰品类', metric: '活动参与商家', before: '45家', after: '58家', change: '+28.9%', trend: 'up' as const },
      { category: '美妆品类', metric: '确收GMV', before: '890万', after: '952万', change: '+7.0%', trend: 'up' as const },
      { category: '美妆品类', metric: '本土品牌占比', before: '42%', after: '51%', change: '+9pp', trend: 'up' as const },
      { category: '食品品类', metric: '确收GMV', before: '760万', after: '798万', change: '+5.0%', trend: 'up' as const },
    ],
    conclusions: {
      mainCause: '服饰品类头部商家活动参与率下降 + 美妆国际品牌确收下滑',
      recommendedAction: '持续推进限时折扣 + 扩大本土品牌扶持',
      pendingConfirmation: '无（AI全托管自动执行）',
    },
  },
  't-d1': {
    overview: {
      goal: '3C数码品类50个潜力链接7天内完成打爆，目标出爆率≥25%',
      currentPhase: '流量投放与转化优化',
      nextStep: '评估第一批链接打爆效果，调整第二批投放策略',
      risk: '部分链接库存紧张，可能影响打爆节奏',
    },
    contextMessages: [
      {
        id: 'msg-d1-0',
        time: '15:00',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '📋 您收到一项来自焦进的委派任务：\n\n━━━━━━━━━━━━━━━━━━━━\n🎯 任务：3C数码品类爆款链接打爆\n━━━━━━━━━━━━━━━━━━━━\n\n📊 任务背景：\n爆款链接数达成率89.4%，3C数码品类有50个潜力链接需要打爆，目标7天内完成。\n\n🟢 执行策略：\n1️⃣ 拉取50个潜力链接基础数据（IPV、CVR、库存、竞品价格）\n2️⃣ 按出爆潜力分级（A/B/C档），优先集中资源打A档\n3️⃣ 制定流量投放方案（主搜60%+推荐25%+淘客15%）\n4️⃣ 库存不足链接安排小二跟进补货\n\n📈 预期目标：\n• 出爆率：18% → 25%\n• 7天完成50个链接打爆\n\n请确认是否开始执行？',
        actions: ['开始执行', '调整策略', '暂不执行'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-d1-0b',
        time: '15:05',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '策略方向没问题，开始执行。先帮我拉一下这50个链接的基础数据。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d1-1',
        time: '15:10',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '收到爆款链接打爆任务，我这边负责3C数码品类50个潜力链接。先帮我拉一下这50个链接的基础数据，包括当前IPV、CVR、库存深度和竞品价格。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d1-2',
        time: '15:12',
        role: 'agent' as const,
        roleName: '品类分析Agent',
        content: '已完成3C数码品类50个潜力链接的数据拉取：\n\n📊 整体概况：\n• 平均IPV：12,340/天，其中TOP10链接IPV达28,600/天\n• 平均CVR：2.8%，低于品类均值3.5%\n• 库存充足率：82%（9个链接库存低于安全线）\n• 竞品价格优势：68%的链接价格具备竞争力\n\n⚠️ 重点关注：\n• 9个链接库存不足，建议优先联系商家补货\n• 12个链接CVR低于2%，需要优化标题和主图',
        evidence: ['3C数码50链接基础数据表', '库存预警清单'],
        category: 'execution' as const,
      },
      {
        id: 'msg-d1-3',
        time: '15:15',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '好的，那先把这50个链接分一下优先级，按出爆潜力排序。另外CVR低于2%的那12个链接，帮我分析一下原因。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d1-4',
        time: '15:18',
        role: 'agent' as const,
        roleName: '品类分析Agent',
        content: '分级完成，按出爆潜力分为三档：\n\n🔴 A档（高潜力，15个）：\nIPV>20K、CVR>3%、库存充足，预计5天可出爆\n\n🟡 B档（中潜力，23个）：\nIPV 10K-20K，CVR 2%-3%，需配合流量扶持\n\n🟢 C档（需优化，12个）：\nCVR<2%，主要问题：标题关键词覆盖不全(7个)、主图点击率低(3个)、价格无竞争力(2个)\n\n建议执行顺序：先集中资源打A档，再用A档经验复制到B档。',
        evidence: ['潜力分级报告', 'CVR低效链接诊断'],
        actions: ['查看A档明细', '导出分级表'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-d1-5',
        time: '15:22',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '分级合理。A档15个链接先上，帮我制定流量投放方案，主搜和推荐渠道怎么分配。同时把库存不足的9个链接对应的商家名单发给我，我安排小二跟进补货。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d1-6',
        time: '15:26',
        role: 'agent' as const,
        roleName: '投流Agent',
        content: 'A档15个链接的流量投放方案已生成：\n\n📈 投放策略：\n• 主搜渠道：分配60%流量预算，预计带来IPV+35%\n• 推荐渠道：分配25%流量预算，侧重人群精准触达\n• 淘客渠道：分配15%预算，佣金上调至15%引导站外流量\n\n💰 预算分配：\n• 日均投放预算：8.5万/天\n• 预计7天总投入：59.5万\n• 预期ROI：3.8\n\n📋 库存预警商家清单已生成（9家），建议安排小二48小时内完成补货对接。',
        evidence: ['流量投放方案', '库存预警商家清单'],
        actions: ['执行投放', '调整预算'],
        category: 'execution' as const,
      },
      {
        id: 'msg-d1-7',
        time: '15:30',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '投放方案确认，执行吧。另外把库存预警的补货任务派给对应小二。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d1-8',
        time: '15:32',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 已开始执行：\n\n1️⃣ A档15个链接流量投放已启动\n   • 主搜竞价已调整，推荐渠道人群包已上传\n\n2️⃣ 补货任务已创建并分发：\n   • 联系XX品牌报名全域直降 → 小二处理中\n   • YY商品提报淘秒爆品续期团 → 小二处理中\n\n📊 将持续监控投放效果，每4小时更新一次数据看板。',
        actions: ['查看投放数据', '查看子任务'],
        category: 'execution' as const,
      },
    ],
    lineage: {
      upstream: [
        { id: 't1', title: '爆款链接数打爆提升专项', status: 'inprogress', statusLabel: '执行中', owner: '焦进' },
      ],
      downstream: [
        { id: 't-x1', title: '联系XX品牌报名全域直降', status: 'todo', statusLabel: '待执行', owner: '血糖', createTime: '2026-04-21 11:00' },
        { id: 't-x2', title: 'YY商品提报淘秒爆品续期团', status: 'inprogress', statusLabel: '执行中', owner: '血糖', createTime: '2026-04-21 14:00' },
      ],
    },
    generatedFiles: [
      { id: 'f-d1-1', name: '3C数码潜力链接分级报告.xlsx', type: 'xlsx', size: '3.1 MB', createdAt: '04-20 15:20' },
      { id: 'f-d1-2', name: '流量投放方案_A档.docx', type: 'docx', size: '1.2 MB', createdAt: '04-20 15:28' },
      { id: 'f-d1-3', name: '库存预警商家清单.xlsx', type: 'xlsx', size: '680 KB', createdAt: '04-20 15:26' },
    ],
    executionMetrics: [
      { label: '出爆率', value: '22.0%', change: '+4.0pp', trend: 'up', updatedAt: '2小时前', action: 'A档链接集中投放', impact: 'A档15个链接中已有3个达到爆品标准' },
      { label: 'IPV增长', value: '+38.5%', change: '+38.5%', trend: 'up', updatedAt: '2小时前', action: '主搜竞价上调+推荐人群包优化', impact: 'A档链接日均IPV从28,600提升至39,611' },
      { label: 'CVR', value: '3.2%', change: '+0.4pp', trend: 'up', updatedAt: '2小时前', action: '标题关键词优化+主图A/B测试', impact: 'CVR从2.8%提升至3.2%，接近品类均值3.5%' },
      { label: '投放ROI', value: '3.6', change: '-0.2', trend: 'down', updatedAt: '2小时前', action: '流量预算消耗监控', impact: 'ROI略低于预期3.8，需持续优化人群定向' },
    ],
    executionDetails: [
      { category: 'A档链接', metric: '出爆数量', before: '0个', after: '3个', change: '+3', trend: 'up' },
      { category: 'A档链接', metric: '平均IPV', before: '28,600/天', after: '39,611/天', change: '+38.5%', trend: 'up' },
      { category: 'A档链接', metric: '平均CVR', before: '3.1%', after: '3.8%', change: '+0.7pp', trend: 'up' },
      { category: 'B档链接', metric: '平均IPV', before: '14,200/天', after: '16,800/天', change: '+18.3%', trend: 'up' },
      { category: 'B档链接', metric: '平均CVR', before: '2.4%', after: '2.6%', change: '+0.2pp', trend: 'up' },
      { category: 'C档链接', metric: '标题优化完成', before: '0/7', after: '5/7', change: '+71.4%', trend: 'up' },
      { category: '库存', metric: '预警链接补货', before: '0/9', after: '6/9', change: '+66.7%', trend: 'up' },
    ],
    conclusions: {
      mainCause: 'CVR偏低 + 流量获取效率不足，A档链接已见成效',
      recommendedAction: '继续加大A档投放力度，启动B档链接流量扶持',
      pendingConfirmation: 'B档链接投放方案待确认',
    },
  },
  't-d2': {
    overview: {
      goal: '家居日用品类60个潜力链接打爆，重点提升出爆率至25%以上',
      currentPhase: '待执行 - 选品分析阶段',
      nextStep: '完成60个潜力链接的分级评估，制定打爆执行计划',
      risk: '家居品类季节性波动大，需抓住换季窗口期',
    },
    contextMessages: [
      {
        id: 'msg-d2-0',
        time: '10:00',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '📋 您收到一项来自焦进的委派任务：\n\n━━━━━━━━━━━━━━━━━━━━\n🎯 任务：家居日用品类爆款打爆\n━━━━━━━━━━━━━━━━━━━━\n\n📊 任务背景：\n家居日用品类有60个潜力链接需要打爆，当前正值春夏换季窗口期，是打爆的最佳时机。\n\n🟢 执行策略：\n1️⃣ 分析家居品类市场趋势，锁定高潜子品类\n2️⃣ 60个潜力链接按子品类分组，评估打爆优先级\n3️⃣ 联合头部商家策划专题活动（预计联合5家）\n4️⃣ 集中流量投放，目标7天打爆周期\n\n📈 预期目标：\n• 出爆率 ≥ 25%（≥15个链接达到爆品标准）\n• 品类确收增长 +180万\n\n请确认是否开始执行？',
        actions: ['开始执行', '调整策略', '暂不执行'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-d2-0b',
        time: '10:02',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '收到，先帮我梳理一下市场趋势和消费者偏好再开始。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d2-1',
        time: '10:05',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '家居日用品类的爆款打爆任务我也看到了，60个潜力链接。先帮我梳理一下家居品类当前的市场趋势和消费者偏好，看看哪些子品类更有打爆机会。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d2-2',
        time: '10:08',
        role: 'agent' as const,
        roleName: '品类分析Agent',
        content: '家居日用品类市场趋势分析完成：\n\n📊 热门子品类（近30天搜索增长）：\n• 智能家居小电器：搜索+42%，转化率4.2%\n• 收纳整理用品：搜索+28%，转化率3.8%\n• 厨房小工具：搜索+22%，转化率3.5%\n• 家纺床品：搜索+15%，转化率2.9%\n\n🔥 换季窗口期：\n当前正值春夏换季，家纺轻薄类、驱蚊防晒类产品需求上升明显。\n\n建议优先从智能家居小电器和收纳整理品类中选品，出爆概率更高。',
        evidence: ['家居品类趋势报告', '搜索热度数据'],
        category: 'execution' as const,
      },
      {
        id: 'msg-d2-3',
        time: '10:12',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '趋势清楚了。把60个潜力链接按子品类分一下组，然后看看哪些商家可以配合做活动。特别是智能家居和收纳类的，能不能做一个专题活动？',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d2-4',
        time: '10:16',
        role: 'agent' as const,
        roleName: '品类分析Agent',
        content: '60个潜力链接分组完成：\n\n📦 子品类分布：\n• 智能家居小电器：18个链接，平均IPV 15,200\n• 收纳整理用品：14个链接，平均IPV 11,800\n• 厨房小工具：12个链接，平均IPV 9,500\n• 家纺床品：10个链接，平均IPV 8,200\n• 其他（清洁/卫浴）：6个链接\n\n🏪 可配合活动的商家：\n• 智能家居：3家头部商家愿意参与专题活动，预计投入30万\n• 收纳品类：2家品牌商家可做限时折扣\n\n专题活动建议：「春夏焕新·智能生活节」，联合5家头部商家，周期5天。',
        evidence: ['链接分组报告', '商家合作意向表'],
        actions: ['制定活动方案', '查看商家明细'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-d2-5',
        time: '10:20',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '分组和活动方向都不错。帮我先出一个执行计划，包括时间节点、资源需求和预期目标。等我确认后再正式启动。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d2-6',
        time: '10:25',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '执行计划已生成：\n\n━━━━━━━━━━━━━━━━━━━━\n📋 家居日用爆款打爆执行计划\n━━━━━━━━━━━━━━━━━━━━\n\n📅 阶段安排：\nD1-D2：完成选品确认+商家对接+活动页搭建\nD3-D5：「春夏焕新」专题活动上线，集中流量投放\nD6-D7：效果评估+二次优化\n\n💰 资源需求：\n• 流量预算：12万/天，共84万\n• 商家补贴：预计15万\n\n🎯 预期目标：\n• 出爆率：≥25%（≥15个链接达到爆品标准）\n• IPV增长：+40%\n• 品类确收增长：+180万\n\n待您确认后立即启动。',
        evidence: ['执行计划文档', '预算明细'],
        actions: ['确认启动', '调整计划'],
        category: 'judgment' as const,
      },
    ],
    lineage: {
      upstream: [
        { id: 't1', title: '爆款链接数打爆提升专项', status: 'inprogress', statusLabel: '执行中', owner: '焦进' },
      ],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-d2-1', name: '家居品类趋势分析报告.xlsx', type: 'xlsx', size: '2.6 MB', createdAt: '04-21 10:10' },
      { id: 'f-d2-2', name: '春夏焕新活动执行计划.docx', type: 'docx', size: '1.4 MB', createdAt: '04-21 10:25' },
    ],
    executionMetrics: [
      { label: '潜力链接数', value: '60个', change: '-', trend: 'neutral', updatedAt: '待启动', action: 'AI潜力评估筛选', impact: '从120个候选链接中筛选出60个高潜力目标' },
      { label: '商家配合率', value: '83%', change: '+12%', trend: 'up', updatedAt: '1天前', action: '商家沟通与邀约', impact: '50家商家中42家确认配合活动' },
      { label: '预估出爆率', value: '26%', change: '-', trend: 'neutral', updatedAt: '待启动', action: 'AI模型预测', impact: '基于历史数据，预估出爆率26%，高于目标25%' },
    ],
    executionDetails: [
      { category: '智能家居小电器', metric: '潜力链接数', before: '-', after: '18个', change: '-', trend: 'neutral' },
      { category: '智能家居小电器', metric: '平均IPV', before: '15,200/天', after: '待投放', change: '-', trend: 'neutral' },
      { category: '收纳整理用品', metric: '潜力链接数', before: '-', after: '14个', change: '-', trend: 'neutral' },
      { category: '厨房小工具', metric: '潜力链接数', before: '-', after: '12个', change: '-', trend: 'neutral' },
      { category: '家纺床品', metric: '潜力链接数', before: '-', after: '10个', change: '-', trend: 'neutral' },
      { category: '其他', metric: '潜力链接数', before: '-', after: '6个', change: '-', trend: 'neutral' },
    ],
    conclusions: {
      mainCause: '家居品类出爆率低于均值，选品覆盖不足+换季窗口期未充分利用',
      recommendedAction: '优先启动智能家居+收纳品类打爆，配合「春夏焕新」专题活动',
      pendingConfirmation: '执行计划待焦进D确认启动',
    },
  },
  't-d4': {
    overview: {
      goal: '联合服饰头部商家推出限时折扣活动，目标提升确收300万',
      currentPhase: '活动执行与效果追踪',
      nextStep: '评估首批商家活动效果，推动第二批商家上线',
      risk: '部分商家折扣力度不达预期，影响转化效果',
    },
    contextMessages: [
      {
        id: 'msg-d4-0',
        time: '16:00',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '📋 您收到一项来自焦进的委派任务：\n\n━━━━━━━━━━━━━━━━━━━━\n🎯 任务：服饰品类确收提升\n━━━━━━━━━━━━━━━━━━━━\n\n📊 任务背景：\n服饰品类确收存在300万GAP，需联合头部商家推出限时折扣活动来提升确收。\n\n🟢 执行策略：\n1️⃣ 分析服饰子品类确收GAP分布，锁定重点突破口\n2️⃣ 针对GAP最大的子品类，制定头部商家限时折扣方案\n3️⃣ 安排小二对接商家活动落地细节\n4️⃣ 实时监控活动效果，动态调整策略\n\n📈 预期目标：\n• 确收提升 300万\n• 头部商家活动参与率 ≥ 80%\n\n请确认是否开始执行？',
        actions: ['开始执行', '调整策略', '暂不执行'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-d4-0b',
        time: '16:05',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '确认，先帮我拉一下确收GAP分布数据。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d4-1',
        time: '16:10',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '服饰品类确收提升任务我来跟进。先帮我拉一下服饰品类的确收GAP分布，看看哪些子品类和商家是重点突破口。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d4-2',
        time: '16:13',
        role: 'agent' as const,
        roleName: '品类分析Agent',
        content: '服饰品类确收GAP分析完成：\n\n📊 子品类确收GAP分布（总GAP 300万）：\n• 女装：GAP 120万，达成率68%，为最大拖累项\n• 男装：GAP 65万，达成率75%\n• 运动户外：GAP 55万，达成率78%\n• 鞋靴箱包：GAP 38万，达成率82%\n• 内衣家居服：GAP 22万，达成率85%\n\n🏪 TOP10商家分析：\n• 头部商家A（女装）：确收下滑22%，库存积压严重，折扣意愿强\n• 头部商家B（运动）：确收持平，愿意加大投放\n• 头部商家C（男装）：确收下滑15%，需要沟通活动方案',
        evidence: ['服饰品类GAP分布表', 'TOP10商家确收数据'],
        category: 'execution' as const,
      },
      {
        id: 'msg-d4-3',
        time: '16:16',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '女装GAP最大，先从女装头部商家A入手。帮我制定一个限时折扣活动方案，要考虑折扣力度、活动周期、流量支持和预期效果。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d4-4',
        time: '16:20',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '女装头部商家A限时折扣活动方案：\n\n🎯 活动主题：「春装焕新·限时特惠」\n\n📋 方案详情：\n• 折扣力度：全场7折起，爆款5折限量秒杀\n• 活动周期：4月25日-4月30日（6天）\n• 参与SKU：精选120个高转化SKU\n\n📈 流量支持：\n• 首页推荐位：2个坑位，预计曝光UV 50万/天\n• 搜索加权：参与活动SKU搜索排名+20%\n• Push触达：目标人群Push 200万次\n\n💰 预期效果：\n• 预计带来确收+85万（占女装GAP的71%）\n• 预计UV转化率提升至5.2%（当前3.8%）\n• 商家清库存约30%积压SKU',
        evidence: ['活动方案详情', '预期效果测算'],
        actions: ['确认方案', '调整折扣力度'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-d4-5',
        time: '16:25',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '方案可以，确认执行。同时安排小二跟商家A对接活动细节。另外男装商家C那边也开始沟通，制定类似方案。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d4-6',
        time: '16:28',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 执行指令已接收：\n\n1️⃣ 女装商家A限时折扣活动\n   • 活动页面搭建中，预计2小时内完成\n   • 子任务已创建：服饰商家A限时折扣活动对接 → 小二跟进\n\n2️⃣ 男装商家C沟通\n   • 招商Agent正在制定男装活动方案\n   • 预计明日上午完成方案并发送至商家\n\n📊 活动上线后将实时监控确收数据，每2小时更新执行看板。',
        actions: ['查看活动页', '查看子任务'],
        category: 'execution' as const,
      },
      {
        id: 'msg-d4-7',
        time: '18:30',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '📊 首日活动数据速报：\n\n女装商家A限时折扣活动（上线3小时）：\n• 活动页UV：12.8万\n• 成交订单：3,200单\n• 确收GMV：28.5万\n• 转化率：4.8%（高于预期）\n\n🔥 爆款5折秒杀SKU已售罄2个，建议商家紧急补货。\n运动品类商家B也表达了参与意愿，是否纳入活动？',
        evidence: ['实时活动数据', '商家反馈'],
        actions: ['纳入商家B', '暂不扩展'],
        category: 'execution' as const,
      },
      {
        id: 'msg-d4-8',
        time: '18:35',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '数据不错！商家B纳入进来，运动品类也需要补确收。让小二把商家B的活动也跟上。',
        category: 'instruction' as const,
      },
    ],
    lineage: {
      upstream: [
        { id: 't2', title: '核心品类确收冲刺计划', status: 'inprogress', statusLabel: '执行中', owner: '焦进' },
      ],
      downstream: [
        { id: 't-x3', title: '服饰商家A限时折扣活动对接', status: 'inprogress', statusLabel: '执行中', owner: '血糖', createTime: '2026-04-21 15:30' },
      ],
    },
    generatedFiles: [
      { id: 'f-d4-1', name: '服饰品类确收GAP分析.xlsx', type: 'xlsx', size: '2.2 MB', createdAt: '04-20 16:15' },
      { id: 'f-d4-2', name: '女装商家A限时折扣方案.docx', type: 'docx', size: '1.5 MB', createdAt: '04-20 16:22' },
      { id: 'f-d4-3', name: '活动效果实时监控报表.xlsx', type: 'xlsx', size: '890 KB', createdAt: '04-20 18:30' },
    ],
    executionMetrics: [
      { label: '确收增长', value: '+128万', change: '+128万', trend: 'up', updatedAt: '30分钟前', action: '女装商家A限时折扣活动上线', impact: '女装品类确收增加85万，运动品类增加43万' },
      { label: '活动转化率', value: '4.8%', change: '+1.0pp', trend: 'up', updatedAt: '30分钟前', action: '爆款5折秒杀+首页推荐位', impact: '活动页转化率从3.8%提升至4.8%' },
      { label: '参与商家', value: '8家', change: '+3家', trend: 'up', updatedAt: '30分钟前', action: '招商Agent定向邀约', impact: '新增运动品类商家B等3家参与活动' },
      { label: '确收GAP', value: '172万', change: '-128万', trend: 'down', updatedAt: '30分钟前', action: '多品类联动促销', impact: 'GAP从300万缩小至172万，完成率57%' },
    ],
    executionDetails: [
      { category: '女装', metric: '确收GMV', before: '480万', after: '565万', change: '+17.7%', trend: 'up' },
      { category: '女装', metric: '活动参与SKU', before: '0', after: '120个', change: '+120', trend: 'up' },
      { category: '女装', metric: '转化率', before: '3.8%', after: '4.8%', change: '+1.0pp', trend: 'up' },
      { category: '运动户外', metric: '确收GMV', before: '220万', after: '263万', change: '+19.5%', trend: 'up' },
      { category: '男装', metric: '商家沟通', before: '未启动', after: '方案沟通中', change: '-', trend: 'neutral' },
      { category: '整体', metric: '确收GAP', before: '300万', after: '172万', change: '-42.7%', trend: 'down' },
    ],
    conclusions: {
      mainCause: '服饰头部商家活动参与率低 + 折扣力度不足导致转化率偏低',
      recommendedAction: '持续扩大活动商家覆盖，推动男装商家C上线活动',
      pendingConfirmation: '男装商家C活动方案待商家确认',
    },
  },
  't-d5': {
    overview: {
      goal: '排查本周投流托管消耗异常下降的TOP10商家，定位原因并修复',
      currentPhase: '已完成',
      nextStep: '持续监控修复后的商家消耗数据',
      risk: '无（已完成修复）',
    },
    contextMessages: [
      {
        id: 'msg-d5-1',
        time: '16:05',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '帮我排查一下本周投流托管消耗异常下降的商家，看看TOP10商家消耗下滑的原因是什么。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d5-2',
        time: '16:08',
        role: 'agent' as const,
        roleName: '数据分析Agent',
        content: '投流托管消耗异常排查完成：\n\n📉 TOP10消耗下滑商家（本周 vs 上周）：\n\n1. 商家甲（3C数码）：消耗-45%，原因：预算被手动调低\n2. 商家乙（家电）：消耗-38%，原因：ROI触发熔断，自动暂停投放\n3. 商家丙（美妆）：消耗-35%，原因：主推商品下架\n4. 商家丁（食品）：消耗-32%，原因：人群包过期未更新\n5. 商家戊（服饰）：消耗-28%，原因：竞价被竞品压制\n6-10. 其余5家：消耗下降15%-25%，多为季节性波动\n\n⚠️ 核心问题：\n• 3家商家为系统/配置问题（可立即修复）\n• 2家为商家主动调整（需沟通恢复）\n• 5家为市场因素（需策略优化）',
        evidence: ['消耗异常排查表', '商家投放配置明细'],
        category: 'execution' as const,
      },
      {
        id: 'msg-d5-3',
        time: '16:12',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '好的，系统配置问题的3家先立即修复。商家主动调整的2家帮我分析一下原因，看能不能引导恢复消耗。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d5-4',
        time: '16:16',
        role: 'agent' as const,
        roleName: '投流Agent',
        content: '修复与分析进展：\n\n✅ 系统问题已修复（3家）：\n• 商家乙：ROI熔断阈值已调整，投放已恢复\n• 商家丙：替代商品已上架并关联投放计划\n• 商家丁：人群包已更新，投放已重启\n\n📋 商家主动调整分析（2家）：\n• 商家甲：因Q2预算紧缩主动降低投放，建议提供ROI保障方案引导恢复\n• 商家戊：因竞品平台给予更高流量扶持转移预算，建议匹配竞品政策\n\n预计修复后可恢复消耗约85万/周。',
        evidence: ['修复操作记录', '商家沟通分析'],
        actions: ['导出报告', '生成沟通话术'],
        category: 'execution' as const,
      },
      {
        id: 'msg-d5-5',
        time: '16:20',
        role: 'user' as const,
        roleName: '焦进D-尚赞',
        content: '修复结果不错。帮我生成一份完整的排查报告，包括问题商家清单、原因分析和修复措施，我需要汇报给焦进。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-d5-6',
        time: '16:24',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 排查报告已生成：\n\n━━━━━━━━━━━━━━━━━━━━\n📋 投流托管消耗异常排查报告\n━━━━━━━━━━━━━━━━━━━━\n\n🔍 排查结果：\n• 排查商家数：TOP10\n• 系统问题：3家，已全部修复\n• 商家主动调整：2家，已制定恢复方案\n• 市场因素：5家，已优化投放策略\n\n💰 影响与恢复：\n• 本周消耗损失：约210万\n• 已恢复消耗：约85万/周\n• 剩余GAP：约125万/周（需持续跟进）\n\n报告文件已生成，可直接下载。',
        evidence: ['排查报告完整版'],
        actions: ['下载报告', '发送给焦进'],
        category: 'file' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-d5-1', name: '投流托管消耗异常排查报告.xlsx', type: 'xlsx', size: '1.8 MB', createdAt: '04-18 16:24' },
      { id: 'f-d5-2', name: '商家消耗恢复方案.docx', type: 'docx', size: '920 KB', createdAt: '04-18 16:22' },
      { id: 'f-d5-3', name: '投放配置修复记录.pdf', type: 'pdf', size: '450 KB', createdAt: '04-18 16:18' },
    ],
    executionMetrics: [
      { label: '排查商家数', value: '10家', change: '-', trend: 'neutral', updatedAt: '已完成', action: '全量排查TOP10异常商家', impact: '覆盖消耗下滑最严重的10家商家' },
      { label: '已修复商家', value: '8家', change: '+8', trend: 'up', updatedAt: '已完成', action: '系统修复+策略调整', impact: '8家商家投放已恢复或优化' },
      { label: '恢复消耗', value: '85万/周', change: '+85万', trend: 'up', updatedAt: '已完成', action: '投放配置修复+人群包更新', impact: '预计每周恢复消耗85万，月度贡献340万' },
      { label: '待跟进', value: '2家', change: '-', trend: 'neutral', updatedAt: '已完成', action: '商家沟通引导', impact: '商家甲和商家戊需持续沟通恢复预算' },
    ],
    executionDetails: [
      { category: '系统问题', metric: '商家乙-ROI熔断', before: '消耗暂停', after: '投放恢复', change: '+38%', trend: 'up' },
      { category: '系统问题', metric: '商家丙-商品下架', before: '消耗暂停', after: '替代商品上架', change: '+35%', trend: 'up' },
      { category: '系统问题', metric: '商家丁-人群包过期', before: '消耗-32%', after: '投放恢复', change: '+32%', trend: 'up' },
      { category: '商家调整', metric: '商家甲-预算紧缩', before: '消耗-45%', after: 'ROI保障方案沟通中', change: '待恢复', trend: 'neutral' },
      { category: '商家调整', metric: '商家戊-竞品转移', before: '消耗-28%', after: '竞品匹配政策制定中', change: '待恢复', trend: 'neutral' },
      { category: '市场因素', metric: '5家商家策略优化', before: '消耗-15~25%', after: '投放策略已优化', change: '+18%', trend: 'up' },
    ],
    conclusions: {
      mainCause: '系统配置异常（ROI熔断/商品下架/人群包过期） + 商家主动降预算',
      recommendedAction: '已完成系统修复，持续跟进2家商家预算恢复',
      pendingConfirmation: '无（已完成）',
    },
  },
  't-x1': {
    overview: {
      goal: '推动XX品牌报名百亿补贴-全域直降活动，确保价格达标并锁定活动资源位',
      currentPhase: '待启动',
      nextStep: '联系XX品牌BD确认活动参与意向',
      risk: '品牌方可能因利润空间不足拒绝降价',
    },
    contextMessages: [
      {
        id: 'msg-x1-1',
        time: '11:00',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '📋 任务下发通知：\n\n您有一条新的执行任务——「联系XX品牌报名全域直降」。\n\n🎯 目标：推动XX品牌3款核心SKU报名百亿补贴-全域直降活动\n📅 活动时间：4月25日-5月1日\n💰 价格要求：到手价需低于竞品平台5%以上\n\n请在今日内联系品牌BD确认参与意向。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x1-2',
        time: '11:05',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '收到，我先查一下XX品牌目前在各平台的价格情况，再联系BD谈判。能帮我拉一下XX品牌TOP3 SKU的全网比价数据吗？',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x1-3',
        time: '11:08',
        role: 'agent' as const,
        roleName: '场景导购Agent',
        content: '已为您查询XX品牌TOP3 SKU全网比价数据：\n\n📊 SKU-A（XX降噪耳机Pro）：\n• 我方现价：¥1,299 | 京东：¥1,249 | 拼多多：¥1,199\n• 建议到手价：¥1,149（低于竞品5.2%）\n\n📊 SKU-B（XX无线充电器）：\n• 我方现价：¥299 | 京东：¥279 | 拼多多：¥269\n• 建议到手价：¥255（低于竞品5.2%）\n\n📊 SKU-C（XX智能手表S3）：\n• 我方现价：¥1,899 | 京东：¥1,849 | 拼多多：¥1,799\n• 建议到手价：¥1,709（低于竞品5.0%）',
        evidence: ['全网比价数据表', '历史促销价格记录'],
        category: 'execution' as const,
      },
      {
        id: 'msg-x1-4',
        time: '11:15',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '好的，价格差距还挺大的。我现在联系XX品牌BD张经理，看看他们能接受多大的降价幅度。另外帮我查下XX品牌上个月在我们平台的GMV和流量数据，谈判的时候可以用。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x1-5',
        time: '11:18',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '已查询XX品牌上月平台数据：\n\n📈 整体表现：\n• 月GMV：328.5万，环比+12.3%\n• 月UV：86.2万，环比+8.7%\n• 转化率：3.8%，高于品类均值0.5pp\n• 客单价：¥1,245\n\n💡 谈判建议：\n1. 强调平台流量扶持：报名全域直降可获得首页资源位曝光，预估UV提升50%+\n2. 算账给品牌看：降价15%但UV提升50%+转化率提升，整体GMV预计增长30%\n3. 备选方案：如品牌无法接受全面降价，可建议先选1款SKU试水',
        evidence: ['品牌月度数据报表', '活动效果预估模型'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-x1-6',
        time: '14:30',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '刚和张经理通完电话。他说降噪耳机Pro可以降到1,149，但无线充电器和智能手表要回去和产品线确认，预计明天给答复。我先把耳机的活动信息录入系统了。',
        category: 'execution' as const,
      },
    ],
    lineage: {
      upstream: [
        { id: 't-d1', title: '3C数码品类爆款链接打爆', status: 'inprogress', statusLabel: '执行中', owner: '尚赞' },
      ],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-x1-1', name: 'XX品牌全网比价分析.xlsx', type: 'xlsx', size: '1.2 MB', createdAt: '04-21 11:08' },
      { id: 'f-x1-2', name: 'XX品牌活动报名表.docx', type: 'docx', size: '580 KB', createdAt: '04-21 14:35' },
    ],
    executionMetrics: [
      { label: '品牌确认SKU数', value: '1/3', change: '+1', trend: 'up' as const, updatedAt: '3小时前', action: '电话沟通品牌BD', impact: '耳机Pro已确认参与，到手价1,149元' },
      { label: '预估活动GMV增量', value: '+42万', change: '+42万', trend: 'up' as const, updatedAt: '3小时前', action: '基于历史活动数据预估', impact: '单SKU参与全域直降预估GMV提升42万' },
      { label: '价格竞争力', value: '低于竞品5.2%', change: '-150元', trend: 'down' as const, updatedAt: '3小时前', action: '全域直降价格调整', impact: '到手价1,149元，低于拼多多50元' },
    ],
    executionDetails: [
      { category: 'SKU-A 降噪耳机Pro', metric: '到手价', before: '¥1,299', after: '¥1,149', change: '-11.5%', trend: 'down' as const },
      { category: 'SKU-A 降噪耳机Pro', metric: '对比京东', before: '高¥50', after: '低¥100', change: '价格反超', trend: 'up' as const },
      { category: 'SKU-A 降噪耳机Pro', metric: '预估UV增量', before: '2.8万/日', after: '4.2万/日', change: '+50%', trend: 'up' as const },
      { category: 'SKU-B 无线充电器', metric: '状态', before: '未报名', after: '待确认', change: '沟通中', trend: 'neutral' as const },
      { category: 'SKU-C 智能手表S3', metric: '状态', before: '未报名', after: '待确认', change: '沟通中', trend: 'neutral' as const },
    ],
    conclusions: {
      mainCause: 'XX品牌原价高于竞品平台，需通过全域直降拉平价差',
      recommendedAction: '持续跟进品牌BD，争取剩余2款SKU在明日内确认报名',
      pendingConfirmation: '无线充电器和智能手表的降价幅度待品牌方确认',
    },
  },
  't-x2': {
    overview: {
      goal: '推动YY商品完成淘宝秒杀-爆品续期团提报，确保通过审核并上线',
      currentPhase: '提报审核中',
      nextStep: '跟进审核结果，协调商家补充资质材料',
      risk: '商家库存可能不足以支撑活动预期销量',
    },
    contextMessages: [
      {
        id: 'msg-x2-1',
        time: '11:30',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '📋 任务下发通知：\n\n「YY商品提报淘秒爆品续期团」已分配给您。\n\n🎯 目标：推动YY品牌旗舰店3款热销商品提报淘宝秒杀-爆品续期团\n📅 活动排期：第17周（4月28日-5月4日）\n💰 价格要求：秒杀价需为近30天最低价的95折\n📦 库存要求：单SKU备货不低于5000件',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x2-2',
        time: '11:35',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '收到。我先拉一下YY品牌这3款商品的近30天价格走势和库存情况，确认是否满足提报条件。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x2-3',
        time: '11:40',
        role: 'agent' as const,
        roleName: '场景导购Agent',
        content: '已查询YY品牌3款商品数据：\n\n📊 YY-SKU-1（无线蓝牙耳机）：\n• 近30天最低价：¥189 → 秒杀价需≤¥179.5\n• 当前库存：8,200件 ✅\n• 近7天日均销量：320件\n\n📊 YY-SKU-2（运动手环）：\n• 近30天最低价：¥129 → 秒杀价需≤¥122.5\n• 当前库存：6,500件 ✅\n• 近7天日均销量：180件\n\n📊 YY-SKU-3（便携音箱）：\n• 近30天最低价：¥259 → 秒杀价需≤¥246.0\n• 当前库存：3,800件 ⚠️ 低于5000件要求\n• 近7天日均销量：95件\n\n⚠️ YY-SKU-3库存不足，需商家补货。',
        evidence: ['商品价格走势图', '实时库存数据'],
        category: 'execution' as const,
      },
      {
        id: 'msg-x2-4',
        time: '11:50',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '好的，SKU-1和SKU-2可以直接提报。SKU-3库存不够，我联系商家看能不能紧急补货。同时先把前两个提报上去。',
        category: 'execution' as const,
      },
      {
        id: 'msg-x2-5',
        time: '14:00',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '📋 提报状态更新：\n\n✅ YY-SKU-1（无线蓝牙耳机）：已提报，秒杀价¥179，等待审核\n✅ YY-SKU-2（运动手环）：已提报，秒杀价¥122，等待审核\n⏳ YY-SKU-3（便携音箱）：待商家补货确认\n\n审核预计24小时内出结果，我会持续跟进。',
        evidence: ['提报记录截图', '审核队列状态'],
        actions: ['查看提报详情', '催审'],
        category: 'execution' as const,
      },
      {
        id: 'msg-x2-6',
        time: '15:20',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '商家反馈SKU-3可以在26号前补货到5500件，但需要我们协调仓储资源优先入库。能帮我看下仓储那边的排期吗？',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x2-7',
        time: '15:25',
        role: 'agent' as const,
        roleName: '场景导购Agent',
        content: '已查询仓储排期：\n\n🏭 菜鸟仓-华东1号仓：\n• 当前入库排期：4月25日有空闲档位\n• 预计入库时效：1-2个工作日\n• 可承接数量：8000件以内\n\n✅ 可以安排4月25日优先入库，26号前完成上架。建议立即与商家确认发货计划。',
        evidence: ['仓储排期表'],
        category: 'execution' as const,
      },
      {
        id: 'msg-x2-8',
        time: '16:00',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '已和商家确认，25号发货到华东仓，预计26号完成入库。等库存到位后立即提报SKU-3。先盯着前两个SKU的审核结果。',
        category: 'execution' as const,
      },
    ],
    lineage: {
      upstream: [
        { id: 't-d1', title: '3C数码品类爆款链接打爆', status: 'inprogress', statusLabel: '执行中', owner: '尚赞' },
      ],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-x2-1', name: 'YY商品淘秒提报表.xlsx', type: 'xlsx', size: '890 KB', createdAt: '04-21 14:00' },
      { id: 'f-x2-2', name: '爆品续期团活动排期.pdf', type: 'pdf', size: '1.3 MB', createdAt: '04-21 11:40' },
    ],
    executionMetrics: [
      { label: '提报通过率', value: '2/3', change: '+2', trend: 'up' as const, updatedAt: '2小时前', action: '完成SKU-1和SKU-2提报', impact: '2款商品已进入审核流程' },
      { label: '预估秒杀GMV', value: '+28.6万', change: '+28.6万', trend: 'up' as const, updatedAt: '2小时前', action: '基于历史秒杀数据预估', impact: '3款商品秒杀期间预估GMV 28.6万' },
      { label: '商家备货进度', value: '2/3完成', change: '+2', trend: 'up' as const, updatedAt: '1小时前', action: '协调商家备货和仓储入库', impact: 'SKU-3预计26号完成补货入库' },
      { label: '秒杀价降幅', value: '平均5.2%', change: '-5.2%', trend: 'down' as const, updatedAt: '2小时前', action: '协商秒杀价格', impact: '3款商品平均降价5.2%，满足提报要求' },
    ],
    executionDetails: [
      { category: 'YY-SKU-1 无线蓝牙耳机', metric: '秒杀价', before: '¥189', after: '¥179', change: '-5.3%', trend: 'down' as const },
      { category: 'YY-SKU-1 无线蓝牙耳机', metric: '提报状态', before: '未提报', after: '审核中', change: '已提交', trend: 'up' as const },
      { category: 'YY-SKU-2 运动手环', metric: '秒杀价', before: '¥129', after: '¥122', change: '-5.4%', trend: 'down' as const },
      { category: 'YY-SKU-2 运动手环', metric: '提报状态', before: '未提报', after: '审核中', change: '已提交', trend: 'up' as const },
      { category: 'YY-SKU-3 便携音箱', metric: '库存', before: '3,800件', after: '5,500件(预计)', change: '+44.7%', trend: 'up' as const },
      { category: 'YY-SKU-3 便携音箱', metric: '提报状态', before: '未提报', after: '待补货', change: '等待中', trend: 'neutral' as const },
    ],
    conclusions: {
      mainCause: 'YY商品秒杀提报需满足价格和库存双重门槛，SKU-3库存不足是当前卡点',
      recommendedAction: '持续跟进前2个SKU审核结果，26号补货到位后立即提报SKU-3',
      pendingConfirmation: 'SKU-3仓储入库时效及提报审核结果',
    },
  },
  't-x3': {
    overview: {
      goal: '与服饰商家A对接限时折扣活动，确认折扣力度和参与商品，推动活动上线',
      currentPhase: '活动方案确认中',
      nextStep: '确认最终参与商品清单和折扣梯度',
      risk: '商家A部分商品库存偏低，可能影响活动效果',
    },
    contextMessages: [
      {
        id: 'msg-x3-1',
        time: '14:00',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '📋 任务下发通知：\n\n「服饰商家A限时折扣活动对接」已分配给您。\n\n🎯 目标：联动服饰商家A推出限时折扣活动，提升服饰品类确收\n📅 活动时间：4月26日-4月30日（5天）\n💰 折扣要求：全场7-8折，部分爆款5折起\n📦 参与商品：不少于50款SKU\n\n商家A为服饰品类TOP3商家，上月GMV 186万。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x3-2',
        time: '14:10',
        role: 'user' as const,
        roleName: '一线小二-小丽',
        content: '收到任务。我先看下商家A目前的店铺数据和历史活动参与情况，然后联系他们的运营负责人。帮我拉一下商家A的店铺诊断数据吧。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x3-3',
        time: '14:15',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '已查询商家A店铺诊断数据：\n\n🏪 商家A - XX服饰旗舰店：\n• 上月GMV：186万，环比-8.2%\n• 店铺评分：4.85分（行业TOP10%）\n• 月UV：52.3万，环比-5.1%\n• 转化率：3.56%，高于品类均值0.8pp\n• 退货率：12.3%，低于品类均值3pp\n\n📊 历史活动参与：\n• 上次参与限时折扣：3月15日，期间GMV提升220%\n• 活动投入产出比：1:5.8\n\n💡 建议：商家A店铺质量优秀，历史活动ROI高，值得重点投入资源位支持。',
        evidence: ['店铺诊断报告', '历史活动数据'],
        category: 'execution' as const,
      },
      {
        id: 'msg-x3-4',
        time: '14:45',
        role: 'user' as const,
        roleName: '一线小二-小丽',
        content: '数据不错，上次活动效果很好。我刚联系了商家A的运营总监李姐，她很感兴趣但有几个顾虑：\n1. 5折力度太大，利润扛不住\n2. 部分春装库存已经不多了\n3. 想要更多的首页曝光资源\n\n我跟她初步沟通了一下，她愿意出30款8折商品+10款6折商品，但5折只能出5款清仓款。你觉得这个方案可以吗？',
        category: 'judgment' as const,
      },
      {
        id: 'msg-x3-5',
        time: '14:50',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '基于商家A的方案，我做了一个GMV预估：\n\n📊 方案效果预估：\n• 30款8折商品：预估期间GMV 38万（占比52%）\n• 10款6折商品：预估期间GMV 25万（占比34%）\n• 5款5折商品：预估期间GMV 10万（占比14%）\n• 合计预估GMV：73万（5天）\n\n🆚 对比目标：\n• 任务目标确收：80万\n• 当前方案差距：-7万（-8.8%）\n\n💡 建议：\n1. 可以接受8折+6折的方案组合\n2. 建议增加5-8款6折商品弥补差距\n3. 承诺给予搜索加权+首页资源位作为交换\n4. 5折清仓款可作为引流品，拉动店铺整体流量',
        evidence: ['活动GMV预估模型', '流量资源排期'],
        actions: ['调整方案', '确认方案'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-x3-6',
        time: '15:30',
        role: 'user' as const,
        roleName: '一线小二-小丽',
        content: '我再和李姐沟通了一轮，最终方案确认：\n- 30款8折商品\n- 15款6折商品（增加了5款夏季新品）\n- 5款5折清仓款\n- 我们给首页资源位3天+搜索加权5天\n\n李姐同意了，预估GMV可以到82万，超过目标。我现在开始录入活动商品信息。',
        category: 'execution' as const,
      },
      {
        id: 'msg-x3-7',
        time: '16:20',
        role: 'agent' as const,
        roleName: '投流Agent',
        content: '已为本次限时折扣活动配置流量支持方案：\n\n📡 流量配置：\n• 搜索加权：4月26日-30日，权重+15%\n• 首页资源位：4月26日-28日，Banner位+腰部坑位\n• 推荐流量：猜你喜欢频道增加曝光权重\n\n预计为商家A带来额外UV 12万/天，较日常提升约23%。',
        evidence: ['流量配置方案', '资源位排期表'],
        category: 'execution' as const,
      },
      {
        id: 'msg-x3-8',
        time: '17:00',
        role: 'user' as const,
        roleName: '一线小二-小丽',
        content: '活动商品信息已全部录入完成，共50款SKU。等明天上午活动审核通过就可以上线了。流量配置也确认没问题，辛苦了！',
        category: 'execution' as const,
      },
    ],
    lineage: {
      upstream: [
        { id: 't-d4', title: '服饰品类确收提升', status: 'inprogress', statusLabel: '执行中', owner: '尚赞' },
      ],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-x3-1', name: '商家A限时折扣活动方案.docx', type: 'docx', size: '1.5 MB', createdAt: '04-21 15:30' },
      { id: 'f-x3-2', name: '活动商品清单及折扣明细.xlsx', type: 'xlsx', size: '2.1 MB', createdAt: '04-21 17:00' },
    ],
    executionMetrics: [
      { label: '活动商品数', value: '50款', change: '+50', trend: 'up' as const, updatedAt: '1小时前', action: '与商家A确认活动方案', impact: '50款SKU参与限时折扣，覆盖商家A核心品类' },
      { label: '预估活动GMV', value: '82万', change: '+82万', trend: 'up' as const, updatedAt: '1小时前', action: '活动方案优化至15款6折商品', impact: '超额完成目标2万，预估ROI 1:5.5' },
      { label: '资源位配置', value: '3天Banner+5天搜索加权', change: '已配置', trend: 'up' as const, updatedAt: '2小时前', action: '协调流量侧配置资源位', impact: '预计带来额外UV 12万/天' },
      { label: '平均折扣力度', value: '7.3折', change: '-27%', trend: 'down' as const, updatedAt: '1小时前', action: '谈判确认折扣梯度', impact: '8折+6折+5折组合，平均折扣7.3折' },
    ],
    executionDetails: [
      { category: '8折商品', metric: '参与SKU数', before: '0', after: '30款', change: '+30', trend: 'up' as const },
      { category: '8折商品', metric: '预估GMV', before: '0', after: '38万', change: '+38万', trend: 'up' as const },
      { category: '6折商品', metric: '参与SKU数', before: '0', after: '15款', change: '+15', trend: 'up' as const },
      { category: '6折商品', metric: '预估GMV', before: '0', after: '30万', change: '+30万', trend: 'up' as const },
      { category: '5折清仓', metric: '参与SKU数', before: '0', after: '5款', change: '+5', trend: 'up' as const },
      { category: '5折清仓', metric: '预估GMV', before: '0', after: '14万', change: '+14万', trend: 'up' as const },
      { category: '流量支持', metric: '日均额外UV', before: '0', after: '12万/天', change: '+23%', trend: 'up' as const },
    ],
    conclusions: {
      mainCause: '服饰品类确收不足，需头部商家参与限时折扣拉动GMV',
      recommendedAction: '活动上线后持续监控转化数据，根据实时表现动态调整资源位分配',
      pendingConfirmation: '活动审核结果（预计4月22日上午出结果）',
    },
  },
  't-x4': {
    overview: {
      goal: '查询商品A的竞品平台价格，分析价格竞争力并给出调价建议',
      currentPhase: '已完成',
      nextStep: '无（任务已完成，调价建议已提交）',
      risk: '无',
    },
    contextMessages: [
      {
        id: 'msg-x4-1',
        time: '10:00',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '帮我查一下商品A（SKU: 3C-HEADPHONE-PRO-001）在京东、拼多多、抖音商城的当前售价和近7天价格走势。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x4-2',
        time: '10:02',
        role: 'agent' as const,
        roleName: '场景导购Agent',
        content: '已查询商品A全网价格数据：\n\n📊 商品A - XX降噪耳机Pro（SKU: 3C-HEADPHONE-PRO-001）\n\n| 平台 | 当前售价 | 7日最低 | 7日最高 | 券后价 |\n|------|---------|---------|---------|--------|\n| 天猫（我方） | ¥1,299 | ¥1,299 | ¥1,299 | ¥1,279 |\n| 京东 | ¥1,249 | ¥1,199 | ¥1,299 | ¥1,199 |\n| 拼多多 | ¥1,199 | ¥1,159 | ¥1,239 | ¥1,159 |\n| 抖音商城 | ¥1,269 | ¥1,219 | ¥1,299 | ¥1,219 |\n\n⚠️ 我方价格在所有平台中最高，与拼多多差距达¥100（7.7%）。',
        evidence: ['全网价格监控数据', '7日价格走势图'],
        category: 'execution' as const,
      },
      {
        id: 'msg-x4-3',
        time: '10:05',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '差距还挺大的。能帮我分析下如果我们降到1,199会对利润有多大影响吗？另外这款商品近30天的销售数据也拉一下。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x4-4',
        time: '10:08',
        role: 'agent' as const,
        roleName: '场景导购Agent',
        content: '综合分析结果如下：\n\n📈 近30天销售数据：\n• 销量：1,280件，环比-15.3%\n• GMV：166.3万，环比-15.3%\n• 日均销量：42.7件/天\n• 转化率：2.8%，低于品类均值3.5%\n\n💰 降价影响测算（降至¥1,199）：\n• 单件利润影响：-¥100（从¥220降至¥120）\n• 预估转化率提升：2.8% → 3.8%（+1.0pp）\n• 预估日均销量：42.7 → 62.5件（+46.4%）\n• 预估月GMV：166.3万 → 224.8万（+35.2%）\n• 预估月利润：从28.2万 → 22.5万（-20.2%）\n\n⚠️ 降价后GMV提升但利润下降，建议采用阶梯策略：\n1. 全域直降到¥1,199抢市场份额\n2. 申请平台补贴弥补部分利润差\n3. 通过关联销售提升客单价',
        evidence: ['销售数据报表', '利润影响测算模型', '竞品价格趋势'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-x4-5',
        time: '10:15',
        role: 'user' as const,
        roleName: '一线小二-小明',
        content: '分析很详细，方案可行。帮我把这个竞品分析报告整理成文档，我要提交给焦进D审批调价方案。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-x4-6',
        time: '10:18',
        role: 'agent' as const,
        roleName: '场景导购Agent',
        content: '✅ 竞品价格分析报告已生成并保存：\n\n📄 文件：「商品A竞品价格分析及调价建议.xlsx」\n\n报告包含：\n1. 全网价格对比明细\n2. 7日/30日价格走势图表\n3. 降价影响测算（多梯度方案）\n4. 调价建议和预期效果\n\n已发送至您的工作台，可随时下载查看。',
        evidence: ['竞品价格分析报告'],
        actions: ['下载报告', '发送给焦进D'],
        category: 'file' as const,
      },
    ],
    lineage: {
      upstream: [
        { id: 't-d1', title: '3C数码品类爆款链接打爆', status: 'inprogress', statusLabel: '执行中', owner: '尚赞' },
      ],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-x4-1', name: '商品A竞品价格分析及调价建议.xlsx', type: 'xlsx', size: '3.2 MB', createdAt: '04-20 10:18' },
    ],
    executionMetrics: [
      { label: '价格竞争力排名', value: '第4/4', change: '最高价', trend: 'down' as const, updatedAt: '已完成', action: '全网比价分析', impact: '我方售价¥1,299为全网最高，与最低价差¥100' },
      { label: '建议调价幅度', value: '-7.7%', change: '-¥100', trend: 'down' as const, updatedAt: '已完成', action: '竞品价格分析', impact: '建议降至¥1,199与拼多多持平' },
      { label: '预估GMV增量', value: '+35.2%', change: '+58.5万/月', trend: 'up' as const, updatedAt: '已完成', action: '降价效果测算', impact: '月GMV预估从166.3万提升至224.8万' },
    ],
    executionDetails: [
      { category: '价格对比', metric: '天猫（我方）', before: '¥1,299', after: '¥1,199（建议）', change: '-7.7%', trend: 'down' as const },
      { category: '价格对比', metric: '京东', before: '-', after: '¥1,249', change: '高于我方¥50', trend: 'neutral' as const },
      { category: '价格对比', metric: '拼多多', before: '-', after: '¥1,199', change: '与我方持平', trend: 'neutral' as const },
      { category: '价格对比', metric: '抖音商城', before: '-', after: '¥1,269', change: '高于我方¥70', trend: 'neutral' as const },
      { category: '效果预估', metric: '月GMV', before: '166.3万', after: '224.8万', change: '+35.2%', trend: 'up' as const },
      { category: '效果预估', metric: '月利润', before: '28.2万', after: '22.5万', change: '-20.2%', trend: 'down' as const },
      { category: '效果预估', metric: '转化率', before: '2.8%', after: '3.8%', change: '+1.0pp', trend: 'up' as const },
    ],
    conclusions: {
      mainCause: '商品A在天猫售价全网最高，价差达7.7%导致转化率低于品类均值',
      recommendedAction: '建议通过全域直降至¥1,199+申请平台补贴+关联销售组合策略调整价格',
      pendingConfirmation: '无（报告已提交，等待焦进D审批调价方案）',
    },
  },
  't-pc1': {
    strategyContext: {
      title: '确收增长突破策略',
      cause: '爆款链接数达成率仅65%，出爆率低于行业均值，主要原因为潜力品挖掘不足、打爆周期过长。',
      solution: '加大潜力链接挖掘力度，优化打爆节奏，重点攻坚Top品类。',
      status: 'pending_confirm' as const,
      detailKey: 's1',
    },
    progressSteps: [
      { name: '潜力链接筛选池构建', agent: '数据分析Agent', description: '乳饮冲调/家清/个人护理类目潜力链接筛选池构建（从近30天日均GMV≥5000元、订单≥50单的商品中筛选符合打爆标准的候选品，输出目标清单）' },
      { name: '流失爆品补位引入', agent: '供应链Agent', description: '流失爆品下架补位商品引入（针对电器数码/乳饮冲调下架的1146个爆品，从现货率≥92%的下游商品池中捞取补位品，完成上新）' },
      { name: '缩短打爆周期执行', agent: '运营Agent', description: '缩短打爆周期执行（将新品打爆周期从30天压缩至26天，前7天私域孵化+强控低价+淘客跑量，15天后叠加活动资源+广告投放，目标单链接GMV 33.9万）' },
      { name: '存量爆品流量优化', agent: '流量Agent', description: '存量爆品主搜/换购/淘客渠道流量优化（针对IPV下滑30.2%的2224个存量爆品，优化搜索关键词覆盖、换购坑位排期、淘客佣金策略）' },
      { name: '百补/秒杀渠道招商下发', agent: '招商Agent', description: '百补/秒杀渠道招商邀约下发（将筛选出的潜力链接清单通过星瞳Agent下发至百补和秒杀渠道，完成招商邀约）' },
      { name: '爆品流失预警机制建立', agent: '风控Agent', description: '爆品流失预警机制建立（监控核心爆品到手价变动、补贴断档、现货率低于24仓等指标，设定92%在架率及格线，触发自动补位）' },
    ],
    overview: {
      goal: '百亿补贴选品方案确认与执行',
      currentPhase: '等待用户确认',
      nextStep: '确认选品范围和补贴力度后执行',
      risk: '补贴预算超支风险',
    },
    contextMessages: [
      {
        id: 'msg-pc1-1',
        time: '09:30',
        role: 'user' as const,
        roleName: '用户',
        content: '帮我生成百亿补贴选品方案',
        category: 'instruction' as const,
      },
      {
        id: 'msg-pc1-2',
        time: '09:31',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '已理解需求，正在协调专家Agent分析...',
        category: 'judgment' as const,
      },
      {
        id: 'msg-pc1-3',
        time: '09:35',
        role: 'agent' as const,
        roleName: '数据分析Agent',
        content: '分析完成，从50万SKU中筛选出50个高潜力商品，预计补贴后GMV提升35%',
        evidence: ['SKU筛选模型', '补贴效果测算'],
        category: 'execution' as const,
      },
      {
        id: 'msg-pc1-4',
        time: '09:38',
        role: 'agent' as const,
        roleName: '品类运营Agent',
        content: '建议重点补贴3C数码和食品生鲜品类，转化率分别预计提升28%和42%',
        evidence: ['品类转化率分析', '补贴敏感度模型'],
        category: 'execution' as const,
      },
      {
        id: 'msg-pc1-5',
        time: '09:40',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '综合专家分析，已生成百亿补贴选品方案。方案包含50个高潜力商品，覆盖3C数码、食品生鲜、家居日用三大品类。需您确认选品范围和补贴力度。',
        evidence: ['完整选品方案', '补贴力度测算报告'],
        actions: ['立即执行', '调整方案', '暂不执行'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-pc1-dispatch',
        time: '14:35',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 选品方案已确认！接下来需要将具体执行任务派发给渠道负责人。您可以点击「派发任务」创建渠道任务并指定接收人。',
        actions: ['派发任务'],
        category: 'execution' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-pc1-1', name: '选品方案.xlsx', type: 'xlsx', size: '1.8 MB', createdAt: '04-22 09:40' },
      { id: 'f-pc1-2', name: '补贴力度测算.pdf', type: 'pdf', size: '560 KB', createdAt: '04-22 09:38' },
    ],
    executionMetrics: [
      { label: '筛选SKU数', value: '50个', change: '从50万中筛出', trend: 'up' as const, updatedAt: '分析完成', action: 'AI选品模型筛选', impact: '从50万SKU中精选50个高潜力商品' },
      { label: '预计GMV提升', value: '+35%', change: '+2100万', trend: 'up' as const, updatedAt: '分析完成', action: '补贴效果测算', impact: '补贴后预计GMV提升35%，增量约2100万' },
      { label: '覆盖品类', value: '3大品类', change: '3C/生鲜/家居', trend: 'neutral' as const, updatedAt: '分析完成', action: '品类覆盖分析', impact: '覆盖3C数码、食品生鲜、家居日用三大品类' },
    ],
    conclusions: {
      mainCause: '百亿补贴选品需确认',
      recommendedAction: '确认选品范围和补贴力度后启动执行',
      pendingConfirmation: '选品范围和补贴力度',
    },
  },
  't-pc2': {
    overview: {
      goal: '投流预算从3200万调整至3800万',
      currentPhase: '等待用户确认',
      nextStep: '确认预算变更后执行调整',
      risk: 'ROI不及预期风险',
    },
    contextMessages: [
      {
        id: 'msg-pc2-1',
        time: '10:15',
        role: 'user' as const,
        roleName: '用户',
        content: '分析一下当前投流ROI，看看预算是否需要调整',
        category: 'instruction' as const,
      },
      {
        id: 'msg-pc2-2',
        time: '10:16',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '正在调用投流分析Agent...',
        category: 'execution' as const,
      },
      {
        id: 'msg-pc2-3',
        time: '10:20',
        role: 'agent' as const,
        roleName: '投流Agent',
        content: '当前投流预算3200万，ROI为2.8。分析显示调整至3800万可提升ROI至3.1，预计增量GMV 1800万',
        evidence: ['投流ROI分析报告', '预算优化模型'],
        category: 'execution' as const,
      },
      {
        id: 'msg-pc2-4',
        time: '10:22',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: 'AI建议将投流预算从3200万调整至3800万，预计ROI提升12%。需您确认预算变更。',
        evidence: ['ROI分析报告', '预算调整方案'],
        actions: ['立即执行', '调整方案', '暂不执行'],
        category: 'judgment' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-pc2-1', name: 'ROI分析报告.xlsx', type: 'xlsx', size: '2.1 MB', createdAt: '04-22 10:20' },
    ],
    executionMetrics: [
      { label: '当前ROI', value: '2.8', change: '基准值', trend: 'neutral' as const, updatedAt: '分析完成', action: '投流ROI分析', impact: '当前投流预算3200万，ROI为2.8' },
      { label: '预计ROI', value: '3.1', change: '+12%', trend: 'up' as const, updatedAt: '分析完成', action: '预算优化测算', impact: '调整至3800万后预计ROI提升至3.1' },
      { label: '预计增量GMV', value: '1800万', change: '+600万', trend: 'up' as const, updatedAt: '分析完成', action: '投放效果预估', impact: '预算增加600万带来增量GMV 1800万' },
    ],
    conclusions: {
      mainCause: '投流预算调整需确认',
      recommendedAction: '确认预算从3200万调整至3800万',
      pendingConfirmation: '预算变更审批',
    },
  },
  't-pc3': {
    overview: {
      goal: '618大促三波段节奏排期确认',
      currentPhase: '等待用户确认',
      nextStep: '确认整体排期后启动资源位预约',
      risk: '资源位锁定时间紧迫',
    },
    contextMessages: [
      {
        id: 'msg-pc3-1',
        time: '11:00',
        role: 'user' as const,
        roleName: '用户',
        content: '帮我规划618大促的整体节奏',
        category: 'instruction' as const,
      },
      {
        id: 'msg-pc3-2',
        time: '11:01',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '正在协调多位专家Agent制定排期...',
        category: 'execution' as const,
      },
      {
        id: 'msg-pc3-3',
        time: '11:05',
        role: 'agent' as const,
        roleName: '品类运营Agent',
        content: '建议采用三波段节奏：5.24预热、5.31爆发、6.15返场',
        evidence: ['历史大促数据分析', '品类节奏建议'],
        category: 'execution' as const,
      },
      {
        id: 'msg-pc3-4',
        time: '11:08',
        role: 'agent' as const,
        roleName: '渠道分析Agent',
        content: '各渠道资源位需提前7天锁定，建议5.17开始资源位预约',
        evidence: ['渠道资源位分析', '资源位锁定周期'],
        category: 'execution' as const,
      },
      {
        id: 'msg-pc3-5',
        time: '11:10',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '已规划618大促三波段节奏，涉及资源位分配和商家沟通计划。需确认整体排期。',
        evidence: ['大促节奏排期表', '资源位分配方案'],
        actions: ['立即执行', '调整方案', '暂不执行'],
        category: 'judgment' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-pc3-1', name: '大促节奏排期表.xlsx', type: 'xlsx', size: '1.2 MB', createdAt: '04-22 11:10' },
      { id: 'f-pc3-2', name: '资源位分配方案.pdf', type: 'pdf', size: '890 KB', createdAt: '04-22 11:08' },
    ],
    executionMetrics: [
      { label: '大促波段', value: '3波段', change: '预热/爆发/返场', trend: 'neutral' as const, updatedAt: '分析完成', action: '大促节奏规划', impact: '5.24预热、5.31爆发、6.15返场三波段节奏' },
      { label: '资源位预约', value: '5.17启动', change: '提前7天', trend: 'neutral' as const, updatedAt: '分析完成', action: '渠道资源位分析', impact: '各渠道资源位需提前7天锁定' },
      { label: '预计GMV', value: '+4200万', change: '同比+22%', trend: 'up' as const, updatedAt: '分析完成', action: '大促效果预估', impact: '三波段策略预计带来增量GMV 4200万' },
    ],
    conclusions: {
      mainCause: '618大促排期需确认',
      recommendedAction: '确认三波段节奏后启动资源位预约',
      pendingConfirmation: '整体排期和资源位分配',
    },
    subTasks: [
      {
        id: 't-delegate1',
        title: '618大促资源位确认',
        owner: '昌栗',
        status: 'done',
        time: '2026-04-24 16:30',
        feedback: '已完成8个资源位排期确认，食品和美妆品类优先排在首页Banner前2位。',
        feedbackTime: '2026-04-24 16:30',
        feedbackStatus: 'done'
      },
      {
        id: 't-delegate2',
        title: '品类目标拆解确认',
        owner: '昌栗',
        status: 'inprogress',
        time: '2026-04-24 10:00',
        feedback: '已拆解3个品类目标，剩余2个品类数据需等财务确认后更新。',
        feedbackTime: '2026-04-24 10:00',
        feedbackStatus: 'blocked'
      },
      {
        id: 't-x-ai-confirm1',
        title: '乳饮冲调品类流量补充方案',
        owner: '昌栗',
        status: 'done',
        time: '2026-04-24 14:20',
        feedback: '已完成出价调整和素材更换，IPV当日恢复18%，持续观察中。',
        feedbackTime: '2026-04-24 14:20',
        feedbackStatus: 'done'
      },
      {
        id: 't-delegate3',
        title: '5月促销节奏对齐',
        owner: '昌栗',
        status: 'pending_confirm',
        time: '待安排'
      }
    ],
  },
  't-report1': {
    overview: {
      goal: '每日自动播报百补渠道各品类招商进度',
      currentPhase: '今日播报已完成推送',
      nextStep: '明日08:00自动执行下一轮播报',
      risk: '家清品类签约率连续2日下滑，需关注',
    },
    contextMessages: [
      {
        id: 'msg-rpt-1',
        time: '08:00',
        role: 'system' as const,
        roleName: '系统',
        content: '系统触发 - 百亿补贴渠道日报播报任务自动执行',
        category: 'execution' as const,
      },
      {
        id: 'msg-rpt-2',
        time: '08:01',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '开始采集各品类渠道招商数据，今日播报周期：2026-04-20',
        category: 'execution' as const,
      },
      {
        id: 'msg-rpt-3',
        time: '08:05',
        role: 'agent' as const,
        roleName: '数据分析Agent',
        content: '数据采集完成。美妆品类签约率82%（+3%），食品品类75%（+5%），家清品类68%（-2%需关注）。选品池总覆盖率78%。',
        evidence: ['品类签约率报表', '选品池覆盖率数据'],
        category: 'execution' as const,
      },
      {
        id: 'msg-rpt-4',
        time: '08:10',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '今日渠道播报已生成并推送至品类负责人。家清品类签约率下滑，已标记预警。',
        actions: ['查看播报详情', '查看预警明细'],
        category: 'judgment' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [],
    },
    generatedFiles: [],
    executionMetrics: [],
    conclusions: {
      mainCause: '百补渠道日报播报正常执行',
      recommendedAction: '关注家清品类签约率下滑趋势',
      pendingConfirmation: '无',
    },
  },
  't-invite1': {
    overview: {
      goal: '向30个高潜力商家完成百补定品邀约',
      currentPhase: '邀约执行中',
      nextStep: '跟进剩余15家商家邀约发送',
      risk: '部分商家响应周期较长，可能影响整体完成率',
    },
    contextMessages: [
      {
        id: 'msg-inv-1',
        time: '15:30',
        role: 'user' as const,
        roleName: '用户',
        content: '帮我对5月百补选品池中的高潜商家发起定品邀约，目标覆盖美妆、食品、家清三大品类，完成率要达到85%以上。',
        category: 'instruction' as const,
      },
      {
        id: 'msg-inv-2',
        time: '15:32',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '已分析5月百补选品池数据，筛选出30个高潜力商家：\n\n📊 商家分布：\n• 美妆品类：12家（含3家TOP品牌旗舰店）\n• 食品品类：10家（含2家新锐品牌）\n• 家清品类：8家（含4家复购率TOP商家）\n\n筛选标准：近90天动销率>80%、DSR评分≥4.8、履约时效达标率>95%\n\n🔍 正在调用「招商Agent」准备邀约方案并批量发送...',
        evidence: ['选品池分析报告', '商家评分数据', '品类覆盖明细'],
        category: 'judgment' as const,
      },
      {
        id: 'msg-inv-3',
        time: '15:45',
        role: 'agent' as const,
        roleName: '招商Agent',
        content: '邀约方案已生成并启动首批发送：\n\n📋 首批邀约（15家）：\n• 美妆：完美日记、花西子、珀莱雅等6家\n• 食品：三只松鼠、良品铺子等5家\n• 家清：蓝月亮、立白、威露士等4家\n\n✅ 邀约函已通过千牛+钉钉双通道发送\n⏰ 预计24小时内收到首批回复\n\n剩余15家将在明日上午10:00发送第二批。',
        evidence: ['邀约函模板', '发送记录', '商家联系方式清单'],
        actions: ['查看邀约函', '调整发送节奏'],
        category: 'execution' as const,
      },
      {
        id: 'msg-inv-4',
        time: '16:30',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '📊 当前邀约进展汇总：\n\n━━━━━━━━━━━━━━━━━━━━\n📋 百亿补贴定品邀约进度\n━━━━━━━━━━━━━━━━━━━━\n\n• 已发送：15/30 家\n• 已接受：8家（美妆4家、食品3家、家清1家）\n• 等待回复：7家\n• 待发送：15家（明日上午批量发送）\n\n📈 当前接受率：53.3%（8/15）\n🎯 目标完成率：85%（需≥26家接受）\n\n⚡ 按当前接受率推算，预计最终完成率可达80-88%，建议对犹豫商家追加激励政策以确保达标。',
        actions: ['追加激励方案', '查看商家明细', '催促未回复商家'],
        evidence: ['邀约进度看板', '商家回复记录'],
        category: 'judgment' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [],
    },
    generatedFiles: [
      { id: 'f-inv-1', name: '百补选品池商家筛选报告.xlsx', type: 'xlsx', size: '1.8 MB', createdAt: '04-21 15:35' },
      { id: 'f-inv-2', name: '定品邀约函模板.docx', type: 'docx', size: '520 KB', createdAt: '04-21 15:40' },
      { id: 'f-inv-3', name: '邀约进度跟踪表.xlsx', type: 'xlsx', size: '960 KB', createdAt: '04-21 16:30' },
    ],
    executionMetrics: [
      { label: '目标商家数', value: '30家', change: '美妆12+食品10+家清8', trend: 'neutral' as const, updatedAt: '04-21 15:32', action: '选品池分析', impact: '覆盖三大核心品类高潜商家' },
      { label: '已发送邀约', value: '15/30', change: '50%', trend: 'neutral' as const, updatedAt: '04-21 16:30', action: '首批邀约发送', impact: '首批15家已通过双通道触达' },
      { label: '已接受商家', value: '8家', change: '接受率53.3%', trend: 'up' as const, updatedAt: '04-21 16:30', action: '商家回复跟踪', impact: '美妆4家、食品3家、家清1家已确认' },
      { label: '预计完成率', value: '80-88%', change: '目标85%', trend: 'neutral' as const, updatedAt: '04-21 16:30', action: '完成率预估', impact: '需追加激励确保达标' },
    ],
    conclusions: {
      mainCause: '百补定品邀约执行中，首批接受率良好',
      recommendedAction: '对犹豫商家追加激励政策，确保整体完成率达85%',
      pendingConfirmation: '第二批15家商家邀约发送及激励方案确认',
    },
  },
 't-plan1': {
    overview: {
      goal: '自动生成5月百亿补贴运营计划',
      currentPhase: '计划已生成并归档',
      nextStep: '等待TL确认后进入执行阶段',
      risk: '无',
    },
    contextMessages: [
      {
        id: 'msg-plan-1',
        time: '10:00',
        role: 'system' as const,
        roleName: '系统',
        content: '系统触发 - 百亿补贴5月运营计划自动生成',
        category: 'execution' as const,
      },
      {
        id: 'msg-plan-2',
        time: '10:01',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '开始分析历史数据和当前业务表现，生成5月百补运营计划...',
        category: 'execution' as const,
      },
      {
        id: 'msg-plan-3',
        time: '10:10',
        role: 'agent' as const,
        roleName: '数据分析Agent',
        content: '数据分析完成。4月百补GMV环比增长12%，用户复购率提升8%。建议5月重点加码美妆和食品品类，预算分配比例建议为美妆35%、食品30%、家清20%、其他15%。',
        category: 'execution' as const,
      },
      {
        id: 'msg-plan-4',
        time: '10:20',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '5月百亿补贴运营计划已生成。覆盖4大品类、预计投入预算1200万、目标GMV 8000万。计划文档已归档。',
        category: 'judgment' as const,
      },
    ],
    lineage: {
      upstream: [],
      downstream: [],
    },
    generatedFiles: [],
    executionMetrics: [],
    conclusions: {
      mainCause: '5月百亿补贴运营计划已自动生成并归档',
      recommendedAction: '等待TL确认后进入执行阶段',
      pendingConfirmation: 'TL确认计划内容',
    },
  },
  't-delegate1': {
    isFullAuto: false,
    overview: {
      goal: '确认首页Banner和搜索推荐位的618大促资源位排期',
      currentPhase: '待确认',
      nextStep: '确认收到任务后，登录营销平台完成资源位排期确认',
      risk: '需在4月25日前完成，逾期可能影响618大促排期',
    },
    contextMessages: [
      {
        id: 'del1-msg-1',
        time: '09:00',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '📋 你好，以下是一项由焦进委派给你的任务。\n\n**任务背景**：618大促活动即将启动，需要确认首页Banner（3个坑位）和搜索推荐位（5个坑位）的排期安排。当前各品类已提交资源位需求，需要你审核并确认最终排期。\n\n**目标**：在4月25日前完成所有资源位的排期确认，确保618大促准时上线。',
        category: 'judgment' as const,
      },
      {
        id: 'del1-msg-2',
        time: '09:01',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '我为你整理了操作建议，可以按以下步骤执行：\n\n**步骤1**：登录猫超营销平台 → 资源位管理 → 618大促专区\n\n**步骤2**：查看各品类提交的资源位申请（共8个坑位待确认）\n\n**步骤3**：根据以下优先级确认排期：\n- 🔴 高优：食品、美妆（GMV贡献TOP2）\n- 🟡 中优：家清、母婴\n- 🟢 低优：其他品类\n\n**步骤4**：确认完成后，在本页面提交反馈\n\n⚠️ 注意：如果遇到资源位冲突，优先保障高GMV品类。',
        evidence: ['品类GMV排名表', '资源位申请汇总'],
        category: 'judgment' as const,
      },
      {
        id: 'del1-msg-3',
        time: '09:01',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '如果执行过程中有任何疑问，可以随时在下方输入框问我，我会帮你分析和建议。\n\n请先确认收到此任务 👇',
        actions: ['确认收到', '有疑问'],
        category: 'judgment' as const,
      },
    ],
    lineage: {
      upstream: [{ id: 't-pc3', title: '百亿补贴定品邀约', owner: '楚川', status: 'inprogress', statusLabel: '执行中' }],
      downstream: [],
    },
    generatedFiles: [],
    executionMetrics: [],
    conclusions: {
      mainCause: '',
      recommendedAction: '按步骤完成资源位排期确认',
      pendingConfirmation: '等待确认收到任务',
    },
  },
  't-x-ai-confirm1': {
    isFullAuto: false,
    overview: {
      goal: '针对乳饮冲调品类IPV下滑42.5%，执行流量补充方案',
      currentPhase: '待确认',
      nextStep: '确认收到后，在投流平台调整出价和定向策略',
      risk: '流量持续下滑可能导致GMV目标缺口扩大',
    },
    contextMessages: [
      {
        id: 'ai-conf1-msg-1',
        time: '08:15',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '🤖 AI主动发起：我监测到乳饮冲调品类近7天IPV环比下滑42.5%，已自动分析原因并生成应对方案。\n\n**问题诊断**：\n- 主搜渠道流量下降35%（竞品加大投放挤压）\n- 推荐渠道CTR下滑12%（素材疲劳）\n- 自然流量基本稳定\n\n**影响评估**：若不干预，预计本周GMV缺口约180万。',
        evidence: ['IPV趋势分析', '渠道流量明细', '竞品投放监测'],
        category: 'judgment' as const,
      },
      {
        id: 'ai-conf1-msg-2',
        time: '08:16',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '我已生成流量补充方案，建议你按以下步骤操作：\n\n**步骤1**：登录投流平台 → 乳饮冲调品类计划组\n\n**步骤2**：调整主搜出价\n- 核心关键词出价上调15%（牛奶、酸奶、咖啡）\n- 新增长尾词包：低脂奶、燕麦奶、即饮咖啡\n\n**步骤3**：更换推荐渠道素材\n- 替换运行超过7天的素材（共5组）\n- 新素材已由设计团队准备好，在素材库"618-乳饮"文件夹\n\n**步骤4**：设置预算上限为日均8万（较当前+30%）\n\n**预期效果**：3天内IPV恢复至下滑前80%水平。',
        evidence: ['出价调整建议表', '素材更换清单', '预算测算'],
        category: 'judgment' as const,
      },
      {
        id: 'ai-conf1-msg-3',
        time: '08:16',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '以上是我的建议方案。后续当投流平台的API接入完成后，我可以直接帮你执行这些操作。目前请手动操作，完成后告诉我结果。\n\n如需帮你做更细的分析（比如看某个关键词的竞争情况），随时问我。\n\n请先确认收到 👇',
        actions: ['确认收到', '有疑问'],
        category: 'judgment' as const,
      },
    ],
    lineage: {
      upstream: [{ id: 't-strategy-flow', title: '乳饮冲调品类流量异常应对策略', owner: 'AI', status: 'inprogress', statusLabel: '执行中' }],
      downstream: [],
    },
    generatedFiles: [],
    executionMetrics: [],
    conclusions: {
      mainCause: '竞品加大投放 + 素材疲劳导致流量下滑',
      recommendedAction: '调整出价+更换素材+提升预算',
      pendingConfirmation: '等待确认收到任务',
    },
  },
  't-cron-report': {
    isFullAuto: true,
    overview: {
      goal: '每日拉取已派发任务完成情况，生成可视化日报',
      currentPhase: '日报已生成',
      nextStep: '明日 09:00 再次触发',
      risk: '当前仅能感知任务完成状态，结果详情依赖后续 Skill 扩充',
    },
    progressSteps: [
      { name: '定时触发', agent: '章鱼 Agent', description: '每日 09:00 自动启动派发任务进度拉取作业。' },
      { name: '拉取派发清单', agent: '任务中心 Agent', description: '根据当前账号查询本月创建并派发出去的任务集合。' },
      { name: '查询完成状态', agent: '任务中心 Agent', description: '逐任务查询 status 字段，只记录已完成/未完成两种状态。' },
      { name: '生成可视化日报', agent: '报告生成 Agent', description: '将汇总数据渲染为 HTML 报告，供右侧面板预览。' },
      { name: '推送完成', agent: '章鱼 Agent', description: '日报已生成，在当前任务上下文以附件形式推送。' },
    ],
    contextMessages: [
      {
        id: 'cron-msg-1',
        time: '09:00',
        role: 'system' as const,
        roleName: '系统',
        content: '⏰ 定时触发：【派发任务进度日报】于 2026-05-18 09:00 启动。',
        category: 'instruction' as const,
      },
      {
        id: 'cron-msg-2',
        time: '09:00',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '收到定时触发，开始拉取您本月创建并派发的任务清单。',
        category: 'judgment' as const,
      },
      {
        id: 'cron-msg-3',
        time: '09:00',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '📂 已识别出 **9 个** 由您创建并派发的任务，涵盖品类负责人、一线小二、业务负责人三层。正在逐条查询完成状态…',
        evidence: ['任务中心查询接口'],
        category: 'execution' as const,
      },
      {
        id: 'cron-msg-4',
        time: '09:01',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '✅ 完成状态拉取完毕：**已完成 3 / 未完成 6**，整体完成率 33.3%。已调用报告生成 Agent 生成可视化 HTML 日报…',
        category: 'execution' as const,
      },
      {
        id: 'cron-msg-5',
        time: '09:01',
        role: 'agent' as const,
        roleName: '章鱼Agent',
        content: '📄 《派发任务进度日报·2026-05-18》已生成，点击下方附件可在右侧面板预览完整报告。\n\n⚠️ 说明：当前 Skill 仅支持拉取任务是否完成，任务结果详情（如达成金额、收集到的反馈等）暂未接入，待后续能力补齐后可自动包含。',
        category: 'file' as const,
        htmlReport: {
          fileName: '派发任务进度日报_2026-05-18.html',
          title: '派发任务进度日报 · 2026-05-18',
          summary: '已完成 3 / 未完成 6，完成率 33.3%',
          createdAt: '2026-05-18 09:01',
          htmlContent: cronReportHtml,
        },
      },
    ],
    lineage: { upstream: [], downstream: [] },
    generatedFiles: [
      { id: 'gf-cron-1', name: '派发任务进度日报_2026-05-18.html', type: 'doc', size: '12 KB', createdAt: '09:01' },
    ],
    executionMetrics: [],
    conclusions: {
      mainCause: '定时任务正常运行',
      recommendedAction: '点击附件查看完整日报',
      pendingConfirmation: '无',
    },
  },
};
