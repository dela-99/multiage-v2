import { useEffect, useMemo, useState } from "react";
import DashboardCard from "./DashboardCard";
import AnalyticsChart from "./AnalyticsChart";
import TopServices from "./TopServices";
import { SectionShell, fieldStyle, StatIcon } from "./RoleDashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../lib/api";
import { buildTopServices } from "./dashboardUtils";

export function MetricOverview({ cards, analytics, topServices, messages = [] }) {
  const resolvedTopServices = topServices || (messages.length > 0 ? buildTopServices(messages) : []);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 18 }}>
        {cards.map((card) => (
          <DashboardCard
            key={card.label}
            title={card.label}
            subtitle={card.subtitle}
            value={card.value}
            change={card.change}
            icon={card.icon}
          />
        ))}
      </div>

      {analytics && (
        <AnalyticsChart
          rangeDays={analytics.rangeDays}
          onRangeChange={analytics.onRangeChange}
          income={analytics.income}
          expenses={analytics.expenses}
          balance={analytics.balance}
          changes={analytics.changes}
          hasChartData={analytics.hasChartData}
        />
      )}

      {resolvedTopServices.length > 0 && <TopServices items={resolvedTopServices} />}
    </>
  );
}

function MessageList({ messages, emptyLabel = "No records in the selected range." }) {
  const { t } = useTheme();

  if (!messages.length) {
    return <div style={{ color: t.textMuted }}>{emptyLabel}</div>;
  }

  return (
    <div style={{ display: "grid", gap: 12, maxHeight: 620, overflowY: "auto" }}>
      {messages.map((message) => (
        <article
          key={message._id}
          style={{
            display: "grid",
            gap: 6,
            padding: "14px 0",
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ color: t.textPrimary, fontWeight: 700 }}>{message.name}</div>
            <span style={{
              padding: "4px 10px",
              borderRadius: 999,
              background: message.status === "unread" ? "rgba(197,98,11,0.14)" : "rgba(30,132,73,0.14)",
              color: message.status === "unread" ? "#C5620B" : "#1e8449",
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
            }}>
              {message.status}
            </span>
          </div>
          <div style={{ color: t.textMuted, fontSize: 13 }}>
            {message.service || "General inquiry"}{message.phone ? ` · ${message.phone}` : ""}
          </div>
          <div style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.6 }}>
            {String(message.message || "").slice(0, 140)}{String(message.message || "").length > 140 ? "..." : ""}
          </div>
          <div style={{ color: t.textMuted, fontSize: 12 }}>
            {new Date(message.createdAt).toLocaleString()}
          </div>
        </article>
      ))}
    </div>
  );
}

export function LeadsSection({ messages, title = "Leads", description = "Incoming service inquiries and contact form submissions." }) {
  const leads = (messages || []).filter((message) => message.status === "unread");

  return (
    <SectionShell title={title} description={description}>
      <MessageList messages={leads} emptyLabel="No pending leads right now." />
    </SectionShell>
  );
}

export function ProjectsSection({ messages, title = "Projects", description = "Active and completed service engagements derived from CRM records." }) {
  const active = (messages || []).filter((message) => message.status === "read");

  return (
    <SectionShell title={title} description={description}>
      <MessageList messages={active} emptyLabel="No active projects yet." />
    </SectionShell>
  );
}

