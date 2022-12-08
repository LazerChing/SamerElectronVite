export const awaitWrapper = async (promise: Promise<any>) => {
	try {
		const res = await promise;
		return [null, res];
	} catch (err) {
		return [err, null];
	}
}