import * as grpc from "@grpc/grpc-js";
import {
  sendUnaryData,
  Server,
  ServerCredentials,
  ServerUnaryCall,
} from "@grpc/grpc-js";
import { GreeterService } from "../../generate/helloworld_grpc_pb";
import { HelloReply, HelloRequest } from "../../generate/helloworld_pb";

const server = new grpc.Server();
const serverAddress = "localhost:5000";

function sayHello(
  call: ServerUnaryCall<HelloRequest, HelloReply>,
  callback: sendUnaryData<HelloReply>
) {
  const greeter = new HelloReply();
  const name = call.request.getName();
  const message = `Hello ${name}`;

  greeter.setMessage(message);
  callback(null, greeter);
}

function startServer() {
  const server = new Server();
  server.addService(GreeterService, { sayHello });
  server.bindAsync(
    serverAddress,
    // SSLを利用しない場合の設定
    ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(error);
      }
      server;
      console.log(`Listening on ${port}`);
    }
  );
}

startServer();
