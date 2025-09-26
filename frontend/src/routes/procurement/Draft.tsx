"use client"
import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useCreateContract } from '@/hooks/useProcurement'

type Step = 1 | 2 | 3 | 4

type FormState = {
  name: string
  first_party: string
  second_party: string
  contract_type: string
  first_address: string
  second_address: string
  first_contact: string
  second_contact: string
  summary: string
  value_rp: number
  duration_months: number
  start_date: string
  end_date: string
  key_clauses: string
}

const STEP_CONFIG: Array<{ id: Step; title: string }> = [
  { id: 1, title: 'Contract Parties' },
  { id: 2, title: 'Contract Details' },
  { id: 3, title: 'Key Clauses' },
  { id: 4, title: 'Review' },
]

export default function DraftContract() {
  const { create } = useCreateContract()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>({
    name: '',
    first_party: 'PT Integrasi Logistik Cipta Solusi (ILCS)',
    second_party: '',
    contract_type: '',
    first_address: '',
    second_address: '',
    first_contact: '',
    second_contact: '',
    summary: '',
    value_rp: 0,
    duration_months: 12,
    start_date: '',
    end_date: '',
    key_clauses: '',
  })

  const currentStep = useMemo(() => STEP_CONFIG.find((cfg) => cfg.id === step)!, [step])

  function next() {
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s))
  }

  function prev() {
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s))
  }

  async function saveDraft() {
    await create({
      name: form.name,
      first_party: form.first_party,
      second_party: form.second_party,
      value_rp: form.value_rp,
      duration_months: form.duration_months,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: 'Draft',
    })
    alert('Draft disimpan sebagai Draft')
  }

  async function submitToLegal() {
    await create({
      name: form.name,
      first_party: form.first_party,
      second_party: form.second_party,
      value_rp: form.value_rp,
      duration_months: form.duration_months,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: 'Pending Review',
    })
    alert('Draft telah dikirim ke Legal')
  }

  return (
    <div className="space-y-6">
      <StepHeader step={step} />
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="space-y-2">
          <p className="text-sm font-medium text-slate-400">
            Step {step} of 4 · {currentStep.title}
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">Draft Contract</h1>
          <p className="text-sm text-slate-500">Create a new contract using our step-by-step wizard.</p>
        </header>

        <div className="mt-8 space-y-6">
          {step === 1 && <Step1 form={form} setForm={setForm} />}
          {step === 2 && <Step2 form={form} setForm={setForm} />}
          {step === 3 && <Step3 form={form} setForm={setForm} />}
          {step === 4 && <Step4 form={form} />}
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span className="font-semibold">?</span>
              Save Draft
            </button>
            <span className="text-xs text-slate-400">Auto-saved a few seconds ago</span>
          </div>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={prev}
                className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Previous
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={next}
                className="rounded-xl bg-[#357ABD] px-5 py-2 font-medium text-white transition hover:bg-[#2e6dad]"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={submitToLegal}
                className="rounded-xl bg-[#357ABD] px-5 py-2 font-medium text-white transition hover:bg-[#2e6dad]"
              >
                Submit to Legal
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

function StepHeader({ step }: { step: Step }) {
  return (
    <div className="rounded-full bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {STEP_CONFIG.map((item, idx) => {
          const active = item.id <= step
          const isCurrent = item.id === step
          return (
            <div key={item.id} className="flex flex-1 items-center gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition ${
                    active ? 'border-[#357ABD] bg-[#357ABD] text-white' : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {item.id}
                </div>
                <div className="hidden flex-col text-sm text-slate-500 md:flex">
                  <span className={`font-medium ${isCurrent ? 'text-slate-900' : ''}`}>{item.title}</span>
                </div>
              </div>
              {idx < STEP_CONFIG.length - 1 && (
                <div
                  className={`h-px flex-1 ${item.id < step ? 'bg-[#357ABD]' : 'bg-slate-200'}`}
                  aria-hidden
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Field({ label, children, hint, className }: { label: string; children: React.ReactNode; hint?: string; className?: string }) {
  return (
    <label className={`space-y-2 text-sm ${className ?? ''}`}>
      <span className="block font-medium text-slate-600">{label}</span>
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
      {children}
    </label>
  )
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#357ABD] focus:ring-2 focus:ring-[#357ABD]/20 ${
        className ?? ''
      }`}
    />
  )
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props
  return (
    <textarea
      {...rest}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#357ABD] focus:ring-2 focus:ring-[#357ABD]/20 ${
        className ?? ''
      }`}
    />
  )
}

type StepProps = {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
}

function Step1({ form, setForm }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Step 1: Contract Parties</h2>
        <p className="text-sm text-slate-500">Enter the details of the contracting parties.</p>
      </div>
      <div className="grid gap-4">
        <Field label="Name of the First Party">
          <Input
            placeholder="PT ILCS (Indonesia Logistics and Cargo Services)"
            value={form.first_party}
            onChange={(e) => setForm((f) => ({ ...f, first_party: e.target.value }))}
          />
        </Field>
        <Field label="Name of the Second Party">
          <Input
            placeholder="Enter the name of the Second Party"
            value={form.second_party}
            onChange={(e) => setForm((f) => ({ ...f, second_party: e.target.value }))}
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Contract Type">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#357ABD] focus:ring-2 focus:ring-[#357ABD]/20"
              value={form.contract_type}
              onChange={(e) => setForm((f) => ({ ...f, contract_type: e.target.value }))}
            >
              <option value="">Select contract type</option>
              <option value="Goods">Goods</option>
              <option value="Services">Services</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Consulting">Consulting</option>
            </select>
          </Field>
          <Field label="Contract Name">
            <Input
              placeholder="Enter contract name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First Party Address">
            <Textarea
              rows={3}
              placeholder="Enter full address"
              value={form.first_address}
              onChange={(e) => setForm((f) => ({ ...f, first_address: e.target.value }))}
            />
          </Field>
          <Field label="Second Party Address">
            <Textarea
              rows={3}
              placeholder="Enter full address"
              value={form.second_address}
              onChange={(e) => setForm((f) => ({ ...f, second_address: e.target.value }))}
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First Party Contact Person" hint="Name and position">
            <Input
              placeholder="Name and position"
              value={form.first_contact}
              onChange={(e) => setForm((f) => ({ ...f, first_contact: e.target.value }))}
            />
          </Field>
          <Field label="Second Party Contact Person" hint="Name and position">
            <Input
              placeholder="Name and position"
              value={form.second_contact}
              onChange={(e) => setForm((f) => ({ ...f, second_contact: e.target.value }))}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}

function Step2({ form, setForm }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Step 2: Contract Details</h2>
        <p className="text-sm text-slate-500">Capture the commercial terms and contract period.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Contract Value (Rp)">
          <Input
            type="number"
            placeholder="2500000000"
            value={form.value_rp}
            onChange={(e) => setForm((f) => ({ ...f, value_rp: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Duration (months)">
          <Input
            type="number"
            placeholder="12"
            value={form.duration_months}
            onChange={(e) => setForm((f) => ({ ...f, duration_months: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Start Date">
          <Input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
          />
        </Field>
        <Field label="End Date">
          <Input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
          />
        </Field>
        <Field label="Contract Summary" hint="Short description of scope and objectives" className="md:col-span-2">
          <Textarea
            rows={4}
            placeholder="Describe the main scope, deliverables, and objectives"
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          />
        </Field>
      </div>
    </div>
  )
}

function Step3({ form, setForm }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Step 3: Key Clauses</h2>
        <p className="text-sm text-slate-500">Highlight clauses that Legal should pay attention to.</p>
      </div>
      <Field label="Key Clauses" hint="Termination, penalty, SLA, exclusivity, and other special terms">
        <Textarea
          rows={6}
          placeholder="List important clauses or paste key excerpts here"
          value={form.key_clauses}
          onChange={(e) => setForm((f) => ({ ...f, key_clauses: e.target.value }))}
        />
      </Field>
    </div>
  )
}

function Step4({ form }: { form: FormState }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Step 4: Review</h2>
        <p className="text-sm text-slate-500">Make sure everything looks correct before submitting to Legal.</p>
      </div>
      <dl className="grid gap-4 md:grid-cols-2">
        <ReviewItem label="Contract Name" value={form.name} />
        <ReviewItem label="Contract Type" value={form.contract_type} />
        <ReviewItem label="First Party" value={form.first_party} />
        <ReviewItem label="Second Party" value={form.second_party} />
        <ReviewItem label="First Party Address" value={form.first_address} />
        <ReviewItem label="Second Party Address" value={form.second_address} />
        <ReviewItem label="First Party Contact" value={form.first_contact} />
        <ReviewItem label="Second Party Contact" value={form.second_contact} />
        <ReviewItem label="Contract Value" value={`Rp ${Number(form.value_rp || 0).toLocaleString('id-ID')}`} />
        <ReviewItem label="Duration" value={`${form.duration_months || '-'} months`} />
        <ReviewItem label="Start Date" value={form.start_date || '-'} />
        <ReviewItem label="End Date" value={form.end_date || '-'} />
        <ReviewItem label="Summary" value={form.summary} fullWidth />
        <ReviewItem label="Key Clauses" value={form.key_clauses} fullWidth />
      </dl>
    </div>
  )
}

function ReviewItem({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={`${fullWidth ? 'md:col-span-2' : ''} space-y-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3`}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-700">{value || '-'}</dd>
    </div>
  )
}
