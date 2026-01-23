"use client";
import Image from 'next/image';
import styles from './page.module.css';
import MainLayout from './layouts/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <h1>مرحبًا بك في علمني</h1>
      <p>منصة تعليمية مدعومة بالذكاء الاصطناعي لمساعدتك في تعلم اللغة الإنجليزية.</p>
    </MainLayout>
  );
};
