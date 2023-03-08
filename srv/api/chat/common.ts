import { AppSchema } from '../../db/schema'

/**
 * A single response can contain multiple end tokens
 *
 * Find the first occurrence of an end token then return the text preceding it
 */
export function trimResponse(
  generated: string,
  char: AppSchema.Character,
  members: AppSchema.Profile[],
  endTokens: string[]
) {
  const baseEndTokens = [`${char.name}:`, `${char.name} :`, 'END_OF_DIALOG', '<END>','\n\n']
  const placeholder = 'NEWLINE_PLACEHOLDER'
  const trimmedGenerated = generated.replace(/\n\n/g, placeholder).trim().replace(new RegExp(placeholder, 'g'), '\n\n')
  for (const member of members) {
    baseEndTokens.push(`${member.handle}:`, `${member.handle} :`)
  }

  const trimmed = baseEndTokens.concat(...endTokens).reduce(
    (prev, curr) => {
      const index = trimmedGenerated.indexOf(curr)
      if (index === -1) return prev
      const text = trimmedGenerated.slice(0, index)
      if (prev.index === -1) return { index, response: text }
      return index < prev.index ? { index, response: text } : prev
    },
    { index: -1, response: '' }
  )
console.log(trimmedGenerated)
console.log('trimmed', trimmed)
  if (trimmed.index === -1) {
    return { index: -1, response: trimmedGenerated.trim() }
  }
  return trimmed
}

export function joinParts(parts: string[]) {
  return parts.map(sanitise).join(' ')
}

export function sanitise(generated: string) {
  return generated.replace(/\s+/g, ' ').trim()
}
