// read a policy yaml file and generates a js object file
import yaml from 'js-yaml';
import * as fs from 'fs';

const POLICY_IN_FILE = 'server_static/rbac/acl.yml';
const POLICY_OUT_FILE = 'src/js/policy.js';

console.log('generating acl policy file');
const doc = yaml.load(fs.readFileSync(POLICY_IN_FILE, 'utf8'), { json: false });
fs.writeFileSync(POLICY_OUT_FILE, `export const policy = JSON.parse('${JSON.stringify(doc)}');`);
console.log('policy file generated succesfully');
