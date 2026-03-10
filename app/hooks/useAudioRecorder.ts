'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Detect the best supported audio MIME type.
 * Tries WebM first (Chrome/Firefox), then MP4 (Safari/iOS), then OGG.
 */
function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

type RecordingStatus = 'idle' | 'acquiring_media' | 'recording' | 'stopped';

interface UseAudioRecorderReturn {
  status: RecordingStatus;
  mediaBlobUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearBlobUrl: () => void;
  isSupported: boolean;
  error: string | null;
}

/**
 * Cross-platform audio recording hook.
 * Works on Chrome, Firefox, Safari, and iOS Safari by auto-detecting
 * the best supported MIME type (WebM → MP4 → OGG).
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setIsSupported(!!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined');
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('التسجيل الصوتي غير مدعوم في هذا المتصفح');
      return;
    }

    try {
      setError(null);
      setStatus('acquiring_media');

      if (mediaBlobUrl) {
        URL.revokeObjectURL(mediaBlobUrl);
        setMediaBlobUrl(null);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      chunksRef.current = [];

      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const recordedMime = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: recordedMime });
        setMediaBlobUrl(URL.createObjectURL(blob));
        setStatus('stopped');
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.onerror = () => {
        setError('حدث خطأ أثناء التسجيل');
        setStatus('idle');
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus('recording');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('Permission') || msg.includes('NotAllowed')) {
        setError('يرجى السماح بالوصول إلى الميكروفون');
      } else {
        setError('تعذر بدء التسجيل');
      }
      setStatus('idle');
    }
  }, [isSupported, mediaBlobUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const clearBlobUrl = useCallback(() => {
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl);
      setMediaBlobUrl(null);
    }
    setStatus('idle');
  }, [mediaBlobUrl]);

  return { status, mediaBlobUrl, startRecording, stopRecording, clearBlobUrl, isSupported, error };
}
