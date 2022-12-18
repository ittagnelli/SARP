import { pino } from 'pino';
import { PUBLIC_AUDIT_FILE } from '$env/static/public';

let audit_instance;

export let audit_mex = function (uid, user, model, action, old_obj, new_obj, mex = '') {
    (this.uid = uid),
    (this.user = user), 
    (this.model = model),
    (this.action = action),
    (this.old_obj = old_obj),
    (this.new_obj = new_obj),
    (this.mex = mex)
};

export class Auditor {
    constructor() {
        if(!audit_instance) {
            audit_instance = this;
            this.logger = pino({
                transport: {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        ignore: 'pid,hostname',
                        customColors: 'info:green',
                        destination: PUBLIC_AUDIT_FILE,
                        messageFormat: '[{uid}][{user}][{model}][{action}][OLD:{old_obj}][NEW:{new_obj}][{mex}]\n',
                        singleLine: true,
                        hideObject: true,
                        translateTime: 'yyyy-mm-dd-HH:MM:ss'
                    }
                }
            });
        }
        return audit_instance;
    }

    audit(mex) {
        this.logger?.info(mex);
    }
}
