import {
  mockKpis,
  mockRevenueChartData,
  mockPaymentData,
  mockAlerts,
  mockTopProducts,
  mockOwnerStats,
} from "../mocks/dashboard.mock";

export const getDashboardKpis = async () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockKpis);
    }, 100);
  });
};

export const getRevenueChartData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRevenueChartData);
    }, 100);
  });
};

export const getPaymentDistribution = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPaymentData);
    }, 100);
  });
};

export const getActiveAlerts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAlerts);
    }, 100);
  });
};

export const getTopProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTopProducts);
    }, 100);
  });
};

export const getOwnerStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOwnerStats);
    }, 100);
  });
};
