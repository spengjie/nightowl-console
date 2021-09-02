import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';

const IP_REGEX = '(?:2[0-4]\\d|25[0-5]|[01]?\\d\\d?)(?:\\.(?:2[0-4]\\d|25[0-5]|[01]?\\d\\d?)){3}(?:/(?:3[0-2]|[12]\\d|\\d))?';
const NUM_REGEX = '\\d+(?:\\.\\d+)?';

CodeMirror.defineSimpleMode('cisco-like_config', {
  start: [
    {
      regex: '^ *! .+$',
      sol: true,
      token: 'comment',
    },
    {
      regex: '^(hostname|interface|vrf definition)( \\S+)',
      sol: true,
      token: ['keyword', 'def'],
    },
    {
      regex: '^(router)( \\S+)(?:( vrf)( \\S+))?',
      sol: true,
      token: ['keyword', 'def', 'keyword', 'def'],
    },
    {
      regex: '\\s' + IP_REGEX + '(?=\\s|$)',
      token: 'string',
    },
    {
      regex: '^' + IP_REGEX + '(?=\\s|$)',
      token: 'string',
      sol: true,
    },
    {
      regex: '\\s' + NUM_REGEX + '(?=\\s|$)',
      token: 'number',
    },
    {
      regex: '^' + NUM_REGEX + '(?=\\s|$)',
      token: 'number',
      sol: true,
    },
  ],
  meta: {
    fold: 'indent',
  }
});
