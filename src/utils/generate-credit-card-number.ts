export const generateCreditCardNumber = () => {
	const randomDigits = Math.floor(100 + Math.random() * 900).toString()
	return `${23}/${randomDigits}`
}
