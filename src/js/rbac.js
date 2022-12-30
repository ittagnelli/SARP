import { policy } from './policy';

let rbac_instance;

export class RBAC {
	constructor() {
		if (!rbac_instance) {
			rbac_instance = this;
		}
		this.acl = policy;
		return rbac_instance;
	}

	grant(role, action, resource) {
		if (!(resource in this.acl)) return false;
		if (!(action in this.acl[resource])) return false;
		if (this.acl[resource][action] == null) return false;
		if (this.acl[resource][action][0] == '*') return true;
		return this.acl[resource][action].includes(role);
	}
}
