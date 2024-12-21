export const formatDisciplineName = (disciplineName: string) => {
	const words = disciplineName.split(/[\s-]+/)

	if (words.length === 1 || words.length === 2) return disciplineName

	return words
		.map((word, idx) => {
			if (word.toLowerCase() === 'и' && idx > 0 && idx < words.length - 1)
				return word.toLowerCase()

			return word.charAt(0).toUpperCase()
		})
		.join('')
}
