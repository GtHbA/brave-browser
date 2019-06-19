const crypto = require('crypto')
const fs = require('fs')

module.exports = function CalculateFileChecksum(filePath, algorithm = 'sha256') {
  return new Promise((resolve, reject) => {
    try {
      const checksumGenerator = crypto.createHash(algorithm);
      const fileStream = fs.createReadStream(filePath)
      fileStream.on('error', function (err) {
        err.message = `CalculateFileChecksum error in FileStream at path "${filePath}": ${err.message}`
        reject(err)
      })
      checksumGenerator.once('readable', function () {
        const checksum = checksumGenerator.read().toString('hex')
        resolve(checksum)
      })
      fileStream.pipe(checksumGenerator)
    } catch (err) {
      err.message = `CalculateFileChecksum error using algorithm "${algorithm}" at path "${filePath}": ${err.message}`
      reject(err);
    }
  });
}
