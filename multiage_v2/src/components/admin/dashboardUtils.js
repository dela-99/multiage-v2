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

export function buildTopProducts(orders, products) {
  const counts = new Map();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      counts.set(item.name, (counts.get(item.name) || 0) + Number(item.quantity || 0));
    });
  });

  const productByName = new Map(products.map((product) => [product.name, product]));

  return [...counts.entries()]
    .map(([name, quantity]) => ({
      name,
      quantity,
      image: productByName.get(name)?.image || "",
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8);
}
