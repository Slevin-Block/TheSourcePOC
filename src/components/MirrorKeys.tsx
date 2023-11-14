import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';
import { MirrorKeys, useMirrorKeys } from "../utils/MirrorKeys";


export interface User {
  address: `0x${string}` | undefined;
  mirrorKeys?: MirrorKeys;
}

interface Props {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const MirrorKeysCmp = ({ user, setUser }: Props) => {
  //console.log(user)
  const [password, setPassword] = useState('1Lov3The$ource')
  const [loading, setLoading] = useState<Boolean>(false)
  const { address } = useAccount()
  useEffect(() => { setUser({ address: address }) }, [address])

  const { mirrorAccount } = useMirrorKeys();

  const handleLogin = async () => {
    if (password) {
      setLoading(true)
      const add_on = await mirrorAccount(password)
      setLoading(false)
      if (add_on) setUser({ ...user, mirrorKeys: { ...add_on } })
    }
  };

  return (
    <>
      <h3>Mirror Keys</h3>
      <div>
        <label>Pass :</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Create your Mirror Wallet</button>
      {(loading && !user?.mirrorKeys) && <p>Keys pair is being generated ...</p>}
      {(!loading && !!user?.mirrorKeys) &&
        Object.entries(user?.mirrorKeys).map((field, id) =>
          field[0] !== 'wallet' &&
          <div key={id} className='info'>
            {field[0] === 'controlAddress' ? <p>{field[0]} {field[1]}</p> :
              <p>{field[0]} has been generated</p>
            }
          </div>
        )
      }
    </>
  )
}

export default MirrorKeysCmp