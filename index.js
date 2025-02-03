import Head from 'next/head';
import styles from '../styles/Home.module.css'; // For styling, we will use this

export default function Home() {
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mis Rahat</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&family=Raleway:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.container}>
        <h1>গালি দিলাম না!</h1>
        <p>
          আমাদের প্রত্যেকের উচিত নিজ নিজ মাতৃভাষায় কথা বলা। সবাই তার মনের ভাব প্রকাশ করতে চায়,
          কিন্তু <i>Rahat</i> এর মতো একজন থাকার কারণে কেউই তা প্রকাশ করতে পারে না।
          তাই, আমরা এই অবস্থা থেকে মুক্তি চাই।
        </p>
        <p>
          এছাড়াও, রাহাত তার রেজিস্ট্রেশন নাম্বার আমার সামনে ভুল করে,  
          টাকা দিয়ে কিংবা হুমকি দিয়ে বলে – "আমার আম্মুকে বলিস না!"  
          অথচ, সে তার মার সামনেই জুয়া খেলে!  
          আমি নিষেধ করলে সে আমাকে বলে:
        </p>
        <p className={styles.quote}>
          "কি হইছে? তোর ডিস্টার্ব করিস কেন? চুপ থাক!"
        </p>
        <audio controls autoPlay>
          <source src="Surah.mp3" />
        </audio>
      </div>

      <div className={styles.wave}></div>
    </>
  );
}