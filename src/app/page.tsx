'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import styles from './page.module.css';

export default function Home() {
  const dispatch = useAppDispatch();
  const { displayMode, currentPage } = useAppSelector((state) => {
    const { displayMode, currentPage } = state.movies;

    return { displayMode, currentPage };
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        
      </main>
    </div>
  );
}
