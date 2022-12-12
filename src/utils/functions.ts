/**
 * await包装器，用来async await操作捕获错误
 * @param promise 
 * @returns [err, res]
 */
export const awaitWrapper = async (promise: Promise<any>) => {
	try {
		const res = await promise;
		return [null, res];
	} catch (err) {
		return [err, null];
	}
}