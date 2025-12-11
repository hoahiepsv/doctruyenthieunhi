/**
 * Converts a base64 string to a Uint8Array.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a WAV file header for PCM data.
 * @param dataLength Length of the PCM data in bytes.
 * @param sampleRate Sample rate (e.g., 24000).
 * @param numChannels Number of channels (e.g., 1 for mono).
 * @param bitsPerSample Bits per sample (e.g., 16).
 */
function createWavHeader(dataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // ByteRate
  view.setUint16(32, numChannels * (bitsPerSample / 8), true); // BlockAlign
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  return new Uint8Array(header);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Wraps raw PCM data into a WAV Blob.
 */
export function pcmToWavBlob(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const header = createWavHeader(pcmData.length, sampleRate, 1, 16); // Gemini output is usually 16-bit mono
  return new Blob([header, pcmData], { type: 'audio/wav' });
}

/**
 * Combines multiple WAV blobs into a single WAV blob.
 * Useful for "Read All". 
 * Note: This is a simplified concatenation. Real mixing requires decoding to AudioBuffer.
 * Since we have raw PCM from Gemini (if we kept it), we could concat PCM then add header.
 * But here we will assume we handle playback sequentially in the UI to avoid massive memory usage.
 */
