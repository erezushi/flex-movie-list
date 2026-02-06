'use client'

import { Provider } from 'react-redux';
import styles from './page.module.css';
import store from '@/store';

export default function Home() {
  return (
    <div className={styles.page}>
      <Provider store={store}>
        <main className={styles.main}></main>
      </Provider>
    </div>
  );
}