export function ReportsSection({ messages, rangeDays, title = "Reports", description = "Service activity summary for the selected period." }) {
  const { t } = useTheme();
  const topServices = buildTopServices(messages);
  const unread = (messages || []).filter((message) => message.status === "unread").length;
  const read = (messages || []).filter((message) => message.status === "read").length;

  return (
    <SectionShell title={title} description={description}>
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
          {[
            { label: "Total Inquiries", value: String((messages || []).length) },
            { label: "Pending Follow-up", value: String(unread) },
            { label: "Contacted", value: String(read) },
            { label: "Reporting Window", value: `${rangeDays} days` },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "16px 18px",
                borderRadius: 18,
                border: `1px solid ${t.border}`,
                background: t.surface,
              }}
            >
              <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                {item.label}
              </div>
              <div style={{ marginTop: 8, color: t.textPrimary, fontSize: 24, fontWeight: 800 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {topServices.length > 0 ? (
          <TopServices items={topServices} compact />
        ) : (
          <div style={{ color: t.textMuted }}>No service activity to report in this range.</div>
        )}
      </div>
    </SectionShell>
  );
}

function normalizePhoneForActions(phone) {
  const raw = String(phone || "").trim();
  if (!raw) {
    return "";
  }

  if (raw.startsWith("+")) {
    return raw.replace(/[^\d]/g, "");
  }

  return raw.replace(/[^\d]/g, "");
}

export function MessagesSection({
  messages,
  token,
  loading = false,
  title = "Communications",
  description = "Live customer and service communication records.",
}) {
  const { t } = useTheme();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [localMessages, setLocalMessages] = useState(messages || []);
  const [detailLoadingId, setDetailLoadingId] = useState("");

  useEffect(() => {
    setLocalMessages(messages || []);
    setSelectedMessage((current) => {
      if (!current) {
        return null;
      }
      return (messages || []).find((message) => message._id === current._id) || current;
    });
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return (localMessages || []).filter((message) => {
      const matchesSearch = !query || [message.name, message.email, message.phone, message.service]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = filter === "all" ? true : message.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, localMessages, query]);

  const openMessage = async (message) => {
    if (!token || !message?._id) {
      setSelectedMessage(message || null);
      return;
    }

    try {
      setDetailLoadingId(message._id);
      const fullMessage = await api.getMessage(message._id, token);
      setSelectedMessage(fullMessage);
      setLocalMessages((current) => current.map((item) => (
        item._id === fullMessage._id ? fullMessage : item
      )));
    } catch {
      setSelectedMessage(message);
    } finally {
      setDetailLoadingId("");
    }
  };

  const copyValue = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      window.prompt("Copy this value:", value);
    }
  };

  const selectedPhone = normalizePhoneForActions(selectedMessage?.phone);

  return (
    <SectionShell title={title} description={description}>
      <div style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12 }} className="messages-toolbar">
          <input
            placeholder="Search by name, email, or phone"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={fieldStyle(t)}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "read", label: "Read" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: filter === item.key ? "1px solid rgba(197,98,11,0.6)" : `1px solid ${t.border}`,
                  background: filter === item.key ? "rgba(197,98,11,0.14)" : t.surface,
                  color: filter === item.key ? "#C5620B" : t.textPrimary,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{
            padding: "32px 18px",
            borderRadius: 18,
            background: t.surface,
            border: `1px solid ${t.border}`,
            color: t.textMuted,
            textAlign: "center",
          }}>
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div style={{ color: t.textMuted, padding: "18px 4px" }}>No messages yet</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(320px,0.95fr)", gap: 18 }} className="messages-grid">
            <div style={{ display: "grid", gap: 12, maxHeight: 620, overflowY: "auto", paddingRight: 4 }}>
              {filteredMessages.map((message) => {
                const isActive = selectedMessage?._id === message._id;
                const isUnread = message.status === "unread";
                return (
                  <button
                    key={message._id}
                    type="button"
                    onClick={() => openMessage(message)}
                    style={{
                      display: "grid",
                      gap: 8,
                      textAlign: "left",
                      width: "100%",
                      padding: "16px 18px",
                      borderRadius: 18,
                      border: isActive ? "1px solid rgba(197,98,11,0.55)" : `1px solid ${t.border}`,
                      background: isActive ? "rgba(197,98,11,0.12)" : (isUnread ? "rgba(197,98,11,0.08)" : t.surface),
                      cursor: "pointer",
                      boxShadow: isUnread ? "inset 3px 0 0 #C5620B" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ color: t.textPrimary, fontWeight: 800 }}>{message.name}</div>
                        <div style={{ color: t.textMuted, fontSize: 13 }}>{message.email}</div>
                      </div>
                      <span style={{
                        padding: "5px 10px",
                        borderRadius: 999,
                        background: isUnread ? "rgba(197,98,11,0.16)" : "rgba(30,132,73,0.14)",
                        color: isUnread ? "#C5620B" : "#1e8449",
                        fontWeight: 800,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}>
                        {detailLoadingId === message._id ? "Opening..." : message.status}
                      </span>
                    </div>
                    <div style={{ color: t.textSecondary, fontSize: 13 }}>
                      {message.service || "General inquiry"}{message.phone ? ` · ${message.phone}` : ""}
                    </div>
                    <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6 }}>
                      {String(message.message || "").slice(0, 110)}{String(message.message || "").length > 110 ? "..." : ""}
                    </div>
                    <div style={{ color: t.textMuted, fontSize: 12 }}>
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{
              borderRadius: 22,
              border: `1px solid ${t.cardBorder}`,
              background: t.cardBg,
              padding: 22,
              minHeight: 360,
              display: "grid",
              gap: 16,
              alignContent: "start",
            }}>
              {selectedMessage ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 22, color: t.textPrimary, fontWeight: 800 }}>{selectedMessage.name}</h3>
                      <div style={{ color: t.textMuted, fontSize: 13, marginTop: 6 }}>
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <span style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: selectedMessage.status === "unread" ? "rgba(197,98,11,0.16)" : "rgba(30,132,73,0.14)",
                      color: selectedMessage.status === "unread" ? "#C5620B" : "#1e8449",
                      fontWeight: 800,
                      fontSize: 11,
                      textTransform: "uppercase",
                    }}>
                      {selectedMessage.status}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <DetailRow label="Email" value={selectedMessage.email} />
                    <DetailRow label="Phone" value={selectedMessage.phone || "N/A"} />
                    <DetailRow label="Service requested" value={selectedMessage.service || "General inquiry"} />
                  </div>

                  <div>
                    <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      Message
                    </div>
                    <div style={{ color: t.textSecondary, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <ActionButton label="Copy Email" onClick={() => copyValue(selectedMessage.email)} />
                    <ActionButton label="Copy Phone" onClick={() => copyValue(selectedMessage.phone)} />
                    <ActionButton label="Reply via Email" onClick={() => { window.location.href = `mailto:${selectedMessage.email}`; }} />
                    <ActionButton
                      label="Reply via WhatsApp"
                      onClick={() => {
                        if (selectedPhone) {
                          window.open(`https://wa.me/${selectedPhone}`, "_blank", "noopener,noreferrer");
                        }
                      }}
                      disabled={!selectedPhone}
                    />
                    <ActionButton
                      label="Reply via SMS"
                      onClick={() => {
                        if (selectedPhone) {
                          window.location.href = `sms:${selectedPhone}`;
                        }
                      }}
                      disabled={!selectedPhone}
                    />
                  </div>
                </>
              ) : (
                <div style={{ color: t.textMuted, lineHeight: 1.7 }}>
                  Select a message to view full details and quick reply actions.
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 980px) {
            .messages-grid {
              grid-template-columns: 1fr !important;
            }

            .messages-toolbar {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </SectionShell>
  );
}

function DetailRow({ label, value }) {
  const { t } = useTheme();

  return (
    <div style={{ display: "grid", gap: 4 }}>
      <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ color: t.textPrimary, fontWeight: 600, lineHeight: 1.6 }}>
        {value}
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, disabled = false }) {
  const { t } = useTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: `1px solid ${t.border}`,
        background: disabled ? t.surface : "rgba(197,98,11,0.12)",
        color: disabled ? t.textMuted : t.textPrimary,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );
}

export function SettingsSection({ token, ChangePasswordForm }) {
  return (
    <SectionShell title="Settings" description="Admin account settings with the existing password change flow.">
      <ChangePasswordForm token={token} />
    </SectionShell>
  );
}

export function SimpleInfoSection({ title, description, body, iconType = "shield" }) {
  const { t } = useTheme();

  return (
    <SectionShell title={title} description={description}>
      <div style={{ display: "grid", gap: 18, color: t.textSecondary, lineHeight: 1.7 }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(197,98,11,0.12)",
          color: "#C5620B",
          border: "1px solid rgba(197,98,11,0.2)",
        }}>
          <StatIcon type={iconType} />
        </div>
        <div>{body}</div>
      </div>
    </SectionShell>
  );
}
