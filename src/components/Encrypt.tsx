import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { encrypt } from "../utils/crypto";
import { pki } from "node-forge";

declare const window: any;


interface Props {
  publicKey: pki.rsa.PublicKey;
  encodedRGP: string;
  setEncodedRGP: React.Dispatch<React.SetStateAction<string>>;
}

export default function Encrypt({ publicKey, encodedRGP, setEncodedRGP }: Props) {

  const fileInput = useRef<HTMLInputElement>(null)
  const [key,] = useState<pki.rsa.PublicKey>(publicKey)
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()
  const [RGP, setRGP] = useState<string>()

  // Metamask auto-connection
  useEffect(() => {
    if (!isConnected) {
      const connector = connectors[0]
      connect({ connector })
    }
  }, [connectors])

  const handleEncrypt = async () => {
    if (fileInput.current?.files && key) {
      const file = fileInput.current?.files[0]
      const res = await encrypt(file, key)
      //const res = await encryptFor(file, key)
      setRGP(res.RGP)
      setEncodedRGP(res.encryptedRGP);
    }
  }

  return (
    <>
      <div>
        <h3>Encrypt</h3>
        <input ref={fileInput} type="file" />
        <button
          onClick={handleEncrypt}
          disabled={key ? false : true}>
          Encrypt File
        </button>
        {encodedRGP &&
          <>
            <div>
              <p>RGP</p>
              <p>{RGP}</p>
            </div>
            <div>
              <p>Encoder RGP</p>
              <p>{encodedRGP}</p>
            </div>
          </>
        }
      </div>
    </>
  );
};