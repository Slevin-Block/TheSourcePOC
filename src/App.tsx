import { useState } from 'react'
import './App.css'
import Encrypt from './components/Encrypt'
import MirrorWalletCmp, { User } from './components/MirrorKeys'
import Randomize from './components/Randomize'
import Decrypt from './components/Decrypt'
import Shamir from './components/Shamir'
/* import ReedSolomon from './components/ReedSolomon' */

function App() {

  const [user, setUser] = useState<User>({ address: undefined })
  const [encodedRGP, setEncodedRGP] = useState<string>('')

  return (
    <>
      <Randomize />
      {/* <ReedSolomon /> */}
      <MirrorWalletCmp user={user} setUser={setUser} />
      {user?.mirrorKeys &&
        <Encrypt publicKey={user?.mirrorKeys?.publicKey} encodedRGP={encodedRGP} setEncodedRGP={setEncodedRGP} />
      }
      {(encodedRGP && user?.mirrorKeys) &&
        <Decrypt encodedRGP={encodedRGP} privateKey={user?.mirrorKeys?.privateKey} />
      }
      <Shamir />
    </>
  )
}

export default App
