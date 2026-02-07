'use client';

import { useAppDispatch } from '@/store/hooks';

import styles from './page.module.css';

export default function Home() {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.page}>
      <main className={styles.main}></main>
    </div>
  );
}

