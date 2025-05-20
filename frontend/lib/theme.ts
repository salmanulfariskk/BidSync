import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#2563eb',
    colorSuccess: '#16a34a',
    colorWarning: '#f59e0b',
    colorError: '#dc2626',
    colorInfo: '#3b82f6',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
    Modal: {
      borderRadiusLG: 12,
    },
    Table: {
      borderRadius: 12,
      borderRadiusLG: 12,
    },
  },
};