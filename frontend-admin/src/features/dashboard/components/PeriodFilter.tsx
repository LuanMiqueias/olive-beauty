import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface PeriodFilterProps {
  value: number
  onChange: (days: number) => void
}

const PERIODS = [
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 15 dias', value: 15 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'Últimos 90 dias', value: 90 },
]

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <Select value={value.toString()} onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione o período" />
      </SelectTrigger>
      <SelectContent>
        {PERIODS.map((period) => (
          <SelectItem key={period.value} value={period.value.toString()}>
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

