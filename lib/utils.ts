import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBand(band: number): string {
  return band % 1 === 0 ? band.toFixed(1) : band.toString()
}

export function bandToLabel(band: number): string {
  if (band >= 9) return 'Expert'
  if (band >= 8) return 'Very Good'
  if (band >= 7) return 'Good'
  if (band >= 6) return 'Competent'
  if (band >= 5) return 'Modest'
  if (band >= 4) return 'Limited'
  return 'Beginner'
}

export function bandToColor(band: number): string {
  if (band >= 8) return 'text-emerald-400'
  if (band >= 7) return 'text-blue-400'
  if (band >= 6) return 'text-yellow-400'
  if (band >= 5) return 'text-orange-400'
  return 'text-red-400'
}

export function xpToLevel(xp: number): { level: number; title: string; nextXp: number; progress: number } {
  const levels = [
    { xp: 0, title: 'Beginner' },
    { xp: 100, title: 'Bronze' },
    { xp: 300, title: 'Silver' },
    { xp: 700, title: 'Gold' },
    { xp: 1500, title: 'Platinum' },
    { xp: 3000, title: 'Diamond' },
    { xp: 6000, title: 'Master' },
  ]

  let level = 0
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) level = i
  }

  const currentLevelXp = levels[level].xp
  const nextLevelXp = levels[level + 1]?.xp ?? currentLevelXp + 1000
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100

  return {
    level: level + 1,
    title: levels[level].title,
    nextXp: nextLevelXp,
    progress: Math.min(100, Math.round(progress)),
  }
}

export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return d.toLocaleDateString('vi-VN')
}
