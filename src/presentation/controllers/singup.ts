export class SignUpController {
    handle (httpRequest: any): any {
        const request = httpRequest;
        if (!request.body.name) return {statusCode: 400, body: new Error('Missing param: name')};
        return {statusCode: 200};
    }
}