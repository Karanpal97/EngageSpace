import { Message } from "../model/user";

export interface ApiResponce {
    success: boolean;
    message: string;
    status: number;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}
