import { ReedSolomonErasure } from "@subspace/reed-solomon-erasure.wasm";

export const rs = async (file: File) => {
  fetch('https://domain.tld/path/to/reed_solomon_erasure_bg.wasm')
    .then(ReedSolomonErasure.fromResponse)
    .then(async (reedSolomonErasure) => {

      const SHARD_SIZE = 4;
      const DATA_SHARDS = 4;
      const PARITY_SHARDS = 2;

      const input = await fileToUInt8Array(file);
      const shards = new Uint8Array(SHARD_SIZE * (DATA_SHARDS + PARITY_SHARDS));
      shards.set(input.slice());

      console.log(
        'Encoding success: expect 0, result',
        reedSolomonErasure.encode(shards, DATA_SHARDS, PARITY_SHARDS),
      );

      const corruptedShards = shards.slice();
      corruptedShards.set([0, 0, 0, 0], 0);
      corruptedShards.set([0, 0, 0, 0], SHARD_SIZE);

      console.log('Corrupted shards 0 and 1');

      const result = reedSolomonErasure.reconstruct(
        corruptedShards,
        DATA_SHARDS,
        PARITY_SHARDS,
        [false, false, true, true, true, true],
      );

      console.log(
        'Reconstructing corrupted data shards: expect 0, result',
        result,
      );
      console.log(
        'Original data shards:     ',
        input.join(', '),
      );
      console.log(
        'Reconstructed data shards:',
        corruptedShards.slice(0, SHARD_SIZE * DATA_SHARDS).join(', '),
      );

    })
}

function fileToUInt8Array(file: File): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(buffer);
      resolve(uint8Array);
    };
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier.'));
    };
    reader.readAsArrayBuffer(file);
  });
}