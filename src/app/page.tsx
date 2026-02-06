import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: {
    template: 'Flex Movie List - %s',
    default: 'Flex Movie List',
  },
  description: 'Flex Systems technical exam from Erez Bracha',
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        
      </main>
    </div>
  );
}

