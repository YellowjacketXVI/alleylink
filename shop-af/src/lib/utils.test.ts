import { describe, it, expect } from 'vitest'
import { validateUsername, isValidEmail, USERNAME_RULES } from './utils'

describe('utils.validateUsername', () => {
  it('rejects empty', () => {
    expect(validateUsername('')).toEqual({ isValid: false, error: 'Username is required' })
  })

  it('enforces length bounds', () => {
    expect(validateUsername('aa').isValid).toBe(false)
    expect(validateUsername('a'.repeat(USERNAME_RULES.maxLength + 1)).isValid).toBe(false)
  })

  it('accepts valid username', () => {
    expect(validateUsername('user_name-1').isValid).toBe(true)
  })

  it('rejects reserved words', () => {
    expect(validateUsername('admin').isValid).toBe(false)
  })

  it('rejects consecutive special chars and edge hyphens', () => {
    expect(validateUsername('user__name').isValid).toBe(false)
    expect(validateUsername('-username').isValid).toBe(false)
    expect(validateUsername('username_').isValid).toBe(false)
  })
})

describe('utils.isValidEmail', () => {
  it('validates basic email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('bad@com')).toBe(false)
    expect(isValidEmail('n@@e.com')).toBe(false)
  })
})
