const fs = require('fs')
const crypto = require('crypto')

module.exports = function (filename, algorithm = 'md5') {
	return new Promise((resolve, reject) => {
		// Algorithm depends on availability of OpenSSL on platform
		// Another algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
		let shasum = crypto.createHash(algorithm);
		try {
			let s = fs.ReadStream(filename)
			s.on('data', function (data) {
				shasum.update(data)
			})

			s.on('end', function () {
				const hash = shasum.digest('hex')
				return resolve(hash);
			})
		} catch (error) {
			return reject('calc fail');
		}
	});
}
