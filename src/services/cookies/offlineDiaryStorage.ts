import { CalendarEvent } from '@/app/panel/company/calendar/page'

export function saveDiaryData(data: CalendarEvent) {
  try {
    localStorage.setItem(
      'offline_diary_data',
      JSON.stringify({
        data,
        updatedAt: new Date().toISOString(),
      }),
    )
  } catch (err) {
    console.error('Erro ao salvar dados offline: ', err)
  }
}

export function getDiaryData() {
  try {
    const stored = localStorage.getItem('offline_diary_data')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed.data
  } catch (err) {
    console.error('Erro ao ler dados offline: ', err)
    return null
  }
}

export function clearDiaryDate() {
  localStorage.removeItem('offline_diary_data')
}
