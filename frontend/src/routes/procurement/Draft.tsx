"use client"
import { useState } from 'react'
import type { Dispatch, SetStateAction, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import Card from '@/components/Card'
import { useCreateContract } from '@/hooks/useProcurement'

type Step = 1 | 2 | 3 | 4

type FormState = {
  name: string
  first_party: string
  second_party: string
  first_address: string
  second_address: string
  contract_type: string
  category: string
  summary: string
  value_rp: number
  duration_months: number
  start_date: string
  end_date: string
  key_clauses: string
}

export default function DraftContract() {
  const { create } = useCreateContract()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>({
    name: '',
    first_party: 'PT Integrasi Logistik Cipta Solusi (ILCS)',
    second_party: '',
    first_address: '',
    second_address: '',
    contract_type: '',
    category: '',
    summary: '',
    value_rp: 0,
    duration_months: 12,
    start_date: '',
    end_date: '',
    key_clauses: '',
  })

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
    alert('Draft saved')
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
    alert('Submitted to Legal')
  }

  return (
    <div className="grid gap-6">
      <StepHeader step={step} />
      <Card title={`Step ${step}`}>
        {step === 1 && <Step1 form={form} setForm={setForm} />}
        {step === 2 && <Step2 form={form} setForm={setForm} />}
        {step === 3 && <Step3 form={form} setForm={setForm} />}
        {step === 4 && <Step4 form={form} />}
        <div className="mt-4 flex gap-2">
          {step > 1 && (
            <button className="rounded-xl border px-4 py-2" onClick={prev}>
              Back
            </button>
          )}
          {step < 4 && (
            <button className="rounded-xl bg-gray-900 px-4 py-2 text-white" onClick={next}>
              Next
            </button>
          )}
          {step === 4 && (
            <>
              <button className="rounded-xl border px-4 py-2" onClick={saveDraft}>
                Save Draft
              </button>
              <button className="rounded-xl bg-gray-900 px-4 py-2 text-white" onClick={submitToLegal}>
                Submit to Legal
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

function StepHeader({ step }: { step: number }) {
  const labels = ['Parties and Basics', 'Contract Details', 'Key Clauses', 'Review']
  return (
    <div className="flex items-center gap-3">
      {labels.map((label, index) => (
        <div key={label} className="flex items-center gap-3">
          <div className={`grid h-8 w-8 place-items-center rounded-full text-sm ${index + 1 <= step ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>
            {index + 1}
          </div>
          <div className={`text-sm ${index + 1 <= step ? 'font-semibold' : ''}`}>{label}</div>
          {index < labels.length - 1 ? <div className="h-px w-8 bg-gray-300" /> : null}
        </div>
      ))}
    </div>
  )
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return <input {...rest} className={`border rounded-xl px-3 py-2 ${className ?? ''}`} />
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props
  return <textarea {...rest} className={`border rounded-xl px-3 py-2 ${className ?? ''}`} />
}

type StepProps = {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
}

function Step1({ form, setForm }: StepProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Input placeholder="Nama Kontrak" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      <Input placeholder="Jenis Kontrak" value={form.contract_type} onChange={(e) => setForm((f) => ({ ...f, contract_type: e.target.value }))} />
      <Input placeholder="Kategori Kontrak" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
      <Textarea
        placeholder="Deskripsi Singkat"
        className="md:col-span-2"
        value={form.summary}
        onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
      />
      <Input placeholder="Pihak Pertama" value={form.first_party} onChange={(e) => setForm((f) => ({ ...f, first_party: e.target.value }))} />
      <Input placeholder="Alamat Pihak Pertama" value={form.first_address} onChange={(e) => setForm((f) => ({ ...f, first_address: e.target.value }))} />
      <Input placeholder="Pihak Kedua" value={form.second_party} onChange={(e) => setForm((f) => ({ ...f, second_party: e.target.value }))} />
      <Input placeholder="Alamat Pihak Kedua" value={form.second_address} onChange={(e) => setForm((f) => ({ ...f, second_address: e.target.value }))} />
    </div>
  )
}

function Step2({ form, setForm }: StepProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Input
        placeholder="Nilai Kontrak (Rp)"
        type="number"
        value={form.value_rp}
        onChange={(e) => setForm((f) => ({ ...f, value_rp: Number(e.target.value) }))}
      />
      <Input
        placeholder="Durasi (bulan)"
        type="number"
        value={form.duration_months}
        onChange={(e) => setForm((f) => ({ ...f, duration_months: Number(e.target.value) }))}
      />
      <Input placeholder="Tanggal Mulai" type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
      <Input placeholder="Tanggal Berakhir" type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
    </div>
  )
}

function Step3({ form, setForm }: StepProps) {
  return (
    <div className="grid gap-3">
      <Textarea
        placeholder="Key clauses (optional) - misal: termination, penalty, SLA..."
        value={form.key_clauses}
        onChange={(e) => setForm((f) => ({ ...f, key_clauses: e.target.value }))}
      />
    </div>
  )
}

function Step4({ form }: { form: FormState }) {
  return (
    <div className="text-sm">
      <div className="mb-2 font-semibold">Review</div>
      <ul className="grid gap-2 md:grid-cols-2">
        <li>
          <b>Nama Kontrak:</b> {form.name || '-'}
        </li>
        <li>
          <b>Pihak Pertama:</b> {form.first_party || '-'}
        </li>
        <li>
          <b>Pihak Kedua:</b> {form.second_party || '-'}
        </li>
        <li>
          <b>Nilai:</b> Rp {Number(form.value_rp || 0).toLocaleString('id-ID')}
        </li>
        <li>
          <b>Durasi:</b> {form.duration_months || '-'} bulan
        </li>
        <li>
          <b>Periode:</b> {form.start_date || '-'} s/d {form.end_date || '-'}
        </li>
        <li className="md:col-span-2">
          <b>Key Clauses:</b> {form.key_clauses || '-'}
        </li>
        <li className="md:col-span-2">
          <b>Ringkas:</b> {form.summary || '-'}
        </li>
      </ul>
    </div>
  )
}
