import { useRef, useState } from 'react'
import { decrypt } from '../utils/crypto';
import { pki } from 'node-forge';

interface Props {
  encodedRGP: string;
  privateKey: pki.rsa.PrivateKey;
}

const Decrypt = ({ encodedRGP, privateKey }: Props) => {

  const [encodedRGPkey,] = useState(encodedRGP)
  const [key,] = useState<pki.rsa.PrivateKey>(privateKey)
  const fileInput = useRef<HTMLInputElement>(null)

  const handleEncrypt = async () => {
    if (fileInput?.current?.files) {
      await decrypt(fileInput?.current?.files[0], encodedRGPkey, key);
      /* const RGP = await decryptFor(encodedRGPkey, key)
      if (!RGP) throw console.log("Error, invalid decrypt key")
      if (typeof RGP === 'string') decryptFor(fileInput?.current?.files[0], RGP) */
    }

  }


  return (
    <div>
      <h3>Decrypt</h3>
      <input ref={fileInput} type="file" />
      <button
        onClick={handleEncrypt}
        disabled={(key) ? false : true}>
        Decrypt File
      </button>
    </div>
  )
}

export default Decrypt