import { PrismaClient } from '@prisma/client';
import { Auditor, audit_mex } from './audit';

let prisma_instance;

export class PrismaDB extends PrismaClient {
    constructor() {
        if(!prisma_instance) {
            super();
            this.__init();
            this.auditor = new Auditor();
            prisma_instance = this;
        }
        return prisma_instance;
    }

    set_session(session) {
        this.session = session;
    }

    __init() {
        this.$use(async (params, next) => {
            let action = params.action || null;
            let model = params.model;

            if(['create', 'update', 'delete'].includes(action) && model != 'Session') {
                let old_obj;
                let new_obj = params.args?.data || null;
                let old_id = params.args?.where?.id || null;

                if(old_id != null) {
                    old_obj = await this[model].findUnique({
                        where: { id: old_id }
                    });
                }

                let obj_audit = new audit_mex(
                                              this.session?.session?.login?.id, 
                                              `${this.session?.session?.login?.cognome}-${this.session?.session?.login?.nome}`, 
                                              model, 
                                              action, 
                                              JSON.stringify(old_obj), 
                                              JSON.stringify(new_obj)
                );
                this.auditor?.audit(obj_audit);
            }
    
            const result = await next(params)
            return result
          })
    }
}