export function shouldForwardProp(prop: string) {
  return !prop.startsWith('$')
}

export const transientOptions = {
  shouldForwardProp,
}
