import React from "react";
import { Message } from "semantic-ui-react";

interface Props {
    errors: any;
}

export default function ValidationErrors({errors}: Props) {
    return (
        <Message error>
            {errors && (
                <Message.List>
                    {typeof(errors) === "string" && <Message.Item>{errors}</Message.Item>}
                    {Array.isArray(errors) && errors.map((err: any, i) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}
        </Message>
    )
}