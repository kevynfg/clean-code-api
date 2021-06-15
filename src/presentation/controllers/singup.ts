export class SignUpController {
    handle (httpRequest: any): any {
        const request = httpRequest;
        if (!request.body.name) return {statusCode: 400};
        return {statusCode: 200};
    }
}