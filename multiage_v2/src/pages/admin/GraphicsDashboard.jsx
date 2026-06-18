import { useMemo } from "react";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import { MetricOverview, ProjectsSection, SimpleInfoSection } from "../../components/admin/roleSections";
import { comparePeriods, filterByRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";

export default function GraphicsDashboard({ role, token, user }) {
  const { messages, loading, error } = useAdminResources(token, { messages: true });
  const scopedMessages = useMemo(() => filterByRange(messages, 30), [messages]);
  const activeDesigns = (messages || []).filter((message) => message.status === "read");
  const pendingReviews = (messages || []).filter((message) => message.status === "unread");
  const completedDesigns = activeDesigns.length;
  const clientFeedback = (messages || []).filter((message) => /design|brand|media|graphics/i.test(String(message.service || ""))).length;

  const cards = useMemo(() => [
    { label: "Active Design Requests", value: String(activeDesigns.length), subtitle: "In progress", change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), 30), icon: <StatIcon type="media" /> },
    { label: "Completed Designs", value: String(completedDesigns), subtitle: "Delivered engagements", change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), 30), icon: <StatIcon type="income" /> },
    { label: "Pending Reviews", value: String(pendingReviews.length), subtitle: "Awaiting review", change: comparePeriods(messages, (message) => (message.status === "unread" ? 1 : 0), 30), icon: <StatIcon type="orders" /> },
    { label: "Client Feedback", value: String(clientFeedback), subtitle: "Design-related inquiries", change: 0, icon: <StatIcon type="shield" /> },
  ], [activeDesigns.length, completedDesigns, pendingReviews.length, clientFeedback, messages]);

  const sections = {
    Dashboard: <MetricOverview cards={cards} messages={scopedMessages} />,
    Projects: <ProjectsSection messages={messages} title="Design Projects" description="Creative engagements derived from client service requests." />,
    "Media / Content": <SimpleInfoSection title="Media / Content" description="Creative workspace for design and media delivery." body="This dashboard is designed for design request tracking, media readiness, and content preparation without exposing financial data or customer communications." iconType="media" />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Graphics Dashboard"
      subtitle={`Welcome back, ${user?.name || "Graphics Team"}. This workspace is dedicated to design requests, media readiness, and creative project support.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
