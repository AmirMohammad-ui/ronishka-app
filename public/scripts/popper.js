import {
  createPopper
} from '@popperjs/core';

const button = document.querySelector('#button');
const tooltip = document.querySelector('#tooltip');

createPopper(button, tooltip, {
  placement: 'right',
});