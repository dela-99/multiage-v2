export function inRange(dateString, days) {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - days);
  return new Date(dateString) >= threshold;
}

export function comparePeriods(items, getter, days) {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(now.getDate() - days);
  const previousStart = new Date(currentStart);
  previousStart.setDate(currentStart.getDate() - days);

  const current = items
    .filter((item) => new Date(item.createdAt) >= currentStart)
    .reduce((sum, item) => sum + getter(item), 0);

  const previous = items
    .filter((item) => new Date(item.createdAt) >= previousStart && new Date(item.createdAt) < currentStart)
    .reduce((sum, item) => sum + getter(item), 0);

  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

export function filterByRange(items, rangeDays) {
  return (items || []).filter((item) => inRange(item.createdAt, rangeDays));
}

export function computeServiceMetrics(messages, rangeDays) {
  const scoped = filterByRange(messages, rangeDays);
  const all = messages || [];
  const unread = all.filter((message) => message.status === "unread");
  const read = all.filter((message) => message.status === "read");

  return {
    totalServiceRequests: scoped.length,
    activeProjects: read.length,
    completedProjects: read.length,
    newLeads: unread.length,
    pendingLeads: unread.length,
    contactedLeads: read.length,
    closedLeads: read.length,
    followUps: unread.length,
    openRequests: unread.length,
    closedRequests: read.length,
    serviceTransactions: scoped.length,
    monthlyIncome: scoped.length,
    outstandingPayments: unread.length,
  };
}

export function buildTopServices(messages, limit = 8) {
  const counts = new Map();

  (messages || []).forEach((message) => {
    const service = message.service || "General inquiry";
    counts.set(service, (counts.get(service) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function countActiveStaff(users) {
  return (users || []).filter((user) => user.isAdmin).length;
}
