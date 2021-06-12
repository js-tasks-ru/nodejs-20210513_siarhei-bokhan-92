const toClient = data => {
	const {_id: id, __v, ...rest} = data;
	return {...rest, id};
};

module.exports = {
	toClient,
};
