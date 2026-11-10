"use client";

import { useId, useState, type ReactNode } from "react";
import type { CampaignInput, CampaignStatus } from "@/gql/graphql";
import { matchLabels, statusLabels, triggerLabels } from "@/shared/format";
import {
  LIMITS,
  normalizeCampaignInput,
  validateCampaignInput,
  validateNewCampaign,
  type FieldError,
} from "@/shared/validation";
import { formValuesToInput, type CampaignFormValues } from "./formValues";
import { PopupPreview } from "./PopupPreview";

interface CampaignFormProps {
  mode: "create" | "edit";
  initialValues: CampaignFormValues;
  /** Current server status in edit mode; publish/pause outside the form updates it. */
  serverStatus?: CampaignStatus;
  submitting: boolean;
  /** Resolves to server field errors, or an empty array on success. */
  onSubmit: (input: CampaignInput) => Promise<FieldError[]>;
}

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none aria-invalid:border-red-400";

function Field({
  label,
  error,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-700">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function CampaignForm({ mode, initialValues, serverStatus, submitting, onSubmit }: CampaignFormProps) {
  const id = useId();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Keep the status select in step with publish/pause done outside the form
  // (adjusting state during render instead of in an effect).
  const [seenStatus, setSeenStatus] = useState(serverStatus);
  if (serverStatus !== seenStatus) {
    setSeenStatus(serverStatus);
    if (serverStatus) setValues((v) => ({ ...v, status: serverStatus }));
  }

  const set = <K extends keyof CampaignFormValues>(key: K, value: CampaignFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const input = formValuesToInput(values);
  const previewDelay = Number.isFinite(input.delaySeconds) ? input.delaySeconds : 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeCampaignInput(input);
    const clientErrors = mode === "create" ? validateNewCampaign(normalized) : validateCampaignInput(normalized);
    const found = clientErrors.length > 0 ? clientErrors : await onSubmit(normalized);
    setErrors(Object.fromEntries(found.map((e) => [e.field, e.message])));
  }

  const statusOptions: CampaignStatus[] = mode === "create" ? ["DRAFT", "LIVE"] : ["DRAFT", "LIVE", "PAUSED"];
  const f = (name: string) => `${id}-${name}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Content</h2>
          <Field label="Name" htmlFor={f("name")} error={errors.name} hint="Only you see this.">
            <input
              id={f("name")}
              className={inputClass}
              value={values.name}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Headline" htmlFor={f("headline")} error={errors.headline}>
            <input
              id={f("headline")}
              className={inputClass}
              value={values.headline}
              aria-invalid={Boolean(errors.headline)}
              onChange={(e) => set("headline", e.target.value)}
            />
          </Field>
          <Field label="Body" htmlFor={f("body")} error={errors.body} hint="Optional. One or two short sentences.">
            <textarea
              id={f("body")}
              rows={2}
              className={inputClass}
              value={values.body}
              aria-invalid={Boolean(errors.body)}
              onChange={(e) => set("body", e.target.value)}
            />
          </Field>
          <Field label="Button label" htmlFor={f("cta")} error={errors.ctaLabel}>
            <input
              id={f("cta")}
              className={inputClass}
              value={values.ctaLabel}
              aria-invalid={Boolean(errors.ctaLabel)}
              onChange={(e) => set("ctaLabel", e.target.value)}
            />
          </Field>
        </section>

        <section className="space-y-4 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-semibold text-slate-900">Display rules</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Trigger" htmlFor={f("trigger")}>
              <select
                id={f("trigger")}
                className={inputClass}
                value={values.triggerType}
                onChange={(e) => set("triggerType", e.target.value as CampaignFormValues["triggerType"])}
              >
                {(Object.keys(triggerLabels) as (keyof typeof triggerLabels)[]).map((t) => (
                  <option key={t} value={t}>
                    {triggerLabels[t]}
                  </option>
                ))}
              </select>
            </Field>
            {values.triggerType === "SCROLL" && (
              <Field label="Scroll %" htmlFor={f("scroll")} error={errors["trigger.scrollPercent"]}>
                <input
                  id={f("scroll")}
                  type="number"
                  min={1}
                  max={100}
                  className={inputClass}
                  value={values.scrollPercent}
                  aria-invalid={Boolean(errors["trigger.scrollPercent"])}
                  onChange={(e) => set("scrollPercent", e.target.value)}
                />
              </Field>
            )}
            <Field label="Delay (seconds)" htmlFor={f("delay")} error={errors.delaySeconds}>
              <input
                id={f("delay")}
                type="number"
                min={0}
                max={LIMITS.maxDelaySeconds}
                className={inputClass}
                value={values.delaySeconds}
                aria-invalid={Boolean(errors.delaySeconds)}
                onChange={(e) => set("delaySeconds", e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
            <Field label="Show when URL" htmlFor={f("match")}>
              <select
                id={f("match")}
                className={inputClass}
                value={values.urlMatch}
                onChange={(e) => set("urlMatch", e.target.value as CampaignFormValues["urlMatch"])}
              >
                {(Object.keys(matchLabels) as (keyof typeof matchLabels)[]).map((m) => (
                  <option key={m} value={m}>
                    {matchLabels[m]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="URL path" htmlFor={f("url")} error={errors["targetUrl.value"]}>
              <input
                id={f("url")}
                className={`${inputClass} font-mono`}
                value={values.urlValue}
                aria-invalid={Boolean(errors["targetUrl.value"])}
                onChange={(e) => set("urlValue", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-6">
          <div className="w-48">
            <Field label="Status" htmlFor={f("status")} error={errors.status}>
              <select
                id={f("status")}
                className={inputClass}
                value={values.status}
                onChange={(e) => set("status", e.target.value as CampaignStatus)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {submitting ? "Saving…" : mode === "create" ? "Create campaign" : "Save changes"}
          </button>
        </section>
      </form>

      <aside className="space-y-2 lg:sticky lg:top-6 lg:self-start">
        <h2 className="text-sm font-semibold text-slate-900">Live preview</h2>
        <PopupPreview
          headline={values.headline}
          body={values.body}
          ctaLabel={values.ctaLabel}
          trigger={{ type: input.trigger.type, scrollPercent: input.trigger.scrollPercent ?? null }}
          delaySeconds={previewDelay}
          targetUrl={input.targetUrl}
        />
      </aside>
    </div>
  );
}
