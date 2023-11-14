import { useState } from 'react'

import random, { testRandom } from '../utils/random'
import generatePassword from '../utils/password'
import owasp from 'owasp-password-strength-test';
import { cryptoConfig } from '../utils/crypto.config';
import { splitSSS } from '../utils/shamir';

type PasswordReport = {
  length: number,
  charRef: number,
  isPassphrase: boolean,
  isStrong: boolean,
  robustness: number
}

const Randomize = () => {
  const [password, setPassWord] = useState<string>('')
  const [report, setReport] = useState<PasswordReport | null>(null)

  const handleTestRandom = () => {
    testRandom(1000000, 1, 90, 'all')
  }

  const handleShamir = () => {
    splitSSS()
  }

  const handleRandom = () => {
    const value = random(1, 10)
    if (typeof value === "number") {
      const { password, baseLength } = generatePassword(cryptoConfig)
      if (password) {
        try {
          const result = owasp.test(password);
          const isPassphrase = result.isPassphrase;
          const isStrong = result.strong;
          setReport({
            length: cryptoConfig.length,
            charRef: baseLength,
            isPassphrase,
            isStrong,
            robustness: Math.round(Math.log(baseLength) / Math.log(2) * cryptoConfig.length)
          })
        } catch (e) {
          console.error(e);
          setReport(null);
        }
      } else {
        setReport(null);
      };

      setPassWord(password)
    }
  }
  return (
    <>
      <h3>Randomize</h3>
      <h3>Password : {password}</h3>
      {report && <>
        <h4>Report :</h4>
        <ul>
          <li>Length : {report.length}</li>
          <li>Alphabet : {report.charRef}</li>
          <li>Bits : {report.robustness}</li>
          <li>Strong : {report.isStrong ? 'true' : 'false'}</li>
          <li>Passphrase : {report.isPassphrase ? 'true' : 'false'}</li>
        </ul>
      </>
      }
      <button onClick={handleRandom}>Generate Password</button>
      <button onClick={handleTestRandom}>Randomization Standard Deviation</button>
      <button onClick={handleShamir}>Test Shamir Secret Sharing</button>
    </>
  )
}

export default Randomize