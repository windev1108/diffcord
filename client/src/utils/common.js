export const isEqualData = (first, second) =>
    JSON.stringify(first) === JSON.stringify(second);
  
export const generateSignature = (publicId, apiSecret) => {
	const timestamp = new Date().getTime();
	return {
		signature: `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`,
		timestamp
	};
};