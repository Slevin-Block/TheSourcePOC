import { loremIpsum } from 'lorem-ipsum';
import { useRef } from 'react'
import { splitSSS } from '../utils/shamir';

const Shamir = () => {


  const TextInput = useRef<HTMLInputElement>(null)
  const QtInput = useRef<HTMLInputElement>(null)
  const MinInput = useRef<HTMLInputElement>(null)

  const GenerateRandomText = () => {
    if (TextInput?.current)
      TextInput.current.value = loremIpsum({ count: 1 })
  }


  const handleEncrypt = () => {
    const text = TextInput?.current?.value;
    const qt = QtInput?.current?.value;
    const min = MinInput?.current?.value;
    if (text && qt && min) {
      splitSSS(text, parseInt(qt), parseInt(min), true);
    }
  }


  return (
    <div>
      <h3>Shamir Secret Sharing</h3>
      <div>
        <label >Text :</label>
        <input ref={TextInput} type="text" className='' />
      </div>
      <div className='inline'>
        <div className='block'>
          <label >QT :</label>
          <input ref={QtInput} type="number" className='small' min="0" defaultValue={10} />
        </div>
        <div className='block'>
          <label >Min :</label>
          <input ref={MinInput} type="number" className='small' min="0" defaultValue={3} />
        </div>
      </div>
      <div>
        <button
          onClick={GenerateRandomText}>
          Gen. Text
        </button>
        <button
          onClick={handleEncrypt}>
          Secret Sharing Simulation
        </button>
      </div>
    </div>
  )
}

export default Shamir