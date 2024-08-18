import { GreeterClient } from "../../generate/helloworld_grpc_pb";
import { HelloRequest } from "../../generate/helloworld_pb";

import { credentials } from "@grpc/grpc-js";

const serverURL = 'localhost:5000';

export type RequestParams = {
  name?: string;
};

export function sayHello({ name = "World" }: RequestParams) {
  const Request = new HelloRequest();
  const Client = new GreeterClient(
    serverURL,
    credentials.createInsecure(),
  );
  Request.setName(name);

  return new Promise((resolve, reject) => {
    Client.sayHello(Request, (error, response) => {
      if (error) {
        console.error(error);
        reject({
          code: error?.code || 500,
          message: error?.message || "something went wrong",
        });
      }

      return resolve(response.toObject());
    });
  });
}