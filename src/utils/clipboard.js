import { Message } from 'element-ui';
import i18n from '@/i18n';

export function copyText(text) {
  const textarea = document.createElement('textarea');
  const currentFocus = document.activeElement;
  const body = document.getElementsByTagName('body')[0];
  body.appendChild(textarea);
  textarea.value = text;
  textarea.focus();
  if (textarea.setSelectionRange) {
      textarea.setSelectionRange(0, textarea.value.length);
  } else {
      textarea.select();
  }
  try {
    document.execCommand('copy');
    Message({
      message: i18n.t('message.form.copied'),
      type: 'success',
      showClose: true,
      duration: 2 * 1000,
    });
  } catch (error) {
    Message({
      message: i18n.t('message.form.error', { error }),
      type: 'success',
      showClose: true,
      duration: 2 * 1000,
    });
  }
  body.removeChild(textarea);
  currentFocus.focus();
}
