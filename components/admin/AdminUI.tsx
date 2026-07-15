"use client";

import { ReactNode } from "react";
import styles from "./AdminUI.module.css";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderTop}>
        <div className={styles.pageTitleRow}>
          <span className={styles.pageTitleRule} aria-hidden="true" />
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
        {action}
      </div>
      {description && <p className={styles.pageDescription}>{description}</p>}
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={active === tab.value}
          className={`${styles.tab} ${active === tab.value ? styles.tabActive : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function Card({
  children,
  title,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div className={`${styles.card} ${styles.cardPadded} ${className}`}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "gold" | "danger" | "success" | "ghost";

export function Button({
  children,
  variant = "primary",
  small = false,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  small?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const variantClass = {
    primary: styles.btnPrimary,
    gold: styles.btnGold,
    danger: styles.btnDanger,
    success: styles.btnSuccess,
    ghost: styles.btnGhost,
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${variantClass} ${small ? styles.btnSmall : ""}`}
    >
      {children}
    </button>
  );
}

export function ActionsRow({ children }: { children: ReactNode }) {
  return <div className={styles.actionsRow}>{children}</div>;
}

export function Badge({ tone, children }: { tone: "success" | "warn"; children: ReactNode }) {
  const toneClass = tone === "success" ? styles.badgeSuccess : styles.badgeWarn;
  return <span className={`${styles.badge} ${toneClass}`}>{children}</span>;
}

export type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  full?: boolean; // renders full-width on mobile (no inline label), for long text
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "Aucun élément pour le moment.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className={styles.tableWrap}>
        <div className={styles.emptyState}>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  data-label={col.label}
                  data-full={col.full ? "true" : undefined}
                  className={col.key === "actions" ? styles.cellActions : undefined}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={styles.input} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={styles.textarea} />;
}

export function Grid2({ children }: { children: ReactNode }) {
  return <div className={`${styles.grid} ${styles.grid2}`}>{children}</div>;
}
