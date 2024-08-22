/* eslint-disable perfectionist/sort-objects */

const { defineInstrument } = await import('/runtime/v1/@opendatacapture/runtime-core/index.js');
const { z } = await import('/runtime/v1/zod@3.23.x/index.js');

import logoSrc from './logo.png';

import './styles.css';

export default defineInstrument({
  kind: 'INTERACTIVE',
  language: 'en',
  internal: {
    edition: 1,
    name: '<PLACEHOLDER>'
  },
  tags: ['<PLACEHOLDER>'],
  content: {
    render(done) {
      const logo = document.createElement('img');
      logo.classList.add('logo');
      logo.alt = 'Open Data Capture Logo';
      logo.src = logoSrc;
      document.body.appendChild(logo);
      const button = document.createElement('button');
      button.classList.add('submit-button');
      button.textContent = 'Submit Instrument';
      document.body.appendChild(button);
      button.addEventListener('click', () => {
        done({ message: 'Hello World' });
      });
    }
  },
  details: {
    description: '<PLACEHOLDER>',
    estimatedDuration: 1,
    instructions: ['<PLACEHOLDER>'],
    license: 'UNLICENSED',
    title: '<PLACEHOLDER>'
  },
  measures: {},
  validationSchema: z.object({
    message: z.string()
  })
});
