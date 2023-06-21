import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const AuthJwtPayload = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { user: UserPayloadSerialization }>();
        return data ? user[data] : user;
    }
);
