import React from "react";

export default function NotificationList({ notifications }) {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-list">
      {notifications.map((n) => (
        <div key={n.id} className={`notification notification-${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
