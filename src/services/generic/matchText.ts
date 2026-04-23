export const matchText = (firstText: string, matchFilter: string): boolean => {
  return firstText
    ?.normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')

    .toLowerCase()
    .includes(
      matchFilter
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase(),
    )
}
