import { pino } from 'pino';
import { PUBLIC_BASE_URL, PUBLIC_LOG_FILE } from '$env/static/public';


let c_instance;
let s_instance;

class Client_Logger {
    constructor() {
        if(!c_instance) {
            c_instance = this;
        }
        return c_instance;
    }

    async logger(level, mex) {
        const res = await fetch(`${PUBLIC_BASE_URL}/logger`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
                },
            body: JSON.stringify({level: level, mex: mex})
        });
    }

    async debug(mex) {
        await this.logger('debug', mex);
    }

    async info(mex) {
        await this.logger('info', mex);
    }

    async warn(mex) {
        await this.logger('warn', mex);
    }

    async error(mex) {
        await this.logger('error', mex);
    }
}

class Server_Logger {
    side = 'server';
    constructor() {
        if(!s_instance) {
            s_instance = this;
            this.logger = pino({
                level: 'debug',
                transport: {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        ignore: 'pid,hostname',
                        customColors: 'debug:green,info:yellow,warn:blue,error:bgRed',
                        destination: PUBLIC_LOG_FILE,
                        messageFormat: '{spacer}[{side}] - {msg}\n',
                        singleLine: true,
                        hideObject: true,
                        translateTime: 'yyyy-mm-dd-HH:MM:ss'
                    }
                }
            });
        }
        return s_instance;
    }

    debug(mex) {
        this.logger?.debug({spacer: '', side: this.side, msg: mex});
    }

    info(mex) {
        this.logger?.info({spacer: ' ', side: this.side, msg: mex});
    }

    warn(mex) {
        this.logger?.warn({spacer: ' ', side: this.side, msg: mex});
    }

    error(mex) {
        this.logger?.error({spacer: '', side: this.side, msg: mex});
    }

    log(level, mex) {
        this.side = 'client';
        switch(level) {
            case 'debug':
                this.debug(mex);
                break;
            case 'info':
                this.info(mex);
                break;
            case 'warn':
                this.warn(mex);
                break;
            case 'error':
                this.error(mex);
                break;
        }
        this.side = 'server';
    }
}

export class Logger {
    logger = null;
    constructor(type) {
        if(type == "client")
            this.logger = new Client_Logger();
        else if(type == "server")
            this.logger = new Server_Logger();
    }

    debug(mex) {
        this.logger.debug(mex);
    }

    info(mex) {
        this.logger.info(mex);
    }

    warn(mex) {
        this.logger.warn(mex);
    }

    error(mex) {
        this.logger.error(mex);
    }

    log(level, mex) {
        this.logger.log(level, mex);
    }
}

