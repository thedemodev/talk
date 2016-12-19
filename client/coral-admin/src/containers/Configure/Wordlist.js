import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import styles from './Configure.css';
import {
  Card
} from 'react-mdl';

const Wordlist = ({suspectWords, bannedWords, onChangeWordlist}) => (
  <div>
    <h3>{lang.t('configure.banned-words-title')}</h3>
    <Card id={styles.bannedWordlist} shadow={2}>
      <p className={styles.wordlistHeader}>{lang.t('configure.banned-word-header')}</p>
      <p className={styles.wordlistDesc}>{lang.t('configure.banned-word-text')}</p>
      <textarea
        rows={5}
        type='text'
        className={styles.wordlistInput}
        onChange={e => onChangeWordlist(e, 'banned')}
        value={bannedWords} />
    </Card>
    <h3>{lang.t('configure.suspect-words-title')}</h3>
    <Card id={styles.suspectWordlist} shadow={2}>
      <p className={styles.wordlistHeader}>{lang.t('configure.suspect-word-header')}</p>
      <p className={styles.wordlistDesc}>{lang.t('configure.suspect-word-text')}</p>
      <textarea
        rows={5}
        type='text'
        className={styles.wordlistInput}
        onChange={e => onChangeWordlist(e, 'suspect')}
        value={suspectWords} />
    </Card>
  </div>
);

export default Wordlist;

const lang = new I18n(translations);
