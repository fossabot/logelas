import { ILogger } from '../log-interface';
var stackTrace = require('stack-trace');

export function MethodName(logger?: ILogger) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        let originalMethod = descriptor.value;
        descriptor.value =
            function (...args: any[]) {
                const name = target.name;

                let informationElement = args[0];
                if (informationElement && informationElement.logelas) {
                    args.unshift(informationElement.logelas.__methodname);
                } else if (informationElement && informationElement.constructor && informationElement.constructor.logelas) {
                    informationElement = informationElement.constructor.logelas.__methodname;
                    args.unshift(informationElement + '  ');
                }

                if (typeof (informationElement) === 'object') {

                    try {
                        args.unshift(informationElement.__proto__.constructor.name);
                    }
                    catch (error) {
                        args.unshift(informationElement.name + '  ');
                    }

                    var trace = stackTrace.get();
                    if (trace.length > 1) {
                        args.unshift(`${args[0]}:: ${trace[1].getFunctionName()}::line:${trace[1].getLineNumber()}`);
                    }
                }
                originalMethod.call(this, ...args);
            }
        return descriptor;
    }
}
